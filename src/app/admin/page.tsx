'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import styles from './page.module.css';

interface Calendario {
  id: string;
  nombre: string;
  permitirInvitados: boolean;
  mensajeCierre?: string;
  limitesAgendar: number;
}

interface Dueno {
  id: string;
  nombre: string;
  apellido: string;
  puesto: string;
  correo: string;
  tipo: string;
  estado: string;
  organizacionId: string;
  organizacion?: { nombre: string };
  calendario?: Calendario;
  fechaInicioAusencia?: string;
  fechaFinAusencia?: string;
  causaAusencia?: string;
}

interface Organizacion {
  id: string;
  nombre: string;
  pais: string;
  region: string;
  imagenUrl?: string;
  leyenda?: string;
  duenos: Dueno[];
}

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState<'orgs' | 'owners'>('orgs');
  const [orgs, setOrgs] = useState<Organizacion[]>([]);
  const [owners, setOwners] = useState<Dueno[]>([]);
  
  // Modals and Forms states
  const [showOrgModal, setShowOrgModal] = useState(false);
  const [showOwnerModal, setShowOwnerModal] = useState(false);
  const [showStateModal, setShowStateModal] = useState(false);
  const [showReassignModal, setShowReassignModal] = useState(false);
  const [selectedOwner, setSelectedOwner] = useState<Dueno | null>(null);
  const [selectedAssistantId, setSelectedAssistantId] = useState('');
  const [deleteConfirm, setDeleteConfirm] = useState<{ type: 'org' | 'owner', id: string, name: string } | null>(null);

  // New Org Form
  const [newOrg, setNewOrg] = useState({ nombre: '', pais: 'México', region: '', leyenda: '', imagenUrl: '' });
  // New Owner Form
  const [newOwner, setNewOwner] = useState({ nombre: '', apellido: '', puesto: '', correo: '', tipo: 'DUEÑO_DE_CALENDARIO', organizacionId: '' });
  // State Change Form
  const [newState, setNewState] = useState({ estado: 'ACTIVO', causaAusencia: '', fechaInicioAusencia: '', fechaFinAusencia: '' });

  // Fetch Data
  const fetchData = async () => {
    try {
      const orgsRes = await fetch('/api/organizations');
      const orgsData = await orgsRes.json();
      setOrgs(Array.isArray(orgsData) ? orgsData : []);

      const ownersRes = await fetch('/api/owners');
      const ownersData = await ownersRes.json();
      setOwners(Array.isArray(ownersData) ? ownersData : []);
    } catch (e) {
      console.error("Error cargando datos:", e);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // Handlers
  const handleCreateOrg = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch('/api/organizations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newOrg),
      });
      if (res.ok) {
        setShowOrgModal(false);
        setNewOrg({ nombre: '', pais: 'México', region: '', leyenda: '', imagenUrl: '' });
        fetchData();
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleCreateOwner = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newOwner.organizacionId) return alert("Selecciona una organización");
    try {
      const res = await fetch('/api/owners', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newOwner),
      });
      if (res.ok) {
        setShowOwnerModal(false);
        setNewOwner({ nombre: '', apellido: '', puesto: '', correo: '', tipo: 'DUEÑO_DE_CALENDARIO', organizacionId: '' });
        fetchData();
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleUpdateOwnerState = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedOwner) return;
    try {
      const res = await fetch(`/api/owners/${selectedOwner.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...selectedOwner,
          estado: newState.estado,
          causaAusencia: newState.estado === 'AUSENTE_TEMPORAL' ? newState.causaAusencia : null,
          fechaInicioAusencia: newState.estado === 'AUSENTE_TEMPORAL' ? newState.fechaInicioAusencia : null,
          fechaFinAusencia: newState.estado === 'AUSENTE_TEMPORAL' ? newState.fechaFinAusencia : null,
        }),
      });
      if (res.ok) {
        setShowStateModal(false);
        setSelectedOwner(null);
        setNewState({ estado: 'ACTIVO', causaAusencia: '', fechaInicioAusencia: '', fechaFinAusencia: '' });
        fetchData();
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleReassignCalendar = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedOwner?.calendario?.id || !selectedAssistantId) return;
    try {
      const res = await fetch(`/api/calendars/${selectedOwner.calendario.id}/reassign`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ newOwnerId: selectedAssistantId }),
      });
      if (res.ok) {
        setShowReassignModal(false);
        setSelectedOwner(null);
        setSelectedAssistantId('');
        fetchData();
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleDelete = async () => {
    if (!deleteConfirm) return;
    try {
      const endpoint = deleteConfirm.type === 'org' ? `/api/organizations/${deleteConfirm.id}` : `/api/owners/${deleteConfirm.id}`;
      const res = await fetch(endpoint, { method: 'DELETE' });
      if (res.ok) {
        setDeleteConfirm(null);
        fetchData();
      }
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <div className={styles.headerContent}>
          {/* IDENTIDAD ORGANIZACIÓN */}
          <div className={styles.leftHeader}>
            <div className={styles.orgPlaceholder}>🏢</div>
            <div className={styles.orgText}>
              <span className={styles.orgName}>SISTEMA GENERAL</span>
              <span className={styles.orgSlogan}>Administración Central</span>
            </div>
          </div>

          {/* ACTOR / ROL */}
          <div className={styles.centerHeader}>
            <span className={styles.actorRole}>ADMINISTRADOR</span>
            <div className={styles.tabs}>
              <button 
                className={activeTab === 'orgs' ? styles.activeTab : ''} 
                onClick={() => setActiveTab('orgs')}
              >
                🏢 Organizaciones ({orgs.length})
              </button>
              <button 
                className={activeTab === 'owners' ? styles.activeTab : ''} 
                onClick={() => setActiveTab('owners')}
              >
                👥 Dueños / Asistentes ({owners.length})
              </button>
            </div>
          </div>

          {/* ACTOR DETALLES Y NAVEGACIÓN */}
          <div className={styles.rightHeader}>
            <span className={styles.actorName}>Administrador Global</span>
            <span className={styles.actorPage}>ADMINISTRACIÓN / {activeTab === 'orgs' ? 'ORGANIZACIONES' : 'MIEMBROS'}</span>
            <Link href="/" className={styles.exitBtn}>
              GUARDAR Y SALIR
            </Link>
          </div>
        </div>
      </header>

      <main className={styles.main}>
        {activeTab === 'orgs' ? (
          <section className={styles.section}>
            <div className={styles.sectionHeader}>
              <h2>Lista de Organizaciones</h2>
              <button className={styles.primaryBtn} onClick={() => setShowOrgModal(true)}>
                + Nueva Organización
              </button>
            </div>

            <div className={styles.grid}>
              {orgs.map((org) => (
                <div key={org.id} className={styles.card}>
                  <div className={styles.cardHeader}>
                    {org.imagenUrl ? (
                      <img src={org.imagenUrl} alt={org.nombre} className={styles.avatar} />
                    ) : (
                      <div className={styles.avatarPlaceholder}>🏢</div>
                    )}
                    <div>
                      <h3>{org.nombre}</h3>
                      <span>{org.region}, {org.pais}</span>
                    </div>
                  </div>
                  <p className={styles.cardDesc}>{org.leyenda || 'Sin descripción'}</p>
                  <div className={styles.cardFooter}>
                    <span>👥 {org.duenos?.length || 0} Miembros</span>
                    <button 
                      className={styles.deleteBtn} 
                      onClick={() => setDeleteConfirm({ type: 'org', id: org.id, name: org.nombre })}
                    >
                      Eliminar
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </section>
        ) : (
          <section className={styles.section}>
            <div className={styles.sectionHeader}>
              <h2>Dueños de Calendario y Asistentes</h2>
              <button className={styles.primaryBtn} onClick={() => setShowOwnerModal(true)}>
                + Nuevo Miembro
              </button>
            </div>

            <div className={styles.tableWrapper}>
              <table className={styles.table}>
                <thead>
                  <tr>
                    <th>Nombre</th>
                    <th>Puesto / Correo</th>
                    <th>Organización</th>
                    <th>Tipo</th>
                    <th>Estado</th>
                    <th>Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {owners.map((owner) => (
                    <tr key={owner.id}>
                      <td className={styles.ownerName}>
                        {owner.nombre} {owner.apellido}
                      </td>
                      <td>
                        <div className={styles.puestoText}>{owner.puesto}</div>
                        <div className={styles.correoText}>{owner.correo}</div>
                      </td>
                      <td>{owner.organizacion?.nombre}</td>
                      <td>
                        <span className={owner.tipo === 'DUEÑO_DE_CALENDARIO' ? styles.badgeBlue : styles.badgeOrange}>
                          {owner.tipo === 'DUEÑO_DE_CALENDARIO' ? 'Dueño' : 'Asistente'}
                        </span>
                      </td>
                      <td>
                        <span className={`${styles.badge} ${
                          owner.estado === 'ACTIVO' ? styles.badgeGreen : 
                          owner.estado === 'AUSENTE_TEMPORAL' ? styles.badgeYellow : 
                          owner.estado === 'EN_TRANSICION' ? styles.badgeRed : styles.badgeGray
                        }`}>
                          {owner.estado.replace('_', ' ')}
                        </span>
                      </td>
                      <td>
                        <div className={styles.actionGroup}>
                          <button 
                            className={styles.actionBtn} 
                            onClick={() => {
                              setSelectedOwner(owner);
                              setNewState({
                                estado: owner.estado,
                                causaAusencia: owner.causaAusencia || '',
                                fechaInicioAusencia: owner.fechaInicioAusencia ? owner.fechaInicioAusencia.split('T')[0] : '',
                                fechaFinAusencia: owner.fechaFinAusencia ? owner.fechaFinAusencia.split('T')[0] : '',
                              });
                              setShowStateModal(true);
                            }}
                          >
                            Estado
                          </button>
                          {owner.tipo === 'DUEÑO_DE_CALENDARIO' && owner.calendario && (
                            <button 
                              className={styles.actionBtn} 
                              onClick={() => {
                                setSelectedOwner(owner);
                                setSelectedAssistantId('');
                                setShowReassignModal(true);
                              }}
                            >
                              Traspasar
                            </button>
                          )}
                          <button 
                            className={styles.deleteLink}
                            onClick={() => setDeleteConfirm({ type: 'owner', id: owner.id, name: `${owner.nombre} ${owner.apellido}` })}
                          >
                            Eliminar
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        )}
      </main>

      {/* Org Modal */}
      {showOrgModal && (
        <div className={styles.modalOverlay}>
          <div className={styles.modal}>
            <h2>Alta de Organización</h2>
            <form onSubmit={handleCreateOrg}>
              <div className={styles.formGroup}>
                <label>Nombre de la Organización</label>
                <input 
                  type="text" required 
                  value={newOrg.nombre} 
                  onChange={(e) => setNewOrg({ ...newOrg, nombre: e.target.value })}
                />
              </div>
              <div className={styles.formRow}>
                <div className={styles.formGroup}>
                  <label>País</label>
                  <input 
                    type="text" required 
                    value={newOrg.pais} 
                    onChange={(e) => setNewOrg({ ...newOrg, pais: e.target.value })}
                  />
                </div>
                <div className={styles.formGroup}>
                  <label>Región / Estado</label>
                  <input 
                    type="text" required 
                    value={newOrg.region} 
                    onChange={(e) => setNewOrg({ ...newOrg, region: e.target.value })}
                  />
                </div>
              </div>
              <div className={styles.formGroup}>
                <label>Logo / Imagen URL</label>
                <input 
                  type="url" 
                  placeholder="https://ejemplo.com/logo.png"
                  value={newOrg.imagenUrl} 
                  onChange={(e) => setNewOrg({ ...newOrg, imagenUrl: e.target.value })}
                />
              </div>
              <div className={styles.formGroup}>
                <label>Leyenda / Presentación</label>
                <textarea 
                  rows={3}
                  value={newOrg.leyenda} 
                  onChange={(e) => setNewOrg({ ...newOrg, leyenda: e.target.value })}
                />
              </div>
              <div className={styles.modalActions}>
                <button type="button" className={styles.cancelBtn} onClick={() => setShowOrgModal(false)}>Cancelar</button>
                <button type="submit" className={styles.primaryBtn}>Registrar</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Owner Modal */}
      {showOwnerModal && (
        <div className={styles.modalOverlay}>
          <div className={styles.modal}>
            <h2>Alta de Dueño / Asistente</h2>
            <form onSubmit={handleCreateOwner}>
              <div className={styles.formRow}>
                <div className={styles.formGroup}>
                  <label>Nombre</label>
                  <input 
                    type="text" required 
                    value={newOwner.nombre} 
                    onChange={(e) => setNewOwner({ ...newOwner, nombre: e.target.value })}
                  />
                </div>
                <div className={styles.formGroup}>
                  <label>Apellido</label>
                  <input 
                    type="text" required 
                    value={newOwner.apellido} 
                    onChange={(e) => setNewOwner({ ...newOwner, apellido: e.target.value })}
                  />
                </div>
              </div>
              <div className={styles.formGroup}>
                <label>Puesto</label>
                <input 
                  type="text" required 
                  value={newOwner.puesto} 
                  onChange={(e) => setNewOwner({ ...newOwner, puesto: e.target.value })}
                />
              </div>
              <div className={styles.formGroup}>
                <label>Correo Electrónico</label>
                <input 
                  type="email" required 
                  value={newOwner.correo} 
                  onChange={(e) => setNewOwner({ ...newOwner, correo: e.target.value })}
                />
              </div>
              <div className={styles.formGroup}>
                <label>Organización</label>
                <select 
                  required
                  value={newOwner.organizacionId}
                  onChange={(e) => setNewOwner({ ...newOwner, organizacionId: e.target.value })}
                >
                  <option value="">-- Selecciona --</option>
                  {orgs.map(org => (
                    <option key={org.id} value={org.id}>{org.nombre}</option>
                  ))}
                </select>
              </div>
              <div className={styles.formGroup}>
                <label>Tipo de Miembro</label>
                <select 
                  value={newOwner.tipo}
                  onChange={(e) => setNewOwner({ ...newOwner, tipo: e.target.value })}
                >
                  <option value="DUEÑO_DE_CALENDARIO">Dueño de Calendario</option>
                  <option value="ASISTENTE_DE_TRANSICION">Asistente de Transición</option>
                </select>
              </div>
              <div className={styles.modalActions}>
                <button type="button" className={styles.cancelBtn} onClick={() => setShowOwnerModal(false)}>Cancelar</button>
                <button type="submit" className={styles.primaryBtn}>Registrar</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* State Modal */}
      {showStateModal && selectedOwner && (
        <div className={styles.modalOverlay}>
          <div className={styles.modal}>
            <h2>Cambiar Estado: {selectedOwner.nombre} {selectedOwner.apellido}</h2>
            <form onSubmit={handleUpdateOwnerState}>
              <div className={styles.formGroup}>
                <label>Nuevo Estado</label>
                <select 
                  value={newState.estado}
                  onChange={(e) => setNewState({ ...newState, estado: e.target.value })}
                >
                  <option value="ACTIVO">Activo</option>
                  <option value="AUSENTE_TEMPORAL">Ausente Temporalmente</option>
                  <option value="EN_TRANSICION">En Transición</option>
                  <option value="BAJA">Baja</option>
                </select>
              </div>

              {newState.estado === 'AUSENTE_TEMPORAL' && (
                <>
                  <div className={styles.formRow}>
                    <div className={styles.formGroup}>
                      <label>Fecha Inicio</label>
                      <input 
                        type="date" required
                        value={newState.fechaInicioAusencia}
                        onChange={(e) => setNewState({ ...newState, fechaInicioAusencia: e.target.value })}
                      />
                    </div>
                    <div className={styles.formGroup}>
                      <label>Fecha Fin</label>
                      <input 
                        type="date" required
                        value={newState.fechaFinAusencia}
                        onChange={(e) => setNewState({ ...newState, fechaFinAusencia: e.target.value })}
                      />
                    </div>
                  </div>
                  <div className={styles.formGroup}>
                    <label>Causa de Ausencia</label>
                    <textarea 
                      required rows={3}
                      placeholder="Indica la razón de la ausencia..."
                      value={newState.causaAusencia}
                      onChange={(e) => setNewState({ ...newState, causaAusencia: e.target.value })}
                    />
                  </div>
                </>
              )}

              {newState.estado === 'BAJA' && (
                <div className={styles.warningAlert}>
                  ⚠️ <strong>Cuidado:</strong> Al marcar como "Baja", el dueño, su calendario asociado y todos sus eventos se eliminarán de forma permanente.
                </div>
              )}

              <div className={styles.modalActions}>
                <button type="button" className={styles.cancelBtn} onClick={() => {
                  setShowStateModal(false);
                  setSelectedOwner(null);
                }}>
                  Cancelar
                </button>
                <button type="submit" className={styles.primaryBtn}>Guardar Cambios</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deleteConfirm && (
        <div className={styles.modalOverlay}>
          <div className={styles.modal}>
            <h2 className={styles.warnTitle}>⚠️ Confirmar Eliminación en Cascada</h2>
            <p>
              ¿Estás seguro de que deseas eliminar permanentemente a: <strong>{deleteConfirm.name}</strong>?
            </p>
            <div className={styles.warningAlert}>
              Esta acción es irreversible y eliminará todos los registros hijos asociados (miembros, calendarios, eventos agendados y sus archivos adjuntos) en cascada.
            </div>
            <div className={styles.modalActions}>
              <button className={styles.cancelBtn} onClick={() => setDeleteConfirm(null)}>Cancelar</button>
              <button className={styles.dangerBtn} onClick={handleDelete}>Confirmar y Eliminar</button>
            </div>
          </div>
        </div>
      )}
      {/* Reassign Calendar Modal */}
      {showReassignModal && selectedOwner && (
        <div className={styles.modalOverlay}>
          <div className={styles.modal}>
            <h2>Traspasar Calendario: {selectedOwner.nombre} {selectedOwner.apellido}</h2>
            <form onSubmit={handleReassignCalendar}>
              <p className={styles.desc} style={{ color: '#94a3b8', fontSize: '0.95rem', marginBottom: '1.5rem', lineHeight: '1.5' }}>
                Selecciona un Asistente de Transición activo dentro de la misma organización para traspasarle la propiedad de este calendario. El asistente pasará a ser el Dueño del Calendario de forma automática.
              </p>

              <div className={styles.formGroup}>
                <label>Asistente de Transición Destino</label>
                <select 
                  required
                  value={selectedAssistantId}
                  onChange={(e) => setSelectedAssistantId(e.target.value)}
                >
                  <option value="">-- Selecciona Asistente --</option>
                  {owners
                    .filter(o => 
                      o.organizacionId === selectedOwner.organizacionId && 
                      o.tipo === 'ASISTENTE_DE_TRANSICION' && 
                      o.estado === 'ACTIVO'
                    )
                    .map(o => (
                      <option key={o.id} value={o.id}>{o.nombre} {o.apellido} ({o.puesto})</option>
                    ))}
                </select>
              </div>

              <div className={styles.modalActions}>
                <button type="button" className={styles.cancelBtn} onClick={() => {
                  setShowReassignModal(false);
                  setSelectedOwner(null);
                  setSelectedAssistantId('');
                }}>
                  Cancelar
                </button>
                <button type="submit" className={styles.primaryBtn} disabled={!selectedAssistantId}>
                  Confirmar Traspaso
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
