'use client';

import React, { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import styles from './page.module.css';

interface Participante {
  id: string;
  nombre: string;
  apellido: string;
  correo: string;
  esCreador: boolean;
}

interface Evento {
  id: string;
  tema: string;
  fecha: string;
  horaInicio: string;
  duracion: number;
  estado: string;
  calendario: {
    id: string;
    nombre: string;
    limitesCancelar: number;
    limitesReagendar: number;
    dueno: {
      nombre: string;
      apellido: string;
      puesto: string;
      organizacion?: {
        nombre: string;
        imagenUrl?: string;
        leyenda?: string;
      };
    };
    tiposEventos: { id: string; nombre: string; duracion: number; margenSeguridad: number }[];
    disponibilidades: { id: string; diaSemana: number; horaInicio: string; horaFin: string }[];
    fechasEspeciales: { id: string; fecha: string; horaInicio: string; horaFin: string }[];
  };
  participantes: Participante[];
}

export default function ManageBooking() {
  const params = useParams();
  const id = params?.id as string;

  const [event, setEvent] = useState<Evento | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Mode selection: 'menu' | 'cancel' | 'reschedule' | 'success_cancel' | 'success_reschedule'
  const [mode, setMode] = useState<'menu' | 'cancel' | 'reschedule' | 'success_cancel' | 'success_reschedule'>('menu');

  // Rescheduling states
  const [newDate, setNewDate] = useState('');
  const [selectedSlot, setSelectedSlot] = useState('');
  const [availableSlots, setAvailableSlots] = useState<string[]>([]);
  const [isLoadingSlots, setIsLoadingSlots] = useState(false);

  // Load event details
  const fetchEvent = async () => {
    try {
      const res = await fetch(`/api/bookings/${id}`);
      if (!res.ok) {
        throw new Error('No se pudo encontrar la reserva especificada.');
      }
      const data = await res.json();
      setEvent(data);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (id) fetchEvent();
  }, [id]);

  // Compute if action is allowed based on limits
  const isActionAllowed = (limitHours: number) => {
    if (!event) return false;
    const bookingDate = new Date(event.fecha);
    const [h, m] = event.horaInicio.split(':').map(Number);
    bookingDate.setHours(h, m, 0, 0);

    const now = new Date();
    const diffMs = bookingDate.getTime() - now.getTime();
    const diffHours = diffMs / (1000 * 60 * 60);

    return diffHours >= limitHours;
  };

  const allowedToCancel = isActionAllowed(event?.calendario?.limitesCancelar || 0);
  const allowedToReschedule = isActionAllowed(event?.calendario?.limitesReagendar || 0);

  // Fetch available slots for the rescheduling date
  useEffect(() => {
    if (!newDate || !event) return;

    const calculateSlots = async () => {
      setIsLoadingSlots(true);
      try {
        const calendar = event.calendario;
        // Find the event type with the same duration
        const eventType = calendar.tiposEventos[0] || { duracion: event.duracion, margenSeguridad: 15 };

        const bookingsRes = await fetch(`/api/bookings?calendarId=${calendar.id}`);
        const bookings = await bookingsRes.json();

        const selDate = new Date(newDate);
        const dayOfWeek = selDate.getUTCDay();

        const specialOverride = calendar.fechasEspeciales.find(
          f => new Date(f.fecha).toDateString() === selDate.toDateString()
        );

        let activeWindows: { horaInicio: string; horaFin: string }[] = [];

        if (specialOverride) {
          activeWindows = [{ horaInicio: specialOverride.horaInicio, horaFin: specialOverride.horaFin }];
        } else {
          activeWindows = calendar.disponibilidades
            .filter(d => d.diaSemana === dayOfWeek)
            .map(d => ({ horaInicio: d.horaInicio, horaFin: d.horaFin }));
        }

        const slots: string[] = [];
        const duration = eventType.duracion;
        const buffer = eventType.margenSeguridad;
        const totalBlock = duration + buffer;

        activeWindows.forEach(win => {
          let current = timeToMinutes(win.horaInicio);
          const end = timeToMinutes(win.horaFin);

          while (current + duration <= end) {
            const slotStr = minutesToTime(current);
            const dateStr = selDate.toISOString().split('T')[0];
            
            const isOverlap = bookings.some((b: any) => {
              if (b.id === event.id) return false; // exclude current booking itself
              if (new Date(b.fecha).toISOString().split('T')[0] !== dateStr) return false;
              if (b.estado === 'CANCELADO') return false;

              const bStart = timeToMinutes(b.horaInicio);
              const bEnd = bStart + b.duracion;

              const sStart = current;
              const sEnd = current + totalBlock;

              return (sStart < bEnd && sEnd > bStart);
            });

            if (!isOverlap) {
              slots.push(slotStr);
            }
            current += 15;
          }
        });

        setAvailableSlots(slots);
      } catch (err) {
        console.error(err);
      } finally {
        setIsLoadingSlots(false);
      }
    };

    calculateSlots();
  }, [newDate, event]);

  const timeToMinutes = (timeStr: string) => {
    const [h, m] = timeStr.split(':').map(Number);
    return h * 60 + m;
  };

  const minutesToTime = (min: number) => {
    const h = Math.floor(min / 60).toString().padStart(2, '0');
    const m = (min % 60).toString().padStart(2, '0');
    return `${h}:${m}`;
  };

  // Perform Cancel
  const handleCancel = async () => {
    if (!allowedToCancel) return;
    try {
      const res = await fetch(`/api/bookings/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ estado: 'CANCELADO' }),
      });
      if (res.ok) {
        setMode('success_cancel');
      }
    } catch (err) {
      console.error(err);
    }
  };

  // Perform Reschedule
  const handleReschedule = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!allowedToReschedule || !newDate || !selectedSlot) return;
    try {
      const res = await fetch(`/api/bookings/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          fecha: newDate,
          horaInicio: selectedSlot,
        }),
      });
      if (res.ok) {
        setMode('success_reschedule');
        fetchEvent();
      }
    } catch (err) {
      console.error(err);
    }
  };

  if (loading) return <div className={styles.container}><div className={styles.msg}>Cargando datos de la cita...</div></div>;
  if (error || !event) return <div className={styles.container}><div className={styles.errorMsg}>⚠️ Error: {error || 'No se pudo cargar la cita.'}</div></div>;

  const creator = event.participantes.find(p => p.esCreador);
  const org = event.calendario.dueno.organizacion;

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <div className={styles.headerContent}>
          {/* IDENTIDAD ORGANIZACIÓN */}
          <div className={styles.leftHeader}>
            {org?.imagenUrl ? (
              <img src={org.imagenUrl} alt={org.nombre} className={styles.orgLogo} />
            ) : (
              <div className={styles.orgPlaceholder}>🏢</div>
            )}
            <div className={styles.orgText}>
              <span className={styles.orgName}>{org?.nombre || 'SISTEMA DE CALENDARIOS'}</span>
              <span className={styles.orgSlogan}>{org?.leyenda || 'Reserva de citas online'}</span>
            </div>
          </div>

          {/* ACTOR / ROL */}
          <div className={styles.centerHeader}>
            <span className={styles.actorRole}>INVITADO / TERCERO</span>
          </div>

          {/* ACTOR DETALLES Y NAVEGACIÓN */}
          <div className={styles.rightHeader}>
            <span className={styles.actorName}>
              {creator ? `${creator.nombre} ${creator.apellido}` : 'Invitado'}
            </span>
            <span className={styles.actorPage}>GESTIÓN DE CITA</span>
            <Link href="/" className={styles.exitBtn}>
              GUARDAR Y SALIR
            </Link>
          </div>
        </div>
      </header>

      <main className={styles.main}>
        {mode === 'menu' && (
          <div className={styles.card}>
            <h2>Detalles de tu reunión</h2>
            <div className={styles.eventSummary}>
              <p><strong>Tema:</strong> {event.tema}</p>
              <p><strong>Profesional:</strong> {event.calendario.dueno.nombre} {event.calendario.dueno.apellido}</p>
              <p><strong>Puesto:</strong> {event.calendario.dueno.puesto}</p>
              <p><strong>Fecha:</strong> {new Date(event.fecha).toLocaleDateString()}</p>
              <p><strong>Hora:</strong> {event.horaInicio} ({event.duracion} min)</p>
              {creator && <p><strong>Registrado por:</strong> {creator.nombre} {creator.apellido} ({creator.correo})</p>}
            </div>

            <div className={styles.actionsRow}>
              <button 
                className={styles.rescheduleBtn}
                onClick={() => setMode('reschedule')}
              >
                📅 Reagendar Cita
              </button>
              <button 
                className={styles.cancelBtn}
                onClick={() => setMode('cancel')}
              >
                ❌ Cancelar Cita
              </button>
            </div>
          </div>
        )}

        {mode === 'cancel' && (
          <div className={styles.card}>
            <h2>Cancelar Reserva</h2>
            {allowedToCancel ? (
              <>
                <p className={styles.desc}>
                  ¿Estás seguro de que deseas cancelar tu cita programada para el <strong>{new Date(event.fecha).toLocaleDateString()}</strong> a las <strong>{event.horaInicio}</strong>?
                </p>
                <div className={styles.btnRow}>
                  <button className={styles.backBtn} onClick={() => setMode('menu')}>Atrás</button>
                  <button className={styles.dangerBtn} onClick={handleCancel}>Confirmar Cancelación</button>
                </div>
              </>
            ) : (
              <div className={styles.errorAlert}>
                <h3>⚠️ Acción no permitida</h3>
                <p>
                  Este evento no puede cancelarse debido a que los tiempos establecidos no lo permiten. 
                  (Requiere al menos {event.calendario.limitesCancelar} horas de anticipación).
                </p>
                <button className={styles.backBtn} style={{ marginTop: '1.5rem' }} onClick={() => setMode('menu')}>Volver</button>
              </div>
            )}
          </div>
        )}

        {mode === 'reschedule' && (
          <div className={styles.card}>
            <h2>Reagendar Reserva</h2>
            {allowedToReschedule ? (
              <form onSubmit={handleReschedule}>
                <div className={styles.formGroup}>
                  <label>Selecciona Nueva Fecha</label>
                  <input 
                    type="date" required
                    min={new Date().toISOString().split('T')[0]}
                    value={newDate}
                    onChange={(e) => {
                      setNewDate(e.target.value);
                      setSelectedSlot('');
                    }}
                  />
                </div>

                {newDate && (
                  <div className={styles.formGroup}>
                    <label>Selecciona Horario</label>
                    {isLoadingSlots ? (
                      <div className={styles.loading}>Buscando horarios libres...</div>
                    ) : availableSlots.length === 0 ? (
                      <div className={styles.noSlots}>No hay horarios disponibles para este día. Intenta con otra fecha.</div>
                    ) : (
                      <div className={styles.slotsGrid}>
                        {availableSlots.map(slot => (
                          <button 
                            key={slot} type="button"
                            className={`${styles.slotBtn} ${selectedSlot === slot ? styles.slotBtnActive : ''}`}
                            onClick={() => setSelectedSlot(slot)}
                          >
                            {slot}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                )}

                <div className={styles.btnRow}>
                  <button type="button" className={styles.backBtn} onClick={() => setMode('menu')}>Atrás</button>
                  <button type="submit" className={styles.primaryBtn} disabled={!selectedSlot}>Guardar Nueva Fecha</button>
                </div>
              </form>
            ) : (
              <div className={styles.errorAlert}>
                <h3>⚠️ Acción no permitida</h3>
                <p>
                  Este evento no puede reagendarse debido a que los tiempos establecidos no lo permiten. 
                  (Requiere al menos {event.calendario.limitesReagendar} horas de anticipación).
                </p>
                <button className={styles.backBtn} style={{ marginTop: '1.5rem' }} onClick={() => setMode('menu')}>Volver</button>
              </div>
            )}
          </div>
        )}

        {mode === 'success_cancel' && (
          <div className={styles.card} style={{ textAlign: 'center' }}>
            <div className={styles.successIcon}>🗑️</div>
            <h2>Cita Cancelada</h2>
            <p className={styles.desc}>Tu reserva ha sido cancelada correctamente y el horario ha sido liberado.</p>
            <button className={styles.primaryBtn} style={{ alignSelf: 'center', marginTop: '1.5rem' }} onClick={() => window.location.href = '/'}>Volver al Inicio</button>
          </div>
        )}

        {mode === 'success_reschedule' && (
          <div className={styles.card} style={{ textAlign: 'center' }}>
            <div className={styles.successIcon}>🎉</div>
            <h2>Cita Reagendada</h2>
            <p className={styles.desc}>
              Tu cita ha sido reprogramada con éxito para el <strong>{new Date(event.fecha).toLocaleDateString()}</strong> a las <strong>{event.horaInicio}</strong>.
            </p>
            <button className={styles.primaryBtn} style={{ alignSelf: 'center', marginTop: '1.5rem' }} onClick={() => setMode('menu')}>Ver Cita</button>
          </div>
        )}
      </main>
    </div>
  );
}
