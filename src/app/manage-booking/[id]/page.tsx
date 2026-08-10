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
    mensajeCierre?: string;
    imagenPresentacion?: string;
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

  // Calendar Picker states
  const [currentDate, setCurrentDate] = useState(new Date());

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

  // Route automatically based on URL query parameter action
  useEffect(() => {
    if (event && typeof window !== 'undefined') {
      const queryAction = new URLSearchParams(window.location.search).get('action');
      if (queryAction === 'cancel') {
        setMode('cancel');
      } else if (queryAction === 'reschedule') {
        setMode('reschedule');
      }
    }
  }, [event]);

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

  // Calendar Day Picker helpers
  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDayIndex = new Date(year, month, 1).getDay();
    const totalDays = new Date(year, month + 1, 0).getDate();

    const days = [];
    for (let i = 0; i < firstDayIndex; i++) {
      days.push(null);
    }
    for (let i = 1; i <= totalDays; i++) {
      days.push(new Date(year, month, i));
    }
    return days;
  };

  const monthNames = [
    'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
    'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
  ];

  const handlePrevMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
  };

  const handleNextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
  };

  const handleDateSelect = (dayDate: Date) => {
    const dateStr = dayDate.toISOString().split('T')[0];
    setNewDate(dateStr);
    setSelectedSlot('');
  };

  if (loading) return <div className={styles.container}><div className={styles.msg}>Cargando datos de la cita...</div></div>;
  if (error || !event) return <div className={styles.container}><div className={styles.errorMsg}>⚠️ Error: {error || 'No se pudo cargar la cita.'}</div></div>;

  const creator = event.participantes.find(p => p.esCreador);
  const org = event.calendario.dueno.organizacion;
  const calendarDays = getDaysInMonth(currentDate);

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
              SALIR
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
                <p style={{ fontWeight: 'bold', color: '#f87171' }}>
                  NO TIENE AUTORIDAD PARA CANCELAR ESTE EVENTO PORQUE USTED NO LO AGENDO
                </p>
                <p style={{ fontSize: '0.85rem', color: '#94a3b8', marginTop: '0.5rem' }}>
                  (O los límites de antelación configurados no permiten cancelar este evento en este momento).
                </p>
                <button className={styles.backBtn} style={{ marginTop: '1.5rem' }} onClick={() => setMode('menu')}>Volver</button>
              </div>
            )}
          </div>
        )}


        {mode === 'reschedule' && (
          <div style={{ width: '100%' }}>
            {allowedToReschedule ? (
              <form onSubmit={handleReschedule} className={styles.bookingSplit}>
                {/* Left Panel: Original Details & Metadata (Pantalla 5) */}
                <div className={styles.leftPanel}>
                  <div className={styles.ownerHeader}>
                    {event.calendario.imagenPresentacion ? (
                      <img src={event.calendario.imagenPresentacion} alt={event.calendario.dueno.nombre} className={styles.avatar} />
                    ) : (
                      <div className={styles.avatarPlaceholder}>👤</div>
                    )}
                    <div>
                      <h3>{event.calendario.dueno.nombre} {event.calendario.dueno.apellido}</h3>
                      <span className={styles.puesto}>{event.calendario.dueno.puesto}</span>
                    </div>
                  </div>

                  <div className={styles.formGroup} style={{ marginTop: '1rem' }}>
                    <label>EVENTO SOLICITADO</label>
                    <div className={styles.staticField}>
                      {event.calendario.tiposEventos[0]?.nombre.replace('_', ' ') || 'Reunión'} ({event.duracion} min)
                    </div>
                  </div>

                  <div className={styles.formGroup}>
                    <label>TEMA A TRATAR</label>
                    <div className={styles.staticField} style={{ whiteSpace: 'pre-wrap' }}>
                      {event.tema}
                    </div>
                  </div>

                  <div className={styles.formGroup} style={{ background: 'rgba(239, 68, 68, 0.05)', padding: '1rem', borderRadius: '0.5rem', border: '1px dashed rgba(239, 68, 68, 0.2)' }}>
                    <label style={{ color: '#ef4444' }}>HORA PREVIA</label>
                    <div style={{ fontWeight: '700', fontSize: '1.1rem', color: '#f8fafc', marginTop: '0.25rem' }}>
                      {new Date(event.fecha).toLocaleDateString()} a las {event.horaInicio}
                    </div>
                  </div>

                  <div className={styles.timezoneArea} style={{ marginTop: '0.5rem' }}>
                    🌍 America/Mexico_City (GMT-6)
                  </div>
                </div>

                {/* Right Panel: Calendar Grid & Slot Selector */}
                <div className={styles.rightPanel}>
                  <div className={styles.calendarContainer}>
                    <div className={styles.calendarHeader}>
                      <h3>{monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}</h3>
                      <div className={styles.calendarArrows}>
                        <button type="button" onClick={handlePrevMonth}>&lt;</button>
                        <button type="button" onClick={handleNextMonth}>&gt;</button>
                      </div>
                    </div>

                    <div className={styles.calendarGrid}>
                      <div className={styles.dayOfWeek}>Dom</div>
                      <div className={styles.dayOfWeek}>Lun</div>
                      <div className={styles.dayOfWeek}>Mar</div>
                      <div className={styles.dayOfWeek}>Mier</div>
                      <div className={styles.dayOfWeek}>Jue</div>
                      <div className={styles.dayOfWeek}>Vie</div>
                      <div className={styles.dayOfWeek}>Sáb</div>

                      {calendarDays.map((day, idx) => {
                        if (!day) return <div key={`empty-${idx}`} className={styles.emptyDay}></div>;

                        const dateStr = day.toISOString().split('T')[0];
                        const isSelected = dateStr === newDate;
                        const dayOfWeek = day.getDay();
                        const hasStandardHours = event.calendario.disponibilidades.some(d => d.diaSemana === dayOfWeek);
                        const hasSpecialHours = event.calendario.fechasEspeciales.some(f => new Date(f.fecha).toDateString() === day.toDateString());

                        const isAvailable = (hasStandardHours || hasSpecialHours) && day >= new Date(new Date().setHours(0,0,0,0));

                        return (
                          <button
                            key={dateStr}
                            type="button"
                            disabled={!isAvailable}
                            className={`${styles.dayBtn} ${isAvailable ? styles.availableDay : styles.disabledDay} ${isSelected ? styles.selectedDay : ''}`}
                            onClick={() => handleDateSelect(day)}
                          >
                            {day.getDate()}
                          </button>
                        );
                      })}
                    </div>

                    {newDate && (
                      <div className={styles.slotsArea}>
                        <h4>Horarios disponibles para el {new Date(newDate).toLocaleDateString()}:</h4>
                        {isLoadingSlots ? (
                          <div className={styles.loading}>Buscando horarios libres...</div>
                        ) : availableSlots.length === 0 ? (
                          <div className={styles.noSlots}>No hay horarios disponibles para este día. Intenta con otra fecha.</div>
                        ) : (
                          <div className={styles.slotsGrid} style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(95px, 1fr))', gap: '0.75rem' }}>
                            {availableSlots.map(slot => (
                              <button
                                key={slot} type="button"
                                className={`${styles.slotBtn} ${selectedSlot === slot ? styles.slotBtnActive : ''}`}
                                onClick={() => setSelectedSlot(slot)}
                                style={{
                                  background: 'rgba(15, 23, 42, 0.6)',
                                  border: '1px solid rgba(255, 255, 255, 0.05)',
                                  color: '#cbd5e1',
                                  padding: '0.6rem',
                                  borderRadius: '0.5rem',
                                  fontSize: '0.85rem',
                                  fontWeight: '600',
                                  cursor: 'pointer',
                                  textAlign: 'center'
                                }}
                              >
                                {slot}
                              </button>
                            ))}
                          </div>
                        )}
                      </div>
                    )}
                  </div>

                  <div className={styles.btnRow} style={{ marginTop: '2rem', borderTop: '1px solid rgba(255,255,255,0.05)', paddingTop: '1.5rem' }}>
                    <button type="button" className={styles.backBtn} onClick={() => setMode('menu')}>Atrás</button>
                    <button type="submit" className={styles.primaryBtn} disabled={!selectedSlot} style={{ background: 'linear-gradient(135deg, #0d9488 0%, #2dd4bf 100%)', border: 'none', color: 'white', padding: '0.75rem 2rem', borderRadius: '0.75rem', fontWeight: '600', cursor: 'pointer' }}>
                      Reprogramar
                    </button>
                  </div>
                </div>
              </form>
            ) : (
              <div className={styles.card}>
                <div className={styles.errorAlert}>
                  <h3>⚠️ Acción no permitida</h3>
                  <p style={{ fontWeight: 'bold', color: '#f87171' }}>
                    NO TIENE AUTORIDAD PARA REAGENDAR ESTE EVENTO
                  </p>
                  <p style={{ fontSize: '0.85rem', color: '#94a3b8', marginTop: '0.5rem' }}>
                    (O los límites de antelación configurados no permiten reprogramar este evento en este momento).
                  </p>
                  <button className={styles.backBtn} style={{ marginTop: '1.5rem' }} onClick={() => setMode('menu')}>Volver</button>
                </div>
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
