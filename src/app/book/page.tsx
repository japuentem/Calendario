'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import styles from './page.module.css';

interface Dueno {
  id: string;
  nombre: string;
  apellido: string;
  puesto: string;
  estado: string;
  calendario?: {
    id: string;
    nombre: string;
    permitirInvitados: boolean;
    mensajeCierre?: string;
    imagenPresentacion?: string;
    limitesAgendar: number;
    tiposEventos: { id: string; nombre: string; duracion: number; margenSeguridad: number }[];
    disponibilidades: { id: string; diaSemana: number; horaInicio: string; horaFin: string }[];
    fechasEspeciales: { id: string; fecha: string; horaInicio: string; horaFin: string }[];
  };
}

interface Organizacion {
  id: string;
  nombre: string;
  imagenUrl?: string;
  leyenda?: string;
  duenos: Dueno[];
}

export default function BookAppointment() {
  const [orgs, setOrgs] = useState<Organizacion[]>([]);
  const [selectedOrgId, setSelectedOrgId] = useState('');
  const [selectedOwnerId, setSelectedOwnerId] = useState('');
  const [selectedEventTypeId, setSelectedEventTypeId] = useState('');
  const [theme, setTheme] = useState('');
  const [attachment, setAttachment] = useState<File | null>(null);
  
  // Calendar states
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDateStr, setSelectedDateStr] = useState('');
  const [selectedSlot, setSelectedSlot] = useState('');
  const [availableSlots, setAvailableSlots] = useState<string[]>([]);
  const [isLoadingSlots, setIsLoadingSlots] = useState(false);

  // Form states
  const [contacto, setContacto] = useState({ nombre: '', apellido: '', correo: '', telefono: '' });
  const [invitados, setInvitados] = useState<string[]>([]);
  const [newInvitadoCorreo, setNewInvitadoCorreo] = useState('');

  // Flow control: 'pantalla1_select_day' | 'pantalla2_select_slot' | 'pantalla3_contact_data' | 'pantalla4_success'
  const [flowMode, setFlowMode] = useState<'pantalla1_select_day' | 'pantalla2_select_slot' | 'pantalla3_contact_data' | 'pantalla4_success'>('pantalla1_select_day');
  const [createdEvent, setCreatedEvent] = useState<any>(null);

  useEffect(() => {
    const fetchOrgs = async () => {
      try {
        const res = await fetch('/api/organizations');
        const data = await res.json();
        setOrgs(Array.isArray(data) ? data : []);
      } catch (e) {
        console.error(e);
      }
    };
    fetchOrgs();
  }, []);

  const activeOrg = orgs.find(o => o.id === selectedOrgId);
  const activeOwner = activeOrg?.duenos.find(o => o.id === selectedOwnerId);
  const activeCalendar = activeOwner?.calendario;
  const activeEventType = activeCalendar?.tiposEventos?.find(t => t.id === selectedEventTypeId);

  // Set default event type to CITA_REUNION or CITA / REUNION if available
  useEffect(() => {
    if (activeCalendar && !selectedEventTypeId) {
      const defaultType = activeCalendar.tiposEventos.find(
        t => t.nombre === 'CITA_REUNION' || t.nombre === 'CITA / REUNION' || t.nombre.includes('CITA')
      );
      if (defaultType) {
        setSelectedEventTypeId(defaultType.id);
      } else if (activeCalendar.tiposEventos.length > 0) {
        setSelectedEventTypeId(activeCalendar.tiposEventos[0].id);
      }
    }
  }, [activeCalendar, selectedEventTypeId]);

  // Compute available slots when date or event type changes
  useEffect(() => {
    if (!selectedDateStr || !selectedOwnerId || !selectedEventTypeId || !activeCalendar || !activeEventType) {
      setAvailableSlots([]);
      return;
    }

    const calculateSlots = async () => {
      setIsLoadingSlots(true);
      try {
        const bookingsRes = await fetch(`/api/bookings?calendarId=${activeCalendar.id}`);
        const bookings = await bookingsRes.json();

        const selDate = new Date(selectedDateStr);
        const dayOfWeek = selDate.getUTCDay();

        const specialOverride = activeCalendar.fechasEspeciales.find(
          f => new Date(f.fecha).toDateString() === selDate.toDateString()
        );

        let activeWindows: { horaInicio: string; horaFin: string }[] = [];

        if (specialOverride) {
          activeWindows = [{ horaInicio: specialOverride.horaInicio, horaFin: specialOverride.horaFin }];
        } else {
          activeWindows = activeCalendar.disponibilidades
            .filter(d => d.diaSemana === dayOfWeek)
            .map(d => ({ horaInicio: d.horaInicio, horaFin: d.horaFin }));
        }

        const slots: string[] = [];
        const duration = activeEventType.duracion;
        const buffer = activeEventType.margenSeguridad;
        const totalBlock = duration + buffer;

        activeWindows.forEach(win => {
          let current = timeToMinutes(win.horaInicio);
          const end = timeToMinutes(win.horaFin);

          while (current + duration <= end) {
            const slotStr = minutesToTime(current);
            const dateStr = selDate.toISOString().split('T')[0];
            
            const isOverlap = bookings.some((b: any) => {
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
  }, [selectedDateStr, selectedOwnerId, selectedEventTypeId]);

  const timeToMinutes = (timeStr: string) => {
    const [h, m] = timeStr.split(':').map(Number);
    return h * 60 + m;
  };

  const minutesToTime = (min: number) => {
    const h = Math.floor(min / 60).toString().padStart(2, '0');
    const m = (min % 60).toString().padStart(2, '0');
    return `${h}:${m}`;
  };

  // Generate Calendar Grid Days
  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDayIndex = new Date(year, month, 1).getDay();
    const totalDays = new Date(year, month + 1, 0).getDate();

    const days = [];
    // Add empty spaces for offset
    for (let i = 0; i < firstDayIndex; i++) {
      days.push(null);
    }
    // Add day numbers
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
    setSelectedDateStr(dateStr);
    setSelectedSlot('');
  };

  const handleSubmitBooking = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!contacto.nombre || !contacto.apellido || !contacto.correo) {
      return alert("Completa los datos obligatorios");
    }

    const isPhoneRequired = activeEventType?.nombre === 'RECIBIR_LLAMADA';
    if (isPhoneRequired && !contacto.telefono) {
      return alert("El teléfono es obligatorio para este tipo de evento");
    }

    try {
      const res = await fetch('/api/bookings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          tema: theme,
          fecha: selectedDateStr,
          horaInicio: selectedSlot,
          duracion: activeEventType?.duracion,
          calendarioId: activeCalendar?.id,
          contactoNombre: contacto.nombre,
          contactoApellido: contacto.apellido,
          contactoCorreo: contacto.correo,
          contactoTelefono: contacto.telefono || null,
          invitados
        }),
      });

      if (res.ok) {
        const data = await res.json();
        setCreatedEvent(data);
        setFlowMode('pantalla4_success');
      }
    } catch (err) {
      console.error(err);
    }
  };

  const calendarDays = getDaysInMonth(currentDate);

  const actorNameText = contacto.nombre 
    ? `${contacto.nombre} ${contacto.apellido}` 
    : 'Invitado Tercero';

  const actorPageText = flowMode === 'pantalla1_select_day' 
    ? 'RESERVA / SELECCIÓN DÍA' 
    : flowMode === 'pantalla2_select_slot'
      ? 'RESERVA / SELECCIÓN HORA'
      : flowMode === 'pantalla3_contact_data' 
        ? 'RESERVA / CONTACTO' 
        : 'RESERVA / CONFIRMACIÓN';

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <div className={styles.headerContent}>
          {/* IDENTIDAD ORGANIZACIÓN */}
          <div className={styles.leftHeader}>
            {activeOrg?.imagenUrl ? (
              <img src={activeOrg.imagenUrl} alt={activeOrg.nombre} className={styles.orgLogo} />
            ) : (
              <div className={styles.orgPlaceholder}>🏢</div>
            )}
            <div className={styles.orgText}>
              <span className={styles.orgName}>{activeOrg?.nombre || 'SISTEMA DE CALENDARIOS'}</span>
              <span className={styles.orgSlogan}>{activeOrg?.leyenda || 'Reserva de citas online'}</span>
            </div>
          </div>

          {/* ACTOR / ROL */}
          <div className={styles.centerHeader}>
            <span className={styles.actorRole}>INVITADO / TERCERO</span>
            <div className={styles.steps}>
              <div className={flowMode === 'pantalla1_select_day' ? styles.stepActive : styles.step}>
                1. Día
              </div>
              <div className={flowMode === 'pantalla2_select_slot' ? styles.stepActive : styles.step}>
                2. Hora
              </div>
              <div className={flowMode === 'pantalla3_contact_data' ? styles.stepActive : styles.step}>
                3. Contacto
              </div>
              <div className={flowMode === 'pantalla4_success' ? styles.stepActive : styles.step}>
                4. Confirmación
              </div>
            </div>
          </div>

          {/* ACTOR DETALLES Y NAVEGACIÓN */}
          <div className={styles.rightHeader}>
            <span className={styles.actorName}>{actorNameText}</span>
            <span className={styles.actorPage}>{actorPageText}</span>
            <Link href="/" className={styles.exitBtn}>
              SALIR
            </Link>
          </div>
        </div>
      </header>

      <main className={styles.main}>
        {(flowMode === 'pantalla1_select_day' || flowMode === 'pantalla2_select_slot') && (
          <div className={styles.bookingSplit}>
            {/* Left Panel: Details Form */}
            <div className={styles.leftPanel}>
              {!selectedOwnerId ? (
                <div className={styles.ownerSelectorCard}>
                  <h2>Elige un Profesional</h2>
                  <div className={styles.formGroup}>
                    <label>Organización</label>
                    <select value={selectedOrgId} onChange={(e) => { setSelectedOrgId(e.target.value); setSelectedOwnerId(''); }}>
                      <option value="">-- Selecciona --</option>
                      {orgs.map(o => <option key={o.id} value={o.id}>{o.nombre}</option>)}
                    </select>
                  </div>
                  {selectedOrgId && (
                    <div className={styles.formGroup}>
                      <label>Profesional</label>
                      <select value={selectedOwnerId} onChange={(e) => setSelectedOwnerId(e.target.value)}>
                        <option value="">-- Selecciona --</option>
                        {activeOrg?.duenos.filter(o => o.estado === 'ACTIVO').map(o => (
                          <option key={o.id} value={o.id}>{o.nombre} {o.apellido}</option>
                        ))}
                      </select>
                    </div>
                  )}
                </div>
              ) : (
                <div className={styles.ownerDetailsCard}>
                  <div className={styles.ownerHeader}>
                    {activeCalendar?.imagenPresentacion ? (
                      <img src={activeCalendar.imagenPresentacion} alt={activeOwner?.nombre} className={styles.avatar} />
                    ) : (
                      <div className={styles.avatarPlaceholder}>👤</div>
                    )}
                    <div>
                      <h3>{activeOwner?.nombre} {activeOwner?.apellido}</h3>
                      <span className={styles.puesto}>{activeOwner?.puesto}</span>
                    </div>
                  </div>

                  <div className={styles.formGroup}>
                    <label>EVENTO SOLICITADO</label>
                    <select value={selectedEventTypeId} onChange={(e) => setSelectedEventTypeId(e.target.value)}>
                      <option value="">-- Selecciona tipo --</option>
                      {activeCalendar?.tiposEventos.map(t => (
                        <option key={t.id} value={t.id}>{t.nombre.replace('_', ' ')} ({t.duracion} min)</option>
                      ))}
                    </select>
                  </div>

                  <div className={styles.formGroup}>
                    <label>TEMA A TRATAR</label>
                    <textarea 
                      rows={3} 
                      placeholder="Indica el motivo..."
                      value={theme}
                      onChange={(e) => setTheme(e.target.value)}
                    />
                  </div>

                  <div className={styles.formGroup}>
                    <label>ELEMENTOS A CONSIDERAR</label>
                    <div className={styles.fileRow}>
                      <input 
                        type="file" 
                        id="file-upload" 
                        className={styles.fileInput} 
                        onChange={(e) => {
                          if (e.target.files && e.target.files.length > 0) {
                            setAttachment(e.target.files[0]);
                          }
                        }}
                      />
                      <label htmlFor="file-upload" className={styles.fileLabel}>
                        {attachment ? attachment.name : 'CARGAR ARCHIVO'}
                      </label>
                    </div>
                  </div>

                  <div className={styles.timezoneArea}>
                    🌍 America/Mexico_City (GMT-6)
                  </div>
                  
                  <button 
                    type="button" 
                    className={styles.changeOwnerBtn}
                    onClick={() => { setSelectedOwnerId(''); setSelectedEventTypeId(''); setSelectedDateStr(''); setSelectedSlot(''); }}
                  >
                    ← Cambiar Profesional
                  </button>
                </div>
              )}
            </div>

            {/* Right Panel: Calendar Picker & Slots */}
            <div className={styles.rightPanel}>
              {selectedOwnerId && activeCalendar ? (
                <div className={styles.calendarContainer}>
                  <div className={styles.calendarHeader}>
                    <h3>{monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}</h3>
                    <div className={styles.calendarArrows}>
                      <button onClick={handlePrevMonth}>&lt;</button>
                      <button onClick={handleNextMonth}>&gt;</button>
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
                      const isSelected = dateStr === selectedDateStr;
                      const dayOfWeek = day.getDay();
                      const hasStandardHours = activeCalendar.disponibilidades.some(d => d.diaSemana === dayOfWeek);
                      const hasSpecialHours = activeCalendar.fechasEspeciales.some(f => new Date(f.fecha).toDateString() === day.toDateString());
                      
                      const isAvailable = (hasStandardHours || hasSpecialHours) && day >= new Date(new Date().setHours(0,0,0,0));

                      return (
                        <button
                          key={dateStr}
                          disabled={!isAvailable}
                          className={`${styles.dayBtn} ${isAvailable ? styles.availableDay : styles.disabledDay} ${isSelected ? styles.selectedDay : ''}`}
                          onClick={() => handleDateSelect(day)}
                        >
                          {day.getDate()}
                        </button>
                      );
                    })}
                  </div>

                  {flowMode === 'pantalla2_select_slot' && selectedDateStr && (
                    <div className={styles.slotsArea}>
                      <h4>Horarios disponibles para el {new Date(selectedDateStr).toLocaleDateString()}:</h4>
                      {isLoadingSlots ? (
                        <div className={styles.loading}>Buscando horarios...</div>
                      ) : availableSlots.length === 0 ? (
                        <div className={styles.noSlots}>No hay horarios disponibles.</div>
                      ) : (
                        <div className={styles.slotsRow}>
                          {availableSlots.map(slot => (
                            <button
                              key={slot}
                              className={`${styles.slotCard} ${selectedSlot === slot ? styles.slotCardActive : ''}`}
                              onClick={() => setSelectedSlot(slot)}
                            >
                              {slot}
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              ) : (
                <div className={styles.calendarPlaceholder}>
                  Selecciona un profesional a la izquierda para ver su calendario.
                </div>
              )}
            </div>
          </div>
        )}

        {flowMode === 'pantalla3_contact_data' && (
          <div className={styles.contactFormCard}>
            <h2>Indícanos quién solicita y a dónde enviar por favor</h2>
            <form onSubmit={handleSubmitBooking}>
              <div className={styles.formGroup}>
                <label>NOMBRE</label>
                <input 
                  type="text" required
                  value={contacto.nombre}
                  onChange={(e) => setContacto({ ...contacto, nombre: e.target.value })}
                />
              </div>

              <div className={styles.formGroup}>
                <label>APELLIDO</label>
                <input 
                  type="text" required
                  value={contacto.apellido}
                  onChange={(e) => setContacto({ ...contacto, apellido: e.target.value })}
                />
              </div>

              <div className={styles.formGroup}>
                <label>CORREO ELECTRÓNICO</label>
                <input 
                  type="email" required
                  value={contacto.correo}
                  onChange={(e) => setContacto({ ...contacto, correo: e.target.value })}
                />
              </div>

              <div className={styles.formGroup}>
                <label>TELÉFONO {activeEventType?.nombre === 'RECIBIR_LLAMADA' ? '*' : '(OPCIONAL)'}</label>
                <input 
                  type="tel" 
                  required={activeEventType?.nombre === 'RECIBIR_LLAMADA'}
                  value={contacto.telefono}
                  onChange={(e) => setContacto({ ...contacto, telefono: e.target.value })}
                />
              </div>

              {/* RG-003: Allow adding guests only if type is VIDEOCONFERENCIA or CITA_REUNION */}
              {(activeEventType?.nombre === 'VIDEOCONFERENCIA' || activeEventType?.nombre === 'CITA_REUNION' || activeEventType?.nombre === 'CITA / REUNION') && (
                <div className={styles.formGroup}>
                  <label>PUEDE AGREGAR INVITADOS A ESTE EVENTO</label>
                  <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.25rem' }}>
                    <input 
                      type="email" 
                      placeholder="ejemplo@correo.com"
                      value={newInvitadoCorreo}
                      onChange={(e) => setNewInvitadoCorreo(e.target.value)}
                      style={{ flex: 1 }}
                    />
                    <button 
                      type="button" 
                      onClick={() => {
                        if (newInvitadoCorreo && !invitados.includes(newInvitadoCorreo)) {
                          setInvitados([...invitados, newInvitadoCorreo]);
                          setNewInvitadoCorreo('');
                        }
                      }}
                      style={{
                        background: '#0d9488',
                        color: 'white',
                        border: 'none',
                        borderRadius: '0.5rem',
                        padding: '0 1rem',
                        cursor: 'pointer',
                        fontWeight: 'bold'
                      }}
                    >
                      +
                    </button>
                  </div>
                  {invitados.length > 0 && (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem', marginTop: '0.5rem' }}>
                      {invitados.map(correo => (
                        <div key={correo} style={{ display: 'flex', justifyContent: 'space-between', background: 'rgba(255,255,255,0.05)', padding: '0.4rem 0.75rem', borderRadius: '0.25rem' }}>
                          <span>{correo}</span>
                          <button 
                            type="button" 
                            onClick={() => setInvitados(invitados.filter(i => i !== correo))}
                            style={{ background: 'none', border: 'none', color: '#ef4444', cursor: 'pointer' }}
                          >
                            ✕
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              <div className={styles.btnRow}>
                <button type="button" className={styles.cancelBtn} onClick={() => setFlowMode('pantalla2_select_slot')}>Atrás</button>
                <button type="submit" className={styles.submitBtn}>Enviar</button>
              </div>
            </form>
          </div>
        )}

        {flowMode === 'pantalla4_success' && createdEvent && (
          <div className={styles.successCard}>
            <div className={styles.successIcon}>✓</div>
            <h2>¡Reserva confirmada!</h2>
            <p className={styles.mensajeCierre}>{activeCalendar?.mensajeCierre || 'Se ha enviado un correo con los detalles.'}</p>
            
            <div className={styles.successDetails}>
              <p><strong>REUNIÓN:</strong> {createdEvent.tema}</p>
              <p><strong>PROFESIONAL:</strong> {activeOwner?.nombre} {activeOwner?.apellido}</p>
              <p><strong>DURACIÓN:</strong> {activeEventType?.duracion} minutos</p>
              <p><strong>FECHA/HORA:</strong> {new Date(selectedDateStr).toLocaleDateString()} a las {selectedSlot}</p>
              <p><strong>TIPO:</strong> {activeEventType?.nombre.replace('_', ' ')}</p>
            </div>

            <button className={styles.primaryBtn} onClick={() => window.location.reload()}>Agendar otra cita</button>
          </div>
        )}
      </main>

      {flowMode === 'pantalla1_select_day' && (
        <footer className={styles.footer}>
          <button 
            className={styles.footerSubmitBtn} 
            disabled={!selectedOwnerId || !selectedEventTypeId || !selectedDateStr}
            onClick={() => setFlowMode('pantalla2_select_slot')}
          >
            INDICANOS CORREO
          </button>
        </footer>
      )}

      {flowMode === 'pantalla2_select_slot' && (
        <footer className={styles.footer}>
          <button 
            className={styles.footerSubmitBtn} 
            disabled={!selectedSlot}
            onClick={() => setFlowMode('pantalla3_contact_data')}
          >
            INDICANOS CORREO
          </button>
        </footer>
      )}
    </div>
  );
}
