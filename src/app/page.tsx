import React from "react";
import Link from "next/link";
import styles from "./page.module.css";

export default function Home() {
  return (
    <div className={styles.page}>
      <main className={styles.main}>
        <header className={styles.header}>
          <h1 className={styles.title}>Sistema de Calendarios</h1>
          <p className={styles.subtitle}>
            Plataforma multi-rol para la administración de organizaciones, configuración de agendas y reservas de citas con terceros.
          </p>
        </header>

        <div className={styles.grid}>
          <Link href="/admin" className={styles.card}>
            <div className={`${styles.icon} ${styles.adminIcon}`}>🔑</div>
            <h2>Administrador</h2>
            <p>
              Gestiona organizaciones, da de alta dueños de calendario y configura los asistentes de transición para casos de baja o ausencia.
            </p>
            <div className={styles.action}>
              Ingresar al Panel <span>&rarr;</span>
            </div>
          </Link>

          <Link href="/owner" className={styles.card}>
            <div className={`${styles.icon} ${styles.ownerIcon}`}>📅</div>
            <h2>Dueño de Calendario</h2>
            <p>
              Ajusta tu presentación, define tus horarios de disponibilidad semanal, gestiona fechas especiales y administra los eventos agendados.
            </p>
            <div className={styles.action}>
              Ingresar al Panel <span>&rarr;</span>
            </div>
          </Link>

          <Link href="/book" className={styles.card}>
            <div className={`${styles.icon} ${styles.bookIcon}`}>✨</div>
            <h2>Reserva de Citas</h2>
            <p>
              Acceso público para usuarios terceros. Selecciona un profesional, elige un tipo de evento, encuentra un horario libre y agenda una reunión.
            </p>
            <div className={styles.action}>
              Agendar Cita <span>&rarr;</span>
            </div>
          </Link>
        </div>
      </main>
    </div>
  );
}
