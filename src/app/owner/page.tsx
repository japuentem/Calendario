'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import styles from './page.module.css';

interface Participante {
  id: string;
  nombre: string;
  apellido: string;
  correo: string;
  telefono?: string;
  esCreador: boolean;
}

interface Evento {
  id: string;
  tema: string;
  fecha: string;
  horaInicio: string;
  duracion: number;
  estado: string; // PENDIENTE | EJECUTADO
  archivoAdjuntoUrl?: string;
  participantes: Participante[];
}

interface TipoEvento {
  id: string;
  nombre: string;
  duracion: number;
  margenSeguridad: number;
}

interface Disponibilidad {
  id: string;
  diaSemana: number;
  horaInicio: string;
  horaFin: string;
}

interface FechaEspecial {
  id: string;
  fecha: string;
  horaInicio: string;
  horaFin: string;
}

interface Calendario {
  id: string;
  nombre: string;
  permitirInvitados: boolean;
  mensajeCierre?: string;
  imagenPresentacion?: string;
  limitesAgendar: number;
  limitesCancelar: number;
  limitesReagendar: number;
  tiposEventos: TipoEvento[];
  disponibilidades: Disponibilidad[];
  fechasEspeciales: FechaEspecial[];
}

interface Owner {
  id: string;
  nombre: string;
  apellido: string;
  puesto: string;
  correo: string;
  estado: string;
  calendario?: Calendario;
  organizacion?: {
    nombre: string;
    imagenUrl?: string;
    leyenda?: string;
  };
}

