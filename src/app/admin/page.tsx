'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import styles from './page.module.css';

interface TipoEvento {
  id: string;
  nombre: string;
  duracion: number;
  margenSeguridad: number;
}

interface Calendario {
  id: string;
  nombre: string;
  permitirInvitados: boolean;
  mensajeCierre?: string;
  limitesAgendar: number;
  tiposEventos: TipoEvento[];
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
  organizacion?: { nombre: string; pais: string; region: string };
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

interface Comunicacion {
  id: string;
  codigo: string;
  nombre: string;
  pais?: string;
  tipoComunicacion: string;
  tipoActivador: string;
  idActivador?: string;
  accionActivador?: string;
  horasRelativas?: number;
  incluirFinSemana: boolean;
  origen: string;
  segmento: string;
  destinatarios: string;
  asuntoHeader: string;
  mensajeCopy: string;
  variables?: string;
  enlacesAcciones?: string;
  adjuntos?: string;
  status: string;
  createdAt?: string;
}

export default function AdminDashboard() {
  // Navigation mode: 'menu' | 'pantalla1' ... | 'comunicaciones_lista' | 'comunicaciones_alta_cambios' | 'comunicaciones_baja'
  const [activeView, setActiveView] = useState<
    | 'menu'
    | 'pantalla1'
    | 'pantalla2_4'
    | 'pantalla3'
    | 'pantalla5'
    | 'pantalla6'
    | 'pantalla7'
    | 'pantalla8'
    | 'pantalla9'
    | 'comunicaciones_lista'
    | 'comunicaciones_alta_cambios'
    | 'comunicaciones_baja'
  >('menu');

  // Menu Selection in Pantalla 0
  const [menuSelection, setMenuSelection] = useState<{ category: string; action: string }>({
    category: 'organizaciones',
    action: 'alta_cambios',
  });


  const [orgs, setOrgs] = useState<Organizacion[]>([]);
  const [owners, setOwners] = useState<Dueno[]>([]);
  const [comunicaciones, setComunicaciones] = useState<Comunicacion[]>([]);
  const [selectedComDetail, setSelectedComDetail] = useState<Comunicacion | null>(null);
  const [loading, setLoading] = useState(false);

  // Fetch Data
  const fetchData = async () => {
    setLoading(true);
    try {
      const orgsRes = await fetch('/api/organizations');
      const orgsData = await orgsRes.json();
      setOrgs(Array.isArray(orgsData) ? orgsData : []);

      const ownersRes = await fetch('/api/owners');
      const ownersData = await ownersRes.json();
      setOwners(Array.isArray(ownersData) ? ownersData : []);

      const comRes = await fetch('/api/comunicaciones');
      const comData = await comRes.json();
      setComunicaciones(Array.isArray(comData) ? comData : []);
    } catch (e) {
      console.error("Error cargando datos:", e);
    } finally {
      setLoading(false);
    }
  };


  useEffect(() => {
    fetchData();
  }, []);

  // --- FORM STATES ---

  // Pantalla 1: Alta y Cambios Organización
  const [p1Search, setP1Search] = useState({ pais: 'México', region: '', nombre: '' });
  const [p1FoundOrg, setP1FoundOrg] = useState<Organizacion | null>(null);
  const [p1Data, setP1Data] = useState({ nombre: '', leyenda: '', imagenUrl: '' });
  const [p1Contact, setP1Contact] = useState({ nombre: '', apellido: '', puesto: '', telefono: '', correo: '' });

  // Pantalla 2 & 4: Alta Dueño / Asistente
  const [p2OrgId, setP2OrgId] = useState('');
  const [p2Data, setP2Data] = useState({
    nombre: '',
    apellido: '',
    puesto: '',
    correo: '',
    tipo: 'DUEÑO_DE_CALENDARIO',
  });

  // Pantalla 3: Alta de Calendario (Eventos adicionales a domicilio)
  const [p3OwnerId, setP3OwnerId] = useState('');
  const [p3Domicilio1, setP3Domicilio1] = useState(false);
  const [p3Domicilio2, setP3Domicilio2] = useState(false);
  const [p3Domicilio3, setP3Domicilio3] = useState(false);

  // Pantalla 5: Cambio de Estado de Dueño
  const [p5OwnerId, setP5OwnerId] = useState('');
  const [p5State, setP5State] = useState({
    estado: 'ACTIVO',
    causaAusencia: '',
    fechaInicioAusencia: '',
    fechaFinAusencia: '',
  });

  // Pantalla 6: Cambio de Dueño (Reasignar a Asistente de Transición)
  const [p6OwnerId, setP6OwnerId] = useState('');
  const [p6AssistantId, setP6AssistantId] = useState('');

  // Pantalla 7: Baja de Calendario
  const [p7CalendarId, setP7CalendarId] = useState('');

  // Pantalla 8: Baja de Dueño
  const [p8OwnerId, setP8OwnerId] = useState('');

  // Pantalla 9: Baja de Organización
  const [p9OrgId, setP9OrgId] = useState('');

  // --- COMUNICACIONES STATES ---
  const [comSearch, setComSearch] = useState({ pais: 'México', tipo: 'CORREO', nombre: '' });
  const [comForm, setComForm] = useState<{
    id?: string;
    codigo: string;
    nombre: string;
    pais: string;
    tipoComunicacion: string;
    tipoActivador: 'EVENTO' | 'REGLA';
    idActivador: string;
    accionActivador: string;
    horasRelativas: number;
    incluirFinSemana: boolean;
    origen: string;
    segmento: string;
    destinatarios: {
      solicitante: boolean;
      duenoCalendario: boolean;
      duenoSustituto: boolean;
      asistenteTransicion: boolean;
      invitadosSolicitante: boolean;
      invitadosDueno: boolean;
    };
    asuntoHeader: string;
    mensajeCopy: string;
  }>({
    codigo: '',
    nombre: 'CONFIRMACION EVENTO - SOLICITANTE',
    pais: 'México',
    tipoComunicacion: 'CORREO',
    tipoActivador: 'EVENTO',
    idActivador: 'CALMX-001',
    accionActivador: 'SOLICITUD EVENTO USUARIO',
    horasRelativas: 24,
    incluirFinSemana: true,
    origen: 'ORGANIZACION',
    segmento: 'TODOS',
    destinatarios: {
      solicitante: true,
      duenoCalendario: true,
      duenoSustituto: false,
      asistenteTransicion: false,
      invitadosSolicitante: true,
      invitadosDueno: true,
    },
    asuntoHeader: '{nombre solicitante} tu evento esta confirmado',
    mensajeCopy: 'Te Confirmamos la reservación para tú {tipo de evento} con {dueño calendario} Para el día {dia evento} de {mes evento} a las {hora evento} para el asunto {tema evento}\nSi el evento es adecuado solo cierra este correo y se te enviara recordatorio previamente\nsi existe algún inconveniente puedes realizar las siguientes acciones:\n\n👉 REAGENDAR\n👉 CANCELAR\n\nagradeceremos tu puntual asistencia\n{organizacion}\n{frase / slogan}',
  });

  const [comVariables, setComVariables] = useState<
    Array<{ variable: string; descripcion: string; obligatoria: boolean; regla: string; valorAlternativo: string }>
  >([
    { variable: '{nombre solicitante}', descripcion: 'Nombre del solicitante', obligatoria: true, regla: '', valorAlternativo: '' },
    { variable: '{hora evento}', descripcion: 'Hora del evento solicitado', obligatoria: true, regla: 'Formato 24 horas', valorAlternativo: '' },
    { variable: '{tema}', descripcion: 'Tema o asunto descrito por el solicitante', obligatoria: false, regla: 'Si no lo registro usar valor alternativo', valorAlternativo: 'NO ESPECIFICADO' },
  ]);

  const [selectedVarToAdd, setSelectedVarToAdd] = useState('{nombre solicitante}');
  const [comVerification, setComVerification] = useState<{ verified: boolean; previewHeader: string; previewCopy: string } | null>(null);
  const [comBajaId, setComBajaId] = useState('');

  // --- ACTIONS & SUBMITS ---

  const handleAccesar = () => {
    const { category, action } = menuSelection;
    if (category === 'organizaciones') {
      if (action === 'alta_cambios') setActiveView('pantalla1');
      if (action === 'baja') setActiveView('pantalla9');
    } else if (category === 'duenos') {
      if (action === 'alta') {
        setP2Data({ ...p2Data, tipo: 'DUEÑO_DE_CALENDARIO' });
        setActiveView('pantalla2_4');
      }
      if (action === 'baja') setActiveView('pantalla8');
      if (action === 'cambio_estado') setActiveView('pantalla5');
    } else if (category === 'calendarios') {
      if (action === 'alta') setActiveView('pantalla3');
      if (action === 'baja') setActiveView('pantalla7');
      if (action === 'cambio_dueno') setActiveView('pantalla6');
    } else if (category === 'comunicaciones') {
      if (action === 'lista') setActiveView('comunicaciones_lista');
      if (action === 'alta_cambios') setActiveView('comunicaciones_alta_cambios');
      if (action === 'baja') setActiveView('comunicaciones_baja');
    }
  };


  // Pantalla 1: Buscar Organización
  const handleP1Search = () => {
    const found = orgs.find(
      (o) =>
        o.nombre.toLowerCase().includes(p1Search.nombre.toLowerCase()) &&
        o.pais.toLowerCase() === p1Search.pais.toLowerCase()
    );

    if (found) {
      setP1FoundOrg(found);
      setP1Data({
        nombre: found.nombre,
        leyenda: found.leyenda || '',
        imagenUrl: found.imagenUrl || '',
      });
      const mainOwner = found.duenos[0];
      if (mainOwner) {
        setP1Contact({
          nombre: mainOwner.nombre,
          apellido: mainOwner.apellido,
          puesto: mainOwner.puesto,
          telefono: '',
          correo: mainOwner.correo,
        });
      } else {
        setP1Contact({ nombre: '', apellido: '', puesto: '', telefono: '', correo: '' });
      }
    } else {
      setP1FoundOrg(null);
      setP1Data({ nombre: p1Search.nombre, leyenda: '', imagenUrl: '' });
      setP1Contact({ nombre: '', apellido: '', puesto: '', telefono: '', correo: '' });
      alert('Organización no encontrada. Rellene los campos para registrar una nueva.');
    }
  };

  // Pantalla 1: Registrar o Actualizar Organización
  const handleP1Submit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const url = p1FoundOrg ? `/api/organizations/${p1FoundOrg.id}` : '/api/organizations';
      const method = p1FoundOrg ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          nombre: p1Data.nombre,
          pais: p1Search.pais,
          region: p1Search.region,
          leyenda: p1Data.leyenda,
          imagenUrl: p1Data.imagenUrl,
        }),
      });

      if (res.ok) {
        const orgResult = await res.json();
        // Si hay contacto, lo registramos como dueño principal si no existía
        if (p1Contact.correo && p1Contact.nombre && !p1FoundOrg) {
          await fetch('/api/owners', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              nombre: p1Contact.nombre,
              apellido: p1Contact.apellido,
              puesto: p1Contact.puesto,
              correo: p1Contact.correo,
              tipo: 'DUEÑO_DE_CALENDARIO',
              organizacionId: orgResult.id,
            }),
          });
        }
        alert('Organización registrada/actualizada con éxito.');
        setActiveView('menu');
        fetchData();
      }
    } catch (err) {
      console.error(err);
    }
  };

  // Pantalla 2 & 4: Alta Dueño / Asistente
  const handleP2Submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!p2OrgId) return alert('Selecciona una organización');
    try {
      const res = await fetch('/api/owners', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          nombre: p2Data.nombre,
          apellido: p2Data.apellido,
          puesto: p2Data.puesto,
          correo: p2Data.correo,
          tipo: p2Data.tipo,
          organizacionId: p2OrgId,
        }),
      });
      if (res.ok) {
        alert('Dueño/Asistente registrado con éxito.');
        setActiveView('menu');
        fetchData();
      }
    } catch (err) {
      console.error(err);
    }
  };

  // Pantalla 3: Alta de Calendario
  const handleP3Submit = async (e: React.FormEvent) => {
    e.preventDefault();
    const owner = owners.find((o) => o.id === p3OwnerId);
    if (!owner || !owner.calendario) return alert('Selecciona un dueño con calendario existente');

    const calendar = owner.calendario;

    // Build the updated list of types
    const currentTypes = calendar.tiposEventos.filter(
      (t) => !['A_DOMICILIO_1', 'A_DOMICILIO_2', 'A_DOMICILIO_3'].includes(t.nombre)
    );

    if (p3Domicilio1) currentTypes.push({ id: '', nombre: 'A_DOMICILIO_1', duracion: 60, margenSeguridad: 15 });
    if (p3Domicilio2) currentTypes.push({ id: '', nombre: 'A_DOMICILIO_2', duracion: 90, margenSeguridad: 15 });
    if (p3Domicilio3) currentTypes.push({ id: '', nombre: 'A_DOMICILIO_3', duracion: 120, margenSeguridad: 15 });

    try {
      const res = await fetch(`/api/calendars/${calendar.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          nombre: calendar.nombre,
          permitirInvitados: calendar.permitirInvitados,
          mensajeCierre: calendar.mensajeCierre || '',
          limitesAgendar: calendar.limitesAgendar,
          tiposEventos: currentTypes,
        }),
      });

      if (res.ok) {
        alert('Calendario actualizado con éxito.');
        setActiveView('menu');
        fetchData();
      }
    } catch (err) {
      console.error(err);
    }
  };

  // Pantalla 5: Cambio de Estado de Dueño
  const handleP5Submit = async (e: React.FormEvent) => {
    e.preventDefault();
    const owner = owners.find((o) => o.id === p5OwnerId);
    if (!owner) return alert('Selecciona un dueño');

    // Validación AC-05 para AUSENTE_TEMPORAL
    if (p5State.estado === 'AUSENTE_TEMPORAL') {
      if (!p5State.fechaInicioAusencia || !p5State.fechaFinAusencia) {
        return alert('Debe indicar la fecha de inicio y fecha de término de la ausencia.');
      }
      const fInicio = new Date(p5State.fechaInicioAusencia);
      const fFin = new Date(p5State.fechaFinAusencia);
      if (fInicio >= fFin) {
        return alert('Error de Validación (AC-05): La Fecha de Inicio debe ser anterior a la Fecha de Término.');
      }
      if (!p5State.causaAusencia) {
        return alert('Debe indicar la causa de la ausencia temporal.');
      }
    }

    // Validación AC-05 para ACTIVO: requiere que el estado actual haya sido AUSENTE_TEMPORAL
    if (p5State.estado === 'ACTIVO' && owner.estado !== 'AUSENTE_TEMPORAL' && owner.estado !== 'ACTIVO') {
      return alert('Error (AC-05): Para activar un dueño, su estado actual debe ser AUSENTE TEMPORALMENTE.');
    }

    try {
      const res = await fetch(`/api/owners/${owner.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...owner,
          estado: p5State.estado,
          causaAusencia: p5State.estado === 'AUSENTE_TEMPORAL' ? p5State.causaAusencia : null,
          fechaInicioAusencia: p5State.estado === 'AUSENTE_TEMPORAL' ? p5State.fechaInicioAusencia : null,
          fechaFinAusencia: p5State.estado === 'AUSENTE_TEMPORAL' ? p5State.fechaFinAusencia : null,
        }),
      });
      if (res.ok) {
        alert('Estado del dueño actualizado con éxito.');
        setActiveView('menu');
        fetchData();
      }
    } catch (err) {
      console.error(err);
    }
  };


  // Pantalla 6: Traspaso de Calendario
  const handleP6Submit = async (e: React.FormEvent) => {
    e.preventDefault();
    const owner = owners.find((o) => o.id === p6OwnerId);
    if (!owner?.calendario?.id || !p6AssistantId) return alert('Selecciona dueño y asistente válido');

    try {
      const res = await fetch(`/api/calendars/${owner.calendario.id}/reassign`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ newOwnerId: p6AssistantId }),
      });
      if (res.ok) {
        alert('Calendario traspasado con éxito.');
        setActiveView('menu');
        fetchData();
      }
    } catch (err) {
      console.error(err);
    }
  };

  // Pantalla 7: Baja de Calendario
  const handleP7Submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!p7CalendarId) return alert('Selecciona un calendario');

    const confirmed = window.confirm(
      '¿Estás seguro de que deseas eliminar este calendario? Esta acción eliminará en cascada todos los eventos registrados y sus archivos adjuntos.'
    );
    if (!confirmed) return;

    try {
      const res = await fetch(`/api/calendars/${p7CalendarId}`, { method: 'DELETE' });
      if (res.ok) {
        alert('Calendario eliminado con éxito.');
        setActiveView('menu');
        fetchData();
      }
    } catch (err) {
      console.error(err);
    }
  };

  // Pantalla 8: Baja de Dueño
  const handleP8Submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!p8OwnerId) return alert('Selecciona un dueño');

    const confirmed = window.confirm(
      '¿Estás seguro de que deseas eliminar este dueño? Esta acción eliminará permanentemente su calendario, eventos y archivos adjuntos.'
    );
    if (!confirmed) return;

    try {
      const res = await fetch(`/api/owners/${p8OwnerId}`, { method: 'DELETE' });
      if (res.ok) {
        alert('Dueño eliminado con éxito.');
        setActiveView('menu');
        fetchData();
      }
    } catch (err) {
      console.error(err);
    }
  };

  // Pantalla 9: Baja de Organización
  const handleP9Submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!p9OrgId) return alert('Selecciona una organización');

    const confirmed = window.confirm(
      '¿Estás seguro de que deseas eliminar esta organización? Esto eliminará permanentemente todos sus dueños, asistentes, calendarios, eventos y archivos adjuntos asociados.'
    );
    if (!confirmed) return;

    try {
      const res = await fetch(`/api/organizations/${p9OrgId}`, { method: 'DELETE' });
      if (res.ok) {
        alert('Organización eliminada con éxito.');
        setActiveView('menu');
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
          </div>

          {/* ACTOR DETALLES Y NAVEGACIÓN */}
          <div className={styles.rightHeader}>
            <span className={styles.actorName}>Administrador Global</span>
            <span className={styles.actorPage}>
              {activeView === 'menu' ? 'MENÚ PRINCIPAL' : `PANTALLA ${activeView.replace('pantalla', '')}`}
            </span>
            {activeView !== 'menu' && (
              <button className={styles.backLink} onClick={() => setActiveView('menu')}>
                ← Volver al Menú
              </button>
            )}
            <Link href="/" className={styles.exitBtn}>
              SALIR
            </Link>
          </div>
        </div>
      </header>

      <main className={styles.main}>
        {/* --- PANTALLA 0: MENÚ PRINCIPAL --- */}
        {activeView === 'menu' && (
          <div className={styles.menuCard}>
            <h2 className={styles.title}>ADMINISTRACIÓN DE CALENDARIOS</h2>
            <div className={styles.menuGrid}>
              {/* Bloque Organizaciones */}
              <div
                className={`${styles.menuBlock} ${
                  menuSelection.category === 'organizaciones' ? styles.selectedBlock : ''
                }`}
                onClick={() => setMenuSelection({ category: 'organizaciones', action: 'alta_cambios' })}
              >
                <h3>ORGANIZACIONES</h3>
                <label className={styles.radioOption}>
                  <input
                    type="radio"
                    name="org"
                    checked={
                      menuSelection.category === 'organizaciones' && menuSelection.action === 'alta_cambios'
                    }
                    onChange={() => setMenuSelection({ category: 'organizaciones', action: 'alta_cambios' })}
                  />
                  <span>Alta y Cambios</span>
                </label>
                <label className={styles.radioOption}>
                  <input
                    type="radio"
                    name="org"
                    checked={menuSelection.category === 'organizaciones' && menuSelection.action === 'baja'}
                    onChange={() => setMenuSelection({ category: 'organizaciones', action: 'baja' })}
                  />
                  <span>Baja</span>
                </label>
              </div>

              {/* Bloque Dueños */}
              <div
                className={`${styles.menuBlock} ${menuSelection.category === 'duenos' ? styles.selectedBlock : ''}`}
                onClick={() => setMenuSelection({ category: 'duenos', action: 'alta' })}
              >
                <h3>DUEÑOS</h3>
                <label className={styles.radioOption}>
                  <input
                    type="radio"
                    name="owner"
                    checked={menuSelection.category === 'duenos' && menuSelection.action === 'alta'}
                    onChange={() => setMenuSelection({ category: 'duenos', action: 'alta' })}
                  />
                  <span>Alta</span>
                </label>
                <label className={styles.radioOption}>
                  <input
                    type="radio"
                    name="owner"
                    checked={menuSelection.category === 'duenos' && menuSelection.action === 'baja'}
                    onChange={() => setMenuSelection({ category: 'duenos', action: 'baja' })}
                  />
                  <span>Baja</span>
                </label>
                <label className={styles.radioOption}>
                  <input
                    type="radio"
                    name="owner"
                    checked={menuSelection.category === 'duenos' && menuSelection.action === 'cambio_estado'}
                    onChange={() => setMenuSelection({ category: 'duenos', action: 'cambio_estado' })}
                  />
                  <span>Cambio Estado</span>
                </label>
              </div>

              {/* Bloque Calendarios */}
              <div
                className={`${styles.menuBlock} ${
                  menuSelection.category === 'calendarios' ? styles.selectedBlock : ''
                }`}
                onClick={() => setMenuSelection({ category: 'calendarios', action: 'alta' })}
              >
                <h3>CALENDARIOS</h3>
                <label className={styles.radioOption}>
                  <input
                    type="radio"
                    name="calendar"
                    checked={menuSelection.category === 'calendarios' && menuSelection.action === 'alta'}
                    onChange={() => setMenuSelection({ category: 'calendarios', action: 'alta' })}
                  />
                  <span>Alta</span>
                </label>
                <label className={styles.radioOption}>
                  <input
                    type="radio"
                    name="calendar"
                    checked={menuSelection.category === 'calendarios' && menuSelection.action === 'baja'}
                    onChange={() => setMenuSelection({ category: 'calendarios', action: 'baja' })}
                  />
                  <span>Baja</span>
                </label>
                <label className={styles.radioOption}>
                  <input
                    type="radio"
                    name="calendar"
                    checked={menuSelection.category === 'calendarios' && menuSelection.action === 'cambio_dueno'}
                    onChange={() => setMenuSelection({ category: 'calendarios', action: 'cambio_dueno' })}
                  />
                  <span>Cambio de Dueño</span>
                </label>
              </div>

              {/* Bloque Comunicaciones */}
              <div
                className={`${styles.menuBlock} ${
                  menuSelection.category === 'comunicaciones' ? styles.selectedBlock : ''
                }`}
                onClick={() => setMenuSelection({ category: 'comunicaciones', action: 'lista' })}
              >
                <h3>COMUNICACIONES</h3>
                <label className={styles.radioOption}>
                  <input
                    type="radio"
                    name="comunicacion"
                    checked={menuSelection.category === 'comunicaciones' && menuSelection.action === 'lista'}
                    onChange={() => setMenuSelection({ category: 'comunicaciones', action: 'lista' })}
                  />
                  <span>Lista Comunicaciones</span>
                </label>
                <label className={styles.radioOption}>
                  <input
                    type="radio"
                    name="comunicacion"
                    checked={menuSelection.category === 'comunicaciones' && menuSelection.action === 'alta_cambios'}
                    onChange={() => setMenuSelection({ category: 'comunicaciones', action: 'alta_cambios' })}
                  />
                  <span>Alta y Cambios</span>
                </label>
                <label className={styles.radioOption}>
                  <input
                    type="radio"
                    name="comunicacion"
                    checked={menuSelection.category === 'comunicaciones' && menuSelection.action === 'baja'}
                    onChange={() => setMenuSelection({ category: 'comunicaciones', action: 'baja' })}
                  />
                  <span>Baja</span>
                </label>
              </div>
            </div>

            <button className={styles.accesarBtn} onClick={handleAccesar}>
              ACCESAR
            </button>
          </div>
        )}


        {/* --- PANTALLA 1: ALTA Y CAMBIOS ORGANIZACIÓN --- */}
        {activeView === 'pantalla1' && (
          <div className={styles.card}>
            <h2>ORGANIZACIÓN - DATOS</h2>
            <div className={styles.searchRow}>
              <div className={styles.formGroup}>
                <label>PAÍS</label>
                <select
                  value={p1Search.pais}
                  onChange={(e) => setP1Search({ ...p1Search, pais: e.target.value })}
                >
                  <option value="México">México</option>
                  <option value="Colombia">Colombia</option>
                  <option value="Chile">Chile</option>
                </select>
              </div>
              <div className={styles.formGroup}>
                <label>ESTADO / REGION</label>
                <input
                  type="text"
                  value={p1Search.region}
                  onChange={(e) => setP1Search({ ...p1Search, region: e.target.value })}
                />
              </div>
              <div className={styles.formGroup}>
                <label>NOMBRE ORGANIZACION</label>
                <input
                  type="text"
                  value={p1Search.nombre}
                  onChange={(e) => setP1Search({ ...p1Search, nombre: e.target.value })}
                />
              </div>
              <button type="button" className={styles.searchBtn} onClick={handleP1Search}>
                BUSCAR
              </button>
            </div>

            <form onSubmit={handleP1Submit} style={{ marginTop: '2rem' }}>
              <div className={styles.formSection}>
                <h3>IMAGEN Y DETALLES</h3>
                <div className={styles.formGroup}>
                  <label>NOMBRE DE ORGANIZACIÓN (CARGAR)</label>
                  <input
                    type="text"
                    required
                    value={p1Data.nombre}
                    onChange={(e) => setP1Data({ ...p1Data, nombre: e.target.value })}
                  />
                </div>
                <div className={styles.formGroup}>
                  <label>LOGO URL</label>
                  <input
                    type="text"
                    value={p1Data.imagenUrl}
                    onChange={(e) => setP1Data({ ...p1Data, imagenUrl: e.target.value })}
                  />
                </div>
                <div className={styles.formGroup}>
                  <label>LEYENDA / SLOGAN</label>
                  <textarea
                    rows={2}
                    value={p1Data.leyenda}
                    onChange={(e) => setP1Data({ ...p1Data, leyenda: e.target.value })}
                  />
                </div>
              </div>

              <div className={styles.formSection} style={{ marginTop: '1.5rem' }}>
                <h3>DATOS DE CONTACTO (NUEVO/ACTUAL)</h3>
                <div className={styles.formRow}>
                  <div className={styles.formGroup}>
                    <label>NOMBRE</label>
                    <input
                      type="text"
                      value={p1Contact.nombre}
                      onChange={(e) => setP1Contact({ ...p1Contact, nombre: e.target.value })}
                    />
                  </div>
                  <div className={styles.formGroup}>
                    <label>APELLIDO</label>
                    <input
                      type="text"
                      value={p1Contact.apellido}
                      onChange={(e) => setP1Contact({ ...p1Contact, apellido: e.target.value })}
                    />
                  </div>
                </div>
                <div className={styles.formRow}>
                  <div className={styles.formGroup}>
                    <label>PUESTO</label>
                    <input
                      type="text"
                      value={p1Contact.puesto}
                      onChange={(e) => setP1Contact({ ...p1Contact, puesto: e.target.value })}
                    />
                  </div>
                  <div className={styles.formGroup}>
                    <label>TELÉFONO</label>
                    <input
                      type="tel"
                      value={p1Contact.telefono}
                      onChange={(e) => setP1Contact({ ...p1Contact, telefono: e.target.value })}
                    />
                  </div>
                </div>
                <div className={styles.formGroup}>
                  <label>CORREO ELECTRÓNICO</label>
                  <input
                    type="email"
                    value={p1Contact.correo}
                    onChange={(e) => setP1Contact({ ...p1Contact, correo: e.target.value })}
                  />
                </div>
              </div>

              <div className={styles.btnRow}>
                <button type="submit" className={styles.submitBtn}>
                  REGISTRAR
                </button>
              </div>
            </form>
          </div>
        )}

        {/* --- PANTALLA 2 & 4: ALTA DUEÑO / ASISTENTE --- */}
        {activeView === 'pantalla2_4' && (
          <div className={styles.card}>
            <h2>ALTA DUEÑO DE CALENDARIO / ASISTENTE</h2>
            <form onSubmit={handleP2Submit}>
              <div className={styles.formGroup}>
                <label>ORGANIZACIÓN</label>
                <select value={p2OrgId} onChange={(e) => setP2OrgId(e.target.value)} required>
                  <option value="">-- Selecciona --</option>
                  {orgs.map((o) => (
                    <option key={o.id} value={o.id}>
                      {o.nombre} ({o.region}, {o.pais})
                    </option>
                  ))}
                </select>
              </div>

              <div className={styles.formRow}>
                <div className={styles.formGroup}>
                  <label>NOMBRE</label>
                  <input
                    type="text"
                    required
                    value={p2Data.nombre}
                    onChange={(e) => setP2Data({ ...p2Data, nombre: e.target.value })}
                  />
                </div>
                <div className={styles.formGroup}>
                  <label>APELLIDO</label>
                  <input
                    type="text"
                    required
                    value={p2Data.apellido}
                    onChange={(e) => setP2Data({ ...p2Data, apellido: e.target.value })}
                  />
                </div>
              </div>

              <div className={styles.formGroup}>
                <label>PUESTO</label>
                <input
                  type="text"
                  required
                  value={p2Data.puesto}
                  onChange={(e) => setP2Data({ ...p2Data, puesto: e.target.value })}
                />
              </div>

              <div className={styles.formGroup}>
                <label>CORREO ELECTRÓNICO</label>
                <input
                  type="email"
                  required
                  value={p2Data.correo}
                  onChange={(e) => setP2Data({ ...p2Data, correo: e.target.value })}
                />
              </div>

              <div className={styles.formGroup}>
                <label>TIPO DE DUEÑO</label>
                <select
                  value={p2Data.tipo}
                  onChange={(e) => setP2Data({ ...p2Data, tipo: e.target.value })}
                >
                  <option value="DUEÑO_DE_CALENDARIO">Dueño de calendario</option>
                  <option value="ASISTENTE_DE_TRANSICION">Asistente de transicion</option>
                </select>
              </div>

              <div className={styles.btnRow}>
                <button type="submit" className={styles.submitBtn}>
                  REGISTRAR
                </button>
              </div>
            </form>
          </div>
        )}

        {/* --- PANTALLA 3: ALTA DE CALENDARIO --- */}
        {activeView === 'pantalla3' && (
          <div className={styles.card}>
            <h2>ALTA DE CALENDARIO</h2>
            <form onSubmit={handleP3Submit}>
              <div className={styles.formGroup}>
                <label>DUEÑO DE CALENDARIO</label>
                <select value={p3OwnerId} onChange={(e) => setP3OwnerId(e.target.value)} required>
                  <option value="">-- Selecciona --</option>
                  {owners
                    .filter((o) => o.tipo === 'DUEÑO_DE_CALENDARIO' && o.calendario)
                    .map((o) => (
                      <option key={o.id} value={o.id}>
                        {o.nombre} {o.apellido} ({o.organizacion?.nombre})
                      </option>
                    ))}
                </select>
              </div>

              <div className={styles.domicilioSection}>
                <h3>EVENTOS ADICIONALES PERMITIDOS (EN DOMICILIO) A USARSE EN ESTE CALENDARIO</h3>
                <p className={styles.infoText}>
                  El dueño de este calendario podrá activar algunos de estos eventos y cambiar el nombre de
                  presentación en el calendario, son eventos que requieren captura de campos de domicilio de forma
                  obligatoria.
                </p>

                <div className={styles.checkboxRow}>
                  <label className={styles.checkOption}>
                    <input
                      type="checkbox"
                      checked={p3Domicilio1}
                      onChange={(e) => setP3Domicilio1(e.target.checked)}
                    />
                    <span>A DOMICILIO 1 (60 min)</span>
                  </label>
                  <label className={styles.checkOption}>
                    <input
                      type="checkbox"
                      checked={p3Domicilio2}
                      onChange={(e) => setP3Domicilio2(e.target.checked)}
                    />
                    <span>A DOMICILIO 2 (90 min)</span>
                  </label>
                  <label className={styles.checkOption}>
                    <input
                      type="checkbox"
                      checked={p3Domicilio3}
                      onChange={(e) => setP3Domicilio3(e.target.checked)}
                    />
                    <span>A DOMICILIO 3 (120 min)</span>
                  </label>
                </div>
              </div>

              <div className={styles.btnRow}>
                <button type="submit" className={styles.submitBtn}>
                  REGISTRAR
                </button>
              </div>
            </form>
          </div>
        )}

        {/* --- PANTALLA 5: CAMBIO DE ESTADO DE DUEÑO --- */}
        {activeView === 'pantalla5' && (
          <div className={styles.card}>
            <h2>CAMBIO DE ESTADO DE DUEÑO</h2>
            <form onSubmit={handleP5Submit}>
              <div className={styles.formGroup}>
                <label>SELECCIONAR DUEÑO</label>
                <select value={p5OwnerId} onChange={(e) => setP5OwnerId(e.target.value)} required>
                  <option value="">-- Selecciona --</option>
                  {owners.map((o) => (
                    <option key={o.id} value={o.id}>
                      {o.nombre} {o.apellido} ({o.tipo === 'DUEÑO_DE_CALENDARIO' ? 'Dueño' : 'Asistente'} -{' '}
                      {o.estado})
                    </option>
                  ))}
                </select>
              </div>

              <div className={styles.formGroup}>
                <label>NUEVO ESTADO</label>
                <select
                  value={p5State.estado}
                  onChange={(e) => setP5State({ ...p5State, estado: e.target.value })}
                >
                  <option value="ACTIVO">ACTIVO</option>
                  <option value="AUSENTE_TEMPORAL">AUSENTE TEMPORAL</option>
                  <option value="EN_TRANSICION">EN TRANSICIÓN</option>
                  <option value="BAJA">BAJA</option>
                </select>
              </div>

              {p5State.estado === 'AUSENTE_TEMPORAL' && (
                <>
                  <div className={styles.formRow}>
                    <div className={styles.formGroup}>
                      <label>FECHA INICIO</label>
                      <input
                        type="date"
                        required
                        value={p5State.fechaInicioAusencia}
                        onChange={(e) => setP5State({ ...p5State, fechaInicioAusencia: e.target.value })}
                      />
                    </div>
                    <div className={styles.formGroup}>
                      <label>FECHA FIN</label>
                      <input
                        type="date"
                        required
                        value={p5State.fechaFinAusencia}
                        onChange={(e) => setP5State({ ...p5State, fechaFinAusencia: e.target.value })}
                      />
                    </div>
                  </div>
                  <div className={styles.formGroup}>
                    <label>CAUSA AUSENCIA</label>
                    <textarea
                      rows={2}
                      required
                      value={p5State.causaAusencia}
                      onChange={(e) => setP5State({ ...p5State, causaAusencia: e.target.value })}
                    />
                  </div>
                </>
              )}

              <div className={styles.btnRow}>
                <button type="submit" className={styles.submitBtn}>
                  REGISTRAR
                </button>
              </div>
            </form>
          </div>
        )}

        {/* --- PANTALLA 6: CAMBIO DE DUEÑO POR ASISTENTE --- */}
        {activeView === 'pantalla6' && (
          <div className={styles.card}>
            <h2>CAMBIO DE DUEÑO POR ASISTENTE DE TRANSICION</h2>
            <form onSubmit={handleP6Submit}>
              <div className={styles.formGroup}>
                <label>DUEÑO ACTUAL</label>
                <select
                  value={p6OwnerId}
                  onChange={(e) => {
                    setP6OwnerId(e.target.value);
                    setP6AssistantId('');
                  }}
                  required
                >
                  <option value="">-- Selecciona --</option>
                  {owners
                    .filter((o) => o.tipo === 'DUEÑO_DE_CALENDARIO' && o.calendario)
                    .map((o) => (
                      <option key={o.id} value={o.id}>
                        {o.nombre} {o.apellido} ({o.organizacion?.nombre})
                      </option>
                    ))}
                </select>
              </div>

              {p6OwnerId && (
                <div className={styles.formGroup}>
                  <label>NUEVO DUEÑO (AGENTE DE TRANSICION)</label>
                  <select
                    value={p6AssistantId}
                    onChange={(e) => setP6AssistantId(e.target.value)}
                    required
                  >
                    <option value="">-- Selecciona Asistente --</option>
                    {owners
                      .filter(
                        (o) =>
                          o.organizacionId === owners.find((x) => x.id === p6OwnerId)?.organizacionId &&
                          o.tipo === 'ASISTENTE_DE_TRANSICION' &&
                          o.estado === 'ACTIVO'
                      )
                      .map((o) => (
                        <option key={o.id} value={o.id}>
                          {o.nombre} {o.apellido} ({o.puesto})
                        </option>
                      ))}
                  </select>
                </div>
              )}

              <div className={styles.btnRow}>
                <button type="submit" className={styles.submitBtn}>
                  REGISTRAR
                </button>
              </div>
            </form>
          </div>
        )}

        {/* --- PANTALLA 7: BAJA DE CALENDARIO --- */}
        {activeView === 'pantalla7' && (
          <div className={styles.card}>
            <h2>BAJA DE CALENDARIO</h2>
            <form onSubmit={handleP7Submit}>
              <div className={styles.formGroup}>
                <label>CALENDARIO A ELIMINAR</label>
                <select value={p7CalendarId} onChange={(e) => setP7CalendarId(e.target.value)} required>
                  <option value="">-- Selecciona Calendario --</option>
                  {owners
                    .filter((o) => o.calendario)
                    .map((o) => (
                      <option key={o.calendario!.id} value={o.calendario!.id}>
                        {o.calendario!.nombre} ({o.nombre} {o.apellido})
                      </option>
                    ))}
                </select>
              </div>

              <div className={styles.btnRow}>
                <button type="submit" className={styles.dangerBtn}>
                  BORRAR
                </button>
              </div>
            </form>
          </div>
        )}

        {/* --- PANTALLA 8: BAJA DE DUEÑO --- */}
        {activeView === 'pantalla8' && (
          <div className={styles.card}>
            <h2>BAJA DE DUEÑO</h2>
            <form onSubmit={handleP8Submit}>
              <div className={styles.formGroup}>
                <label>DUEÑO A ELIMINAR</label>
                <select value={p8OwnerId} onChange={(e) => setP8OwnerId(e.target.value)} required>
                  <option value="">-- Selecciona --</option>
                  {owners.map((o) => (
                    <option key={o.id} value={o.id}>
                      {o.nombre} {o.apellido} ({o.tipo === 'DUEÑO_DE_CALENDARIO' ? 'Dueño' : 'Asistente'})
                    </option>
                  ))}
                </select>
              </div>

              <div className={styles.btnRow}>
                <button type="submit" className={styles.dangerBtn}>
                  BORRAR
                </button>
              </div>
            </form>
          </div>
        )}

        {/* --- PANTALLA 9: BAJA DE ORGANIZACION --- */}
        {activeView === 'pantalla9' && (
          <div className={styles.card}>
            <h2>BAJA DE ORGANIZACION</h2>
            <form onSubmit={handleP9Submit}>
              <div className={styles.formGroup}>
                <label>ORGANIZACION A ELIMINAR</label>
                <select value={p9OrgId} onChange={(e) => setP9OrgId(e.target.value)} required>
                  <option value="">-- Selecciona --</option>
                  {orgs.map((o) => (
                    <option key={o.id} value={o.id}>
                      {o.nombre} ({o.region}, {o.pais})
                    </option>
                  ))}
                </select>
              </div>

              <div className={styles.btnRow}>
                <button type="submit" className={styles.dangerBtn}>
                  ELIMINAR
                </button>
              </div>
            </form>
          </div>
        )}

        {/* --- PANTALLA 1 (PROPUESTA): LISTA DE COMUNICACIONES --- */}
        {activeView === 'comunicaciones_lista' && (
          <div className={styles.card}>
            <h2>DUEÑO DE CALENDARIO - LISTA DE COMUNICACIONES</h2>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem', alignItems: 'center' }}>
              <div className={styles.searchRow} style={{ marginBottom: 0 }}>
                <div className={styles.formGroup}>
                  <label>PAÍS</label>
                  <select
                    value={comSearch.pais}
                    onChange={(e) => setComSearch({ ...comSearch, pais: e.target.value })}
                  >
                    <option value="TODOS">Todos</option>
                    <option value="México">México</option>
                    <option value="Colombia">Colombia</option>
                    <option value="Chile">Chile</option>
                  </select>
                </div>
                <div className={styles.formGroup}>
                  <label>TIPO COMUNICACIÓN</label>
                  <select
                    value={comSearch.tipo}
                    onChange={(e) => setComSearch({ ...comSearch, tipo: e.target.value })}
                  >
                    <option value="TODOS">Todos</option>
                    <option value="CORREO">CORREO</option>
                    <option value="WHATSAPP">WHATSAPP</option>
                  </select>
                </div>
              </div>
              <button
                className={styles.submitBtn}
                onClick={() => {
                  setComForm({
                    codigo: '',
                    nombre: 'CONFIRMACION EVENTO - SOLICITANTE',
                    pais: 'México',
                    tipoComunicacion: 'CORREO',
                    tipoActivador: 'EVENTO',
                    idActivador: 'CALMX-001',
                    accionActivador: 'SOLICITUD EVENTO USUARIO',
                    horasRelativas: 24,
                    incluirFinSemana: true,
                    origen: 'ORGANIZACION',
                    segmento: 'TODOS',
                    destinatarios: {
                      solicitante: true,
                      duenoCalendario: true,
                      duenoSustituto: false,
                      asistenteTransicion: false,
                      invitadosSolicitante: true,
                      invitadosDueno: true,
                    },
                    asuntoHeader: '{nombre solicitante} tu evento esta confirmado',
                    mensajeCopy: 'Te Confirmamos la reservación para tú {tipo de evento} con {dueño calendario}...',
                  });
                  setActiveView('comunicaciones_alta_cambios');
                }}
              >
                + CREAR NUEVA
              </button>
            </div>

            <table className={styles.comTable}>
              <thead>
                <tr>
                  <th>ID COMUNICACIÓN</th>
                  <th>TIPO ACTIVADOR</th>
                  <th>ID ACTIVADOR</th>
                  <th>ACCIÓN ACTIVADOR</th>
                  <th>TIPO COMUNICACIÓN</th>
                  <th>STATUS</th>
                  <th>ACCIONES</th>
                </tr>
              </thead>
              <tbody>
                {comunicaciones.length === 0 ? (
                  <tr>
                    <td colSpan={7} style={{ textAlign: 'center', padding: '2rem', color: '#94a3b8' }}>
                      No hay comunicaciones registradas aún. Haz clic en "+ CREAR NUEVA" para agregar una.
                    </td>
                  </tr>
                ) : (
                  comunicaciones
                    .filter((c) => comSearch.pais === 'TODOS' || c.pais === comSearch.pais)
                    .filter((c) => comSearch.tipo === 'TODOS' || c.tipoComunicacion === comSearch.tipo)
                    .map((c) => (
                      <tr key={c.id}>
                        <td><strong>{c.codigo}</strong></td>
                        <td>{c.tipoActivador}</td>
                        <td>{c.idActivador || 'CALMX-001'}</td>
                        <td>{c.accionActivador || 'SOLICITUD EVENTO USUARIO'}</td>
                        <td>{c.tipoComunicacion}</td>
                        <td>
                          <span className={c.status === 'ACTIVO' ? styles.statusActive : styles.statusInactive}>
                            {c.status}
                          </span>
                        </td>
                        <td>
                          <div className={styles.actionBtnGroup}>
                            <button
                              className={styles.smBtn}
                              onClick={() => setSelectedComDetail(c)}
                            >
                              DETALLE
                            </button>
                            <button
                              className={styles.smBtn}
                              onClick={() => {
                                let parsedDest = {
                                  solicitante: true,
                                  duenoCalendario: true,
                                  duenoSustituto: false,
                                  asistenteTransicion: false,
                                  invitadosSolicitante: true,
                                  invitadosDueno: true,
                                };
                                try {
                                  const arr = JSON.parse(c.destinatarios);
                                  parsedDest = {
                                    solicitante: arr.includes('SOLICITANTE'),
                                    duenoCalendario: arr.includes('DUEÑO_CALENDARIO'),
                                    duenoSustituto: arr.includes('DUEÑO_SUSTITUTO'),
                                    asistenteTransicion: arr.includes('ASISTENTE_TRANSICION'),
                                    invitadosSolicitante: arr.includes('INVITADOS_SOLICITANTE'),
                                    invitadosDueno: arr.includes('INVITADOS_DUEÑO'),
                                  };
                                } catch (e) {}

                                setComForm({
                                  id: c.id,
                                  codigo: c.codigo,
                                  nombre: c.nombre,
                                  pais: c.pais || 'México',
                                  tipoComunicacion: c.tipoComunicacion,
                                  tipoActivador: (c.tipoActivador as 'EVENTO' | 'REGLA') || 'EVENTO',
                                  idActivador: c.idActivador || 'CALMX-001',
                                  accionActivador: c.accionActivador || 'SOLICITUD EVENTO USUARIO',
                                  horasRelativas: c.horasRelativas || 24,
                                  incluirFinSemana: c.incluirFinSemana,
                                  origen: c.origen,
                                  segmento: c.segmento,
                                  destinatarios: parsedDest,
                                  asuntoHeader: c.asuntoHeader,
                                  mensajeCopy: c.mensajeCopy,
                                });
                                setActiveView('comunicaciones_alta_cambios');
                              }}
                            >
                              EDITAR
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                )}
              </tbody>
            </table>
          </div>
        )}

        {/* --- MODAL EMERGENTE: PANTALLA DETALLE --- */}
        {selectedComDetail && (
          <div className={styles.modalOverlay} onClick={() => setSelectedComDetail(null)}>
            <div className={styles.modalCard} onClick={(e) => e.stopPropagation()}>
              <h2 className={styles.modalTitle}>ID: {selectedComDetail.codigo}</h2>
              <div className={styles.modalRow}>
                <span className={styles.modalLabel}>FECHA REGISTRO:</span>
                <span className={styles.modalValue}>
                  {selectedComDetail.createdAt
                    ? new Date(selectedComDetail.createdAt).toLocaleDateString('es-MX')
                    : '25/07/2026'}
                </span>
              </div>
              <div className={styles.modalRow}>
                <span className={styles.modalLabel}>TIPO ACTIVADOR:</span>
                <span className={styles.modalValue}>{selectedComDetail.tipoActivador}</span>
              </div>
              <div className={styles.modalRow}>
                <span className={styles.modalLabel}>ACTIVADOR:</span>
                <span className={styles.modalValue}>
                  {selectedComDetail.idActivador || 'CALMX-001'}
                  {selectedComDetail.tipoActivador === 'REGLA'
                    ? ` (MENOS ${selectedComDetail.horasRelativas || 24} HORAS ${
                        selectedComDetail.incluirFinSemana ? 'CON' : 'SIN'
                      } FIN DE SEMANA)`
                    : ''}
                </span>
              </div>
              <div className={styles.modalRow}>
                <span className={styles.modalLabel}>ACCIÓN ACTIVADOR:</span>
                <span className={styles.modalValue}>
                  {selectedComDetail.accionActivador || 'REGISTRO EVENTO DE USUARIO'}
                </span>
              </div>
              <div className={styles.modalRow}>
                <span className={styles.modalLabel}>TIPO COMUNICACIÓN:</span>
                <span className={styles.modalValue}>{selectedComDetail.tipoComunicacion}</span>
              </div>
              <div className={styles.modalRow}>
                <span className={styles.modalLabel}>ORIGEN:</span>
                <span className={styles.modalValue}>{selectedComDetail.origen}</span>
              </div>
              <div className={styles.modalRow}>
                <span className={styles.modalLabel}>DESTINATARIOS:</span>
                <span className={styles.modalValue}>
                  {(() => {
                    try {
                      return JSON.parse(selectedComDetail.destinatarios).join(', ');
                    } catch (e) {
                      return selectedComDetail.destinatarios || 'SOLICITANTE, DUEÑO CALENDARIO';
                    }
                  })()}
                </span>
              </div>
              <div className={styles.modalRow}>
                <span className={styles.modalLabel}>STATUS:</span>
                <span
                  className={
                    selectedComDetail.status === 'ACTIVO' ? styles.statusActive : styles.statusInactive
                  }
                >
                  {selectedComDetail.status}
                </span>
              </div>

              <div className={styles.btnRow} style={{ justifyContent: 'center', marginTop: '1.5rem' }}>
                <button
                  className={styles.submitBtn}
                  onClick={() => setSelectedComDetail(null)}
                >
                  CERRAR
                </button>
              </div>
            </div>
          </div>
        )}

        {/* --- PANTALLA 2 (PROPUESTA): ALTA Y CAMBIOS DE COMUNICACIÓN --- */}
        {activeView === 'comunicaciones_alta_cambios' && (
          <div className={styles.card}>
            <h2>ADMINISTRACIÓN DE CALENDARIOS - ALTA Y CAMBIOS</h2>

            {/* SECCIÓN 1: BUSCADOR & DATOS BÁSICOS */}
            <div className={styles.domicilioSection}>
              <h3>COMUNICACIÓN - DATOS</h3>
              <div className={styles.searchRow}>
                <div className={styles.formGroup}>
                  <label>PAÍS</label>
                  <select
                    value={comForm.pais}
                    onChange={(e) => setComForm({ ...comForm, pais: e.target.value })}
                  >
                    <option value="México">México</option>
                    <option value="Colombia">Colombia</option>
                    <option value="Chile">Chile</option>
                  </select>
                </div>
                <div className={styles.formGroup}>
                  <label>TIPO COMUNICACIÓN</label>
                  <select
                    value={comForm.tipoComunicacion}
                    onChange={(e) => setComForm({ ...comForm, tipoComunicacion: e.target.value })}
                  >
                    <option value="CORREO">CORREO</option>
                    <option value="WHATSAPP">WHATSAPP</option>
                  </select>
                </div>
                <div className={styles.formGroup}>
                  <label>NOMBRE COMUNICACIÓN</label>
                  <input
                    type="text"
                    value={comForm.nombre}
                    onChange={(e) => setComForm({ ...comForm, nombre: e.target.value })}
                  />
                </div>
              </div>
            </div>

            {/* SECCIÓN 2: ACTIVADOR */}
            <div className={styles.domicilioSection} style={{ marginTop: '1.5rem' }}>
              <h3>ID COMUNICACIÓN: {comForm.codigo || '(AUTOGENERADO)'} | TIPO: {comForm.tipoComunicacion}</h3>
              <div className={styles.searchRow}>
                <div className={styles.formGroup}>
                  <label>ACTIVAR POR</label>
                  <select
                    value={comForm.tipoActivador}
                    onChange={(e) =>
                      setComForm({
                        ...comForm,
                        tipoActivador: e.target.value as 'EVENTO' | 'REGLA',
                      })
                    }
                  >
                    <option value="EVENTO">EVENTO (Disparo directo por usuario)</option>
                    <option value="REGLA">REGLA (Cálculo de horas pre/post evento)</option>
                  </select>
                </div>

                <div className={styles.formGroup}>
                  <label>SELEACCIONE EVENTO BASE</label>
                  <select
                    value={comForm.idActivador}
                    onChange={(e) => setComForm({ ...comForm, idActivador: e.target.value })}
                  >
                    <option value="CALMX-001">CALMX-001 (Solicitud Evento Usuario)</option>
                    <option value="CALMX-002">CALMX-002 (Reagendar Evento)</option>
                    <option value="CALMX-003">CALMX-003 (Cancelar Evento)</option>
                  </select>
                </div>

                {comForm.tipoActivador === 'REGLA' && (
                  <>
                    <div className={styles.formGroup} style={{ maxWidth: '120px' }}>
                      <label>HORAS</label>
                      <input
                        type="number"
                        value={comForm.horasRelativas}
                        onChange={(e) => setComForm({ ...comForm, horasRelativas: parseInt(e.target.value, 10) || 0 })}
                      />
                    </div>
                    <div className={styles.formGroup}>
                      <label>INCLUIR FIN DE SEMANA</label>
                      <select
                        value={comForm.incluirFinSemana ? 'SI' : 'NO'}
                        onChange={(e) => setComForm({ ...comForm, incluirFinSemana: e.target.value === 'SI' })}
                      >
                        <option value="SI">SI</option>
                        <option value="NO">NO</option>
                      </select>
                    </div>
                  </>
                )}
              </div>
            </div>

            {/* SECCIÓN 3: ORIGEN - DESTINATARIOS */}
            <div className={styles.domicilioSection} style={{ marginTop: '1.5rem' }}>
              <h3>ORIGEN Y DESTINATARIOS</h3>
              <div className={styles.searchRow}>
                <div className={styles.formGroup}>
                  <label>ORIGEN</label>
                  <select
                    value={comForm.origen}
                    onChange={(e) => setComForm({ ...comForm, origen: e.target.value })}
                  >
                    <option value="ORGANIZACION">ORGANIZACION</option>
                    <option value="DUEÑO_CALENDARIO">DUEÑO DE CALENDARIO</option>
                  </select>
                </div>
                <div className={styles.formGroup}>
                  <label>SEGMENTO</label>
                  <select
                    value={comForm.segmento}
                    onChange={(e) => setComForm({ ...comForm, segmento: e.target.value })}
                  >
                    <option value="TODOS">TODOS</option>
                    <option value="ESPECIAL">ESPECIAL</option>
                  </select>
                </div>
              </div>

              <label style={{ fontSize: '0.85rem', fontWeight: 700, color: '#38bdf8', marginTop: '1rem', display: 'block' }}>
                DESTINATARIOS:
              </label>
              <div className={styles.checkboxGrid}>
                <label className={styles.checkOption}>
                  <input
                    type="checkbox"
                    checked={comForm.destinatarios.solicitante}
                    onChange={(e) =>
                      setComForm({
                        ...comForm,
                        destinatarios: { ...comForm.destinatarios, solicitante: e.target.checked },
                      })
                    }
                  />
                  SOLICITANTE
                </label>
                <label className={styles.checkOption}>
                  <input
                    type="checkbox"
                    checked={comForm.destinatarios.duenoCalendario}
                    onChange={(e) =>
                      setComForm({
                        ...comForm,
                        destinatarios: { ...comForm.destinatarios, duenoCalendario: e.target.checked },
                      })
                    }
                  />
                  DUEÑO CALENDARIO
                </label>
                <label className={styles.checkOption}>
                  <input
                    type="checkbox"
                    checked={comForm.destinatarios.duenoSustituto}
                    onChange={(e) =>
                      setComForm({
                        ...comForm,
                        destinatarios: { ...comForm.destinatarios, duenoSustituto: e.target.checked },
                      })
                    }
                  />
                  DUEÑO SUSTITUTO
                </label>
                <label className={styles.checkOption}>
                  <input
                    type="checkbox"
                    checked={comForm.destinatarios.asistenteTransicion}
                    onChange={(e) =>
                      setComForm({
                        ...comForm,
                        destinatarios: { ...comForm.destinatarios, asistenteTransicion: e.target.checked },
                      })
                    }
                  />
                  ASISTENTE TRANSICIÓN
                </label>
                <label className={styles.checkOption}>
                  <input
                    type="checkbox"
                    checked={comForm.destinatarios.invitadosSolicitante}
                    onChange={(e) =>
                      setComForm({
                        ...comForm,
                        destinatarios: { ...comForm.destinatarios, invitadosSolicitante: e.target.checked },
                      })
                    }
                  />
                  INVITADOS SOLICITANTE
                </label>
                <label className={styles.checkOption}>
                  <input
                    type="checkbox"
                    checked={comForm.destinatarios.invitadosDueno}
                    onChange={(e) =>
                      setComForm({
                        ...comForm,
                        destinatarios: { ...comForm.destinatarios, invitadosDueno: e.target.checked },
                      })
                    }
                  />
                  INVITADOS DUEÑO
                </label>
              </div>
            </div>

            {/* SECCIÓN 4: SUSTITUTOS DE PARAMETRIZACIÓN */}
            <div className={styles.domicilioSection} style={{ marginTop: '1.5rem' }}>
              <h3>SUSTITUTOS DE PARAMETRIZACIÓN</h3>
              <div style={{ display: 'flex', gap: '1rem', alignItems: 'center', marginBottom: '1rem' }}>
                <select
                  value={selectedVarToAdd}
                  onChange={(e) => setSelectedVarToAdd(e.target.value)}
                  style={{ flex: 1, padding: '0.6rem', borderRadius: '0.375rem', background: 'var(--card-input-bg)', color: '#fff', border: '1px solid var(--card-border)' }}
                >
                  <option value="{nombre solicitante}">{'{nombre solicitante}'}</option>
                  <option value="{hora evento}">{'{hora evento}'}</option>
                  <option value="{tema}">{'{tema}'}</option>
                  <option value="{tipo de evento}">{'{tipo de evento}'}</option>
                  <option value="{dueño calendario}">{'{dueño calendario}'}</option>
                  <option value="{dia evento}">{'{dia evento}'}</option>
                  <option value="{mes evento}">{'{mes evento}'}</option>
                  <option value="{organizacion}">{'{organizacion}'}</option>
                  <option value="{frase / slogan}">{'{frase / slogan}'}</option>
                </select>
                <button
                  type="button"
                  className={styles.smBtn}
                  onClick={() => {
                    if (!comVariables.some((v) => v.variable === selectedVarToAdd)) {
                      setComVariables([
                        ...comVariables,
                        {
                          variable: selectedVarToAdd,
                          descripcion: `Variable ${selectedVarToAdd}`,
                          obligatoria: true,
                          regla: '',
                          valorAlternativo: '',
                        },
                      ]);
                    }
                  }}
                >
                  AGREGAR
                </button>
              </div>

              <table className={styles.comTable}>
                <thead>
                  <tr>
                    <th>VARIABLE</th>
                    <th>DESCRIPCIÓN</th>
                    <th>OBLIGATORIA</th>
                    <th>REGLA</th>
                    <th>VALOR ALTERNATIVO</th>
                  </tr>
                </thead>
                <tbody>
                  {comVariables.map((v, idx) => (
                    <tr key={idx}>
                      <td><strong>{v.variable}</strong></td>
                      <td>{v.descripcion}</td>
                      <td>{v.obligatoria ? 'si' : 'no'}</td>
                      <td>{v.regla || '-'}</td>
                      <td>{v.valorAlternativo || '-'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* SECCIÓN 5: ASUNTO Y MENSAJE */}
            <div className={styles.domicilioSection} style={{ marginTop: '1.5rem' }}>
              <h3>PLANTILLA DE MENSAJE</h3>
              <div className={styles.formGroup} style={{ marginBottom: '1rem' }}>
                <label>ASUNTO - HEADER</label>
                <input
                  type="text"
                  value={comForm.asuntoHeader}
                  onChange={(e) => setComForm({ ...comForm, asuntoHeader: e.target.value })}
                />
              </div>

              <div className={styles.formGroup}>
                <label>MENSAJE - COPY</label>
                <textarea
                  className={styles.textareaField}
                  rows={6}
                  value={comForm.mensajeCopy}
                  onChange={(e) => setComForm({ ...comForm, mensajeCopy: e.target.value })}
                />
              </div>

              <div style={{ marginTop: '1rem' }}>
                <button
                  type="button"
                  className={styles.smBtn}
                  style={{ background: '#0284c7', color: '#ffffff' }}
                  onClick={() => {
                    // Interpolación de simulación / verificación
                    const sampleValues: Record<string, string> = {
                      '{nombre solicitante}': 'Juan Pérez',
                      '{hora evento}': '14:00 hrs',
                      '{tema}': 'Reunión de Avance del Proyecto',
                      '{tipo de evento}': 'CITA / REUNIÓN',
                      '{dueño calendario}': 'Dra. María López',
                      '{dia evento}': '15',
                      '{mes evento}': 'Agosto',
                      '{organizacion}': 'Calendarios Pro',
                      '{frase / slogan}': 'Tu tiempo, tu control.',
                    };

                    let header = comForm.asuntoHeader;
                    let body = comForm.mensajeCopy;

                    Object.entries(sampleValues).forEach(([k, v]) => {
                      header = header.replace(new RegExp(k, 'g'), v);
                      body = body.replace(new RegExp(k, 'g'), v);
                    });

                    setComVerification({
                      verified: true,
                      previewHeader: header,
                      previewCopy: body,
                    });
                  }}
                >
                  VERIFICAR SUSTITUTOS EN ASUNTO Y MENSAJE - COPY
                </button>

                {comVerification && (
                  <div className={styles.previewBox}>
                    <div className={styles.previewHeader}>✅ VERIFICACIÓN EXITOSA - VISTA PREVIA DEL CORREO:</div>
                    <div style={{ fontWeight: 700, marginBottom: '0.5rem', color: '#f8fafc' }}>
                      ASUNTO: {comVerification.previewHeader}
                    </div>
                    <div className={styles.previewBody}>{comVerification.previewCopy}</div>
                  </div>
                )}
              </div>
            </div>

            {/* SECCIÓN 6: ENLACES Y ACCIONES */}
            <div className={styles.domicilioSection} style={{ marginTop: '1.5rem' }}>
              <h3>ENLACES Y ACCIONES</h3>
              <table className={styles.comTable}>
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>TEXTO VISIBLE</th>
                    <th>URL / ACCIÓN</th>
                    <th>VARIABLE</th>
                    <th>CONDICIÓN</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>CTA-001</td>
                    <td>REAGENDAR</td>
                    <td>/manage-booking/[id]?action=reschedule</td>
                    <td>EVENTO</td>
                    <td>AL DAR CLICK</td>
                  </tr>
                  <tr>
                    <td>CTA-002</td>
                    <td>CANCELAR</td>
                    <td>/manage-booking/[id]?action=cancel</td>
                    <td>EVENTO</td>
                    <td>AL DAR CLICK</td>
                  </tr>
                </tbody>
              </table>
            </div>

            {/* BOTONES FINALES DE GUARDAR / ACTIVAR */}
            <div className={styles.btnRow} style={{ gap: '1rem', marginTop: '2rem' }}>
              <button
                type="button"
                className={styles.submitBtn}
                style={{ background: '#475569' }}
                onClick={async () => {
                  const destArray = Object.entries(comForm.destinatarios)
                    .filter(([_, val]) => val)
                    .map(([key, _]) => key.toUpperCase());

                  const res = await fetch('/api/comunicaciones', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                      id: comForm.id,
                      codigo: comForm.codigo,
                      nombre: comForm.nombre,
                      pais: comForm.pais,
                      tipoComunicacion: comForm.tipoComunicacion,
                      tipoActivador: comForm.tipoActivador,
                      idActivador: comForm.idActivador,
                      accionActivador: comForm.accionActivador,
                      horasRelativas: comForm.horasRelativas,
                      incluirFinSemana: comForm.incluirFinSemana,
                      origen: comForm.origen,
                      segmento: comForm.segmento,
                      destinatarios: destArray,
                      asuntoHeader: comForm.asuntoHeader,
                      mensajeCopy: comForm.mensajeCopy,
                      status: 'NO_ACTIVO',
                    }),
                  });

                  if (res.ok) {
                    alert('Comunicación guardada en estado NO ACTIVO.');
                    setActiveView('comunicaciones_lista');
                    fetchData();
                  }
                }}
              >
                GUARDAR
              </button>

              <button
                type="button"
                className={styles.submitBtn}
                onClick={async () => {
                  const destArray = Object.entries(comForm.destinatarios)
                    .filter(([_, val]) => val)
                    .map(([key, _]) => key.toUpperCase());

                  const res = await fetch('/api/comunicaciones', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                      id: comForm.id,
                      codigo: comForm.codigo,
                      nombre: comForm.nombre,
                      pais: comForm.pais,
                      tipoComunicacion: comForm.tipoComunicacion,
                      tipoActivador: comForm.tipoActivador,
                      idActivador: comForm.idActivador,
                      accionActivador: comForm.accionActivador,
                      horasRelativas: comForm.horasRelativas,
                      incluirFinSemana: comForm.incluirFinSemana,
                      origen: comForm.origen,
                      segmento: comForm.segmento,
                      destinatarios: destArray,
                      asuntoHeader: comForm.asuntoHeader,
                      mensajeCopy: comForm.mensajeCopy,
                      status: 'ACTIVO',
                    }),
                  });

                  if (res.ok) {
                    alert('Comunicación guardada y ACTIVADA con éxito.');
                    setActiveView('comunicaciones_lista');
                    fetchData();
                  }
                }}
              >
                ACTIVAR
              </button>
            </div>
          </div>
        )}

        {/* --- PANTALLA 3 (PROPUESTA): BAJA COMUNICACIÓN --- */}
        {activeView === 'comunicaciones_baja' && (
          <div className={styles.card}>
            <h2>BAJA DE COMUNICACIÓN</h2>
            <div className={styles.formGroup}>
              <label>SELECCIONAR COMUNICACIÓN A ELIMINAR / DESACTIVAR</label>
              <select
                value={comBajaId}
                onChange={(e) => setComBajaId(e.target.value)}
              >
                <option value="">-- Selecciona Comunicación --</option>
                {comunicaciones.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.codigo} - {c.nombre} ({c.status})
                  </option>
                ))}
              </select>
            </div>

            <div className={styles.btnRow}>
              <button
                type="button"
                className={styles.dangerBtn}
                onClick={async () => {
                  if (!comBajaId) return alert('Selecciona una comunicación');
                  const confirmed = window.confirm('¿Estás seguro de dar de baja/eliminar esta comunicación?');
                  if (!confirmed) return;

                  const res = await fetch(`/api/comunicaciones?id=${comBajaId}`, {
                    method: 'DELETE',
                  });

                  if (res.ok) {
                    alert('Comunicación eliminada con éxito.');
                    setComBajaId('');
                    setActiveView('comunicaciones_lista');
                    fetchData();
                  }
                }}
              >
                DAR DE BAJA
              </button>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