export default function OwnerDashboard() {
  const [owners, setOwners] = useState<Owner[]>([]);
  const [selectedOwner, setSelectedOwner] = useState<Owner | null>(null);
  const [events, setEvents] = useState<Evento[]>([]);
  
  // Settings tab selection
  const [activeSection, setActiveSection] = useState<'profile' | 'availability' | 'events'>('events');

  // Form states
  const [profileForm, setProfileForm] = useState({
    nombre: '',
    permitirInvitados: true,
    mensajeCierre: '',
    imagenPresentacion: '',
    limitesAgendar: 30,
    limitesCancelar: 24,
    limitesReagendar: 24
  });

  const [disponibilidades, setDisponibilidades] = useState<Disponibilidad[]>([]);
  const [fechasEspeciales, setFechasEspeciales] = useState<FechaEspecial[]>([]);
  const [tiposEventos, setTiposEventos] = useState<TipoEvento[]>([]);
  const [newSpecialDate, setNewSpecialDate] = useState({ fecha: '', horaInicio: '09:00', horaFin: '18:00' });

  // Event actions
  const [activeMenuEventId, setActiveMenuEventId] = useState<string | null>(null);
  const [showDetailsModal, setShowDetailsModal] = useState<Evento | null>(null);

  const fetchOwners = async () => {
    try {
      const res = await fetch('/api/owners');
      const data = await res.json();
      if (Array.isArray(data) && data.length > 0) {
        setOwners(data);
        // Default to the first owner if none selected
        if (!selectedOwner) {
          setSelectedOwner(data[0]);
        } else {
          // Keep current owner data updated
          const updated = data.find(o => o.id === selectedOwner.id);
          if (updated) setSelectedOwner(updated);
        }
      }
    } catch (e) {
      console.error(e);
    }
  };

  const fetchEvents = async () => {
    if (!selectedOwner?.calendario?.id) return;
    try {
      const res = await fetch(`/api/bookings?calendarId=${selectedOwner.calendario.id}`);
      const data = await res.json();
      setEvents(Array.isArray(data) ? data : []);
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    fetchOwners();
  }, []);

  useEffect(() => {
    if (selectedOwner) {
      fetchEvents();
      if (selectedOwner.calendario) {
        setProfileForm({
          nombre: selectedOwner.calendario.nombre,
          permitirInvitados: selectedOwner.calendario.permitirInvitados,
          mensajeCierre: selectedOwner.calendario.mensajeCierre || '',
          imagenPresentacion: selectedOwner.calendario.imagenPresentacion || '',
          limitesAgendar: selectedOwner.calendario.limitesAgendar,
          limitesCancelar: selectedOwner.calendario.limitesCancelar,
          limitesReagendar: selectedOwner.calendario.limitesReagendar
        });
        setDisponibilidades(selectedOwner.calendario.disponibilidades);
        setFechasEspeciales(selectedOwner.calendario.fechasEspeciales);
        setTiposEventos(selectedOwner.calendario.tiposEventos);
      }
    }
  }, [selectedOwner]);

  // Handlers
  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedOwner?.calendario?.id) return;
    try {
      const res = await fetch(`/api/calendars/${selectedOwner.calendario.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...profileForm,
          tiposEventos,
          disponibilidades,
          fechasEspeciales
        })
      });
      if (res.ok) {
        alert("Configuración guardada exitosamente");
        fetchOwners();
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleSaveAvailability = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedOwner?.calendario?.id) return;
    try {
      const res = await fetch(`/api/calendars/${selectedOwner.calendario.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...profileForm,
          tiposEventos,
          disponibilidades,
          fechasEspeciales
        })
      });
      if (res.ok) {
        alert("Horarios guardados exitosamente");
        fetchOwners();
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleToggleDay = (day: number) => {
    const daySlots = disponibilidades.filter(d => d.diaSemana === day);
    if (daySlots.length > 0) {
      // Si ya existen rangos, desmarcar el día elimina todos sus rangos
      setDisponibilidades(disponibilidades.filter(d => d.diaSemana !== day));
    } else {
      // Si no existen rangos, agregar uno por defecto
      setDisponibilidades([...disponibilidades, { 
        id: Math.random().toString(), 
        diaSemana: day, 
        horaInicio: '09:00', 
        horaFin: '18:00' 
      }]);
    }
  };

  const handleAddSlot = (dayNum: number) => {
    setDisponibilidades([...disponibilidades, {
      id: Math.random().toString(),
      diaSemana: dayNum,
      horaInicio: "09:00",
      horaFin: "18:00"
    }]);
  };

  const handleRemoveSlot = (id: string) => {
    setDisponibilidades(disponibilidades.filter(d => d.id !== id));
  };

  const handleUpdateSlotTime = (id: string, field: 'horaInicio' | 'horaFin', value: string) => {
    setDisponibilidades(disponibilidades.map(d => {
      if (d.id === id) {
        return { ...d, [field]: value };
      }
      return d;
    }));
  };

  const handleAddSpecialDate = () => {
    if (!newSpecialDate.fecha) return alert("Selecciona una fecha");
    setFechasEspeciales([...fechasEspeciales, {
      id: Math.random().toString(),
      fecha: newSpecialDate.fecha,
      horaInicio: newSpecialDate.horaInicio,
      horaFin: newSpecialDate.horaFin
    }]);
    setNewSpecialDate({ fecha: '', horaInicio: '09:00', horaFin: '18:00' });
  };

  const handleRemoveSpecialDate = (id: string) => {
    setFechasEspeciales(fechasEspeciales.filter(f => f.id !== id));
  };

  const handleUpdateEventStatus = async (eventId: string, estado: 'EJECUTADO' | 'PENDIENTE') => {
    try {
      const res = await fetch(`/api/bookings/${eventId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ estado }),
      });
      if (res.ok) {
        setActiveMenuEventId(null);
        fetchEvents();
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleDeleteEvent = async (eventId: string, dateStr: string) => {
    const eventDate = new Date(dateStr);
    const today = new Date();
    
    // Si la fecha es futura, se puede borrar pero validamos confirmación
    const confirmMsg = eventDate < today 
      ? "¿Estás seguro de eliminar este evento pasado de la bitácora?" 
      : "¿Estás seguro de cancelar este evento futuro?";
      
    if (!confirm(confirmMsg)) return;

    try {
      const res = await fetch(`/api/bookings/${eventId}`, {
        method: 'DELETE',
      });
      if (res.ok) {
        setActiveMenuEventId(null);
        fetchEvents();
      }
    } catch (err) {
      console.error(err);
    }
  };

  const getDayName = (dayNum: number) => {
    const days = ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'];
    return days[dayNum];
  };

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <div className={styles.headerContent}>
          {/* IDENTIDAD ORGANIZACIÓN */}
          <div className={styles.leftHeader}>
            {selectedOwner?.organizacion?.imagenUrl ? (
              <img 
                src={selectedOwner.organizacion.imagenUrl} 
                alt={selectedOwner.organizacion.nombre} 
                className={styles.orgLogo} 
              />
            ) : (
              <div className={styles.orgPlaceholder}>🏢</div>
            )}
            <div className={styles.orgText}>
              <span className={styles.orgName}>{selectedOwner?.organizacion?.nombre || 'SISTEMA DE CALENDARIOS'}</span>
              <span className={styles.orgSlogan}>{selectedOwner?.organizacion?.leyenda || 'Tu agenda digital'}</span>
            </div>
          </div>

          {/* ACTOR / ROL */}
          <div className={styles.centerHeader}>
            <span className={styles.actorRole}>DUEÑO DE CALENDARIO</span>
            
            <div className={styles.ownerSelectorArea}>
              <select 
                value={selectedOwner?.id || ''} 
                onChange={(e) => {
                  const found = owners.find(o => o.id === e.target.value);
                  if (found) setSelectedOwner(found);
                }}
                className={styles.ownerSelect}
              >
                {owners.map(o => (
                  <option key={o.id} value={o.id}>{o.nombre} {o.apellido} ({o.puesto})</option>
                ))}
              </select>
            </div>

            <nav className={styles.nav}>
              <button 
                className={activeSection === 'events' ? styles.activeNav : ''}
                onClick={() => setActiveSection('events')}
              >
                📅 Eventos
              </button>
              <button 
                className={activeSection === 'profile' ? styles.activeNav : ''}
                onClick={() => setActiveSection('profile')}
              >
                ⚙️ Ajustes
              </button>
              <button 
                className={activeSection === 'availability' ? styles.activeNav : ''}
                onClick={() => setActiveSection('availability')}
              >
                ⏰ Disponibilidad
              </button>
            </nav>
          </div>

          {/* ACTOR DETALLES Y NAVEGACIÓN */}
          <div className={styles.rightHeader}>
            <span className={styles.actorName}>
              {selectedOwner ? `${selectedOwner.nombre} ${selectedOwner.apellido}` : 'Invitado'}
            </span>
            <span className={styles.actorPage}>
              OWNER / {activeSection === 'events' ? 'EVENTOS' : activeSection === 'profile' ? 'AJUSTES' : 'DISPONIBILIDAD'}
            </span>
            <Link href="/" className={styles.exitBtn}>
              GUARDAR Y SALIR
            </Link>
          </div>
        </div>
      </header>

      <main className={styles.main}>
        {activeSection === 'events' && (
          <section className={styles.section}>
            <div className={styles.sectionHeader}>
              <h2>Lista de Citas Agendadas</h2>
            </div>

            <div className={styles.tableWrapper}>
              <table className={styles.table}>
                <thead>
                  <tr>
                    <th>Tema</th>
                    <th>Fecha / Hora</th>
                    <th>Duración</th>
                    <th>Invitado Principal</th>
                    <th>Estado</th>
                    <th>Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {events.length === 0 ? (
                    <tr>
                      <td colSpan={6} className={styles.emptyTable}>No hay eventos agendados para este calendario.</td>
                    </tr>
                  ) : (
                    events.map((event) => {
                      const creator = event.participantes.find(p => p.esCreador);
                      const totalGuests = event.participantes.length;
                      return (
                        <tr key={event.id}>
                          <td className={styles.eventName}>{event.tema}</td>
                          <td>
                            <div className={styles.dateText}>{new Date(event.fecha).toLocaleDateString()}</div>
                            <div className={styles.timeText}>🕒 {event.horaInicio}</div>
                          </td>
                          <td>{event.duracion} min</td>
                          <td>
                            {creator ? (
                              <div>
                                <div className={styles.guestName}>{creator.nombre} {creator.apellido}</div>
                                {totalGuests > 1 && <span className={styles.multipleBadge}>+{totalGuests - 1} adicionales</span>}
                              </div>
                            ) : (
                              'Desconocido'
                            )}
                          </td>
                          <td>
                            <span className={`${styles.badge} ${event.estado === 'EJECUTADO' ? styles.badgeGreen : styles.badgeYellow}`}>
                              {event.estado}
                            </span>
                          </td>
                          <td className={styles.actionCell}>
                            <button 
                              className={styles.menuTrigger}
                              onClick={() => setActiveMenuEventId(activeMenuEventId === event.id ? null : event.id)}
                            >
                              •••
                            </button>
                            {activeMenuEventId === event.id && (
                              <div className={styles.contextMenu}>
                                <button onClick={() => setShowDetailsModal(event)}>🔍 Detalles</button>
                                {event.estado === 'PENDIENTE' && (
                                  <button onClick={() => handleUpdateEventStatus(event.id, 'EJECUTADO')}>✅ Completado</button>
                                )}
                                {event.estado === 'EJECUTADO' && (
                                  <button onClick={() => handleUpdateEventStatus(event.id, 'PENDIENTE')}>⏳ Pendiente</button>
                                )}
                                <button 
                                  className={styles.deleteOption}
                                  onClick={() => handleDeleteEvent(event.id, event.fecha)}
                                >
                                  ❌ Cancelar / Borrar
                                </button>
                              </div>
                            )}
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>
          </section>
        )}

        {activeSection === 'profile' && (
          <section className={styles.section}>
            <div className={styles.sectionHeader}>
              <h2>Ajustes de Perfil y Mensajes</h2>
            </div>

            <form onSubmit={handleSaveProfile} className={styles.formCard}>
              <div className={styles.formGroup}>
                <label>Nombre del Calendario Público</label>
                <input 
                  type="text" required
                  value={profileForm.nombre}
                  onChange={(e) => setProfileForm({ ...profileForm, nombre: e.target.value })}
                />
              </div>

              <div className={styles.formGroup}>
                <label>Foto de Perfil URL</label>
                <input 
                  type="url"
                  placeholder="https://images.unsplash.com/photo-..."
                  value={profileForm.imagenPresentacion}
                  onChange={(e) => setProfileForm({ ...profileForm, imagenPresentacion: e.target.value })}
                />
              </div>

              <div className={styles.formGroup}>
                <label>Mensaje de Salida / Agradecimiento</label>
                <textarea 
                  rows={3}
                  placeholder="Mensaje que se mostrará al tercero tras agendar con éxito..."
                  value={profileForm.mensajeCierre}
                  onChange={(e) => setProfileForm({ ...profileForm, mensajeCierre: e.target.value })}
                />
              </div>

              <div className={styles.checkboxGroup}>
                <input 
                  type="checkbox" 
                  id="permitirInvitados"
                  checked={profileForm.permitirInvitados}
                  onChange={(e) => setProfileForm({ ...profileForm, permitirInvitados: e.target.checked })}
                />
                <label htmlFor="permitirInvitados">Permitir que el solicitante añada otros invitados (Videoconferencia y Reunión)</label>
              </div>

              <hr className={styles.divider} />
              <h3>Límites y Antelación</h3>

              <div className={styles.formRow}>
                <div className={styles.formGroup}>
                  <label>Antelación máxima para agendar (días futuros)</label>
                  <input 
                    type="number" min={0} required
                    value={profileForm.limitesAgendar}
                    onChange={(e) => setProfileForm({ ...profileForm, limitesAgendar: parseInt(e.target.value) })}
                  />
                </div>
                <div className={styles.formGroup}>
                  <label>Antelación mínima para cancelar (horas antes)</label>
                  <input 
                    type="number" min={0} required
                    value={profileForm.limitesCancelar}
                    onChange={(e) => setProfileForm({ ...profileForm, limitesCancelar: parseInt(e.target.value) })}
                  />
                </div>
                <div className={styles.formGroup}>
                  <label>Antelación mínima para reagendar (horas antes)</label>
                  <input 
                    type="number" min={0} required
                    value={profileForm.limitesReagendar}
                    onChange={(e) => setProfileForm({ ...profileForm, limitesReagendar: parseInt(e.target.value) })}
                  />
                </div>
              </div>

              <hr className={styles.divider} />
              <h3>Eventos Permitidos y Tiempos</h3>
              <p className={styles.desc}>Selecciona qué tipos de citas están activas, su duración estándar y su margen de seguridad.</p>

              <div className={styles.eventTypesGrid}>
                {['CITA_REUNION', 'VIDEOCONFERENCIA', 'RECIBIR_LLAMADA', 'REALIZAR_LLAMADA'].map(name => {
                  const currentType = tiposEventos.find(t => t.nombre === name);
                  const isEnabled = !!currentType;

                  return (
                    <div key={name} className={`${styles.eventTypeRow} ${isEnabled ? styles.eventTypeRowActive : ''}`}>
                      <div className={styles.eventTypeHeader}>
                        <input 
                          type="checkbox"
                          id={`evt-${name}`}
                          checked={isEnabled}
                          onChange={(e) => {
                            if (e.target.checked) {
                              setTiposEventos([...tiposEventos, {
                                id: Math.random().toString(),
                                nombre: name,
                                duracion: name.includes('LLAMADA') ? 15 : 30,
                                margenSeguridad: 15
                              }]);
                            } else {
                              setTiposEventos(tiposEventos.filter(t => t.nombre !== name));
                            }
                          }}
                        />
                        <label htmlFor={`evt-${name}`}><strong>{name.replace('_', ' ')}</strong></label>
                      </div>

                      {isEnabled && currentType && (
                        <div className={styles.eventTypeInputs}>
                          <div className={styles.formGroup}>
                            <label>Duración (min)</label>
                            <input 
                              type="number" min={5} step={5}
                              value={currentType.duracion}
                              onChange={(e) => {
                                setTiposEventos(tiposEventos.map(t => 
                                  t.nombre === name ? { ...t, duracion: parseInt(e.target.value) } : t
                                ));
                              }}
                            />
                          </div>
                          <div className={styles.formGroup}>
                            <label>Margen (min)</label>
                            <input 
                              type="number" min={0} step={5}
                              value={currentType.margenSeguridad}
                              onChange={(e) => {
                                setTiposEventos(tiposEventos.map(t => 
                                  t.nombre === name ? { ...t, margenSeguridad: parseInt(e.target.value) } : t
                                ));
                              }}
                            />
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>

              <button type="submit" className={styles.primaryBtn} style={{ marginTop: '1.5rem' }}>Guardar Ajustes</button>
            </form>
          </section>
        )}

        {activeSection === 'availability' && (
          <section className={styles.section}>
            <div className={styles.sectionHeader}>
              <h2>Disponibilidad Semanal y Fechas Especiales</h2>
            </div>

            <form onSubmit={handleSaveProfile} className={styles.formCard}>
              <h3>Días y Horarios de Atención Semanal</h3>
              <p className={styles.desc}>Selecciona los días hábiles y define tu horario estándar de atención.</p>
              
              <div className={styles.weeklyContainer}>
                {[1, 2, 3, 4, 5, 6, 0].map(dayNum => {
                  const daySlots = disponibilidades.filter(d => d.diaSemana === dayNum);
                  const isDayActive = daySlots.length > 0;

                  return (
                    <div key={dayNum} className={`${styles.dayRow} ${isDayActive ? styles.dayRowActive : ''}`}>
                      <div className={styles.daySelectorArea}>
                        <input 
                          type="checkbox" 
                          id={`day-${dayNum}`}
                          checked={isDayActive}
                          onChange={() => handleToggleDay(dayNum)}
                        />
                        <label htmlFor={`day-${dayNum}`}><strong>{getDayName(dayNum)}</strong></label>
                      </div>

                      {isDayActive && (
                        <div className={styles.daySlotsList}>
                          {daySlots.map((slot, index) => (
                            <div key={slot.id} className={styles.hoursInputs}>
                              <span>Rango {index + 1}:</span>
                              <input 
                                type="time" 
                                value={slot.horaInicio}
                                onChange={(e) => handleUpdateSlotTime(slot.id, 'horaInicio', e.target.value)}
                              />
                              <span>Hasta:</span>
                              <input 
                                type="time" 
                                value={slot.horaFin}
                                onChange={(e) => handleUpdateSlotTime(slot.id, 'horaFin', e.target.value)}
                              />
                              <button 
                                type="button" 
                                className={styles.removeRangeBtn}
                                onClick={() => handleRemoveSlot(slot.id)}
                              >
                                🗑️
                              </button>
                            </div>
                          ))}
                          <button 
                            type="button" 
                            className={styles.addRangeBtn} 
                            onClick={() => handleAddSlot(dayNum)}
                          >
                            + Agregar Rango
                          </button>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>

              <hr className={styles.divider} />
              
              <h3>Fechas Especiales (Horarios Específicos)</h3>
              <p className={styles.desc}>Define horarios particulares para días feriados o eventos fuera de la rutina.</p>

              <div className={styles.specialDatesSection}>
                <div className={styles.specialDateForm}>
                  <input 
                    type="date"
                    value={newSpecialDate.fecha}
                    onChange={(e) => setNewSpecialDate({ ...newSpecialDate, fecha: e.target.value })}
                  />
                  <input 
                    type="time"
                    value={newSpecialDate.horaInicio}
                    onChange={(e) => setNewSpecialDate({ ...newSpecialDate, horaInicio: e.target.value })}
                  />
                  <span>a</span>
                  <input 
                    type="time"
                    value={newSpecialDate.horaFin}
                    onChange={(e) => setNewSpecialDate({ ...newSpecialDate, horaFin: e.target.value })}
                  />
                  <button type="button" className={styles.addBtn} onClick={handleAddSpecialDate}>
                    Añadir
                  </button>
                </div>

                <div className={styles.specialDatesList}>
                  {fechasEspeciales.map(f => (
                    <div key={f.id} className={styles.specialDateItem}>
                      <span>📅 {new Date(f.fecha).toLocaleDateString()} &mdash; 🕒 {f.horaInicio} a {f.horaFin}</span>
                      <button type="button" onClick={() => handleRemoveSpecialDate(f.id)}>Remover</button>
                    </div>
                  ))}
                </div>
              </div>

              <button type="submit" className={styles.primaryBtn} style={{ marginTop: '2rem' }}>
                Guardar Disponibilidad
              </button>
            </form>
          </section>
        )}
      </main>

      {/* Details Modal */}
      {showDetailsModal && (
        <div className={styles.modalOverlay} onClick={() => setShowDetailsModal(null)}>
          <div className={styles.modal} onClick={e => e.stopPropagation()}>
            <h2>Detalle de la Cita</h2>
            <div className={styles.detailGrid}>
              <div className={styles.detailItem}>
                <strong>Tema a Tratar:</strong>
                <p>{showDetailsModal.tema}</p>
              </div>
              <div className={styles.detailItem}>
                <strong>Fecha y Hora:</strong>
                <p>{new Date(showDetailsModal.fecha).toLocaleDateString()} a las {showDetailsModal.horaInicio} ({showDetailsModal.duracion} minutos)</p>
              </div>
              <div className={styles.detailItem}>
                <strong>Participantes:</strong>
                <ul className={styles.participantsList}>
                  {showDetailsModal.participantes.map(p => (
                    <li key={p.id}>
                      👤 {p.nombre} {p.apellido} ({p.correo}) {p.telefono ? `- Tel: ${p.telefono}` : ''}
                      {p.esCreador && <span className={styles.creadorTag}>Organizador</span>}
                    </li>
                  ))}
                </ul>
              </div>
              {showDetailsModal.archivoAdjuntoUrl && (
                <div className={styles.detailItem}>
                  <strong>Archivo Adjunto:</strong>
                  <p>
                    <a href={showDetailsModal.archivoAdjuntoUrl} target="_blank" rel="noopener noreferrer" className={styles.downloadLink}>
                      📥 Descargar Adjunto
                    </a>
                  </p>
                </div>
              )}
            </div>
            <div className={styles.modalActions}>
              <button className={styles.cancelBtn} onClick={() => setShowDetailsModal(null)}>Cerrar</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
