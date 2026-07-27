import { prisma } from '../src/lib/db';

async function main() {
  // Clean up
  await prisma.participante.deleteMany();
  await prisma.evento.deleteMany();
  await prisma.disponibilidad.deleteMany();
  await prisma.fechaEspecial.deleteMany();
  await prisma.tipoEvento.deleteMany();
  await prisma.calendario.deleteMany();
  await prisma.dueno.deleteMany();
  await prisma.organizacion.deleteMany();

  // Create Organizations
  const org1 = await prisma.organizacion.create({
    data: {
      nombre: "Tech Solutions",
      pais: "México",
      region: "Ciudad de México",
      imagenUrl: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=150&auto=format&fit=crop&q=80",
      leyenda: "Líderes en desarrollo de software y consultoría tecnológica."
    }
  });

  const org2 = await prisma.organizacion.create({
    data: {
      nombre: "Consultora Alfa",
      pais: "Colombia",
      region: "Bogotá",
      imagenUrl: "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=150&auto=format&fit=crop&q=80",
      leyenda: "Asesoría corporativa y legal personalizada."
    }
  });

  // Create Owners
  const dueno1 = await prisma.dueno.create({
    data: {
      nombre: "Juan",
      apellido: "Pérez",
      puesto: "Director de Ingeniería",
      correo: "juan.perez@techsolutions.com",
      tipo: "DUEÑO_DE_CALENDARIO",
      estado: "ACTIVO",
      organizacionId: org1.id
    }
  });

  const dueno2 = await prisma.dueno.create({
    data: {
      nombre: "Ana",
      apellido: "Gómez",
      puesto: "Consultora Principal",
      correo: "ana.gomez@consultoraalfa.com",
      tipo: "DUEÑO_DE_CALENDARIO",
      estado: "ACTIVO",
      organizacionId: org2.id
    }
  });

  // Create Calendars
  const cal1 = await prisma.calendario.create({
    data: {
      nombre: "Calendario de Juan Pérez",
      duenoId: dueno1.id,
      permitirInvitados: true,
      mensajeCierre: "Gracias por agendar. Recibirá un correo con la confirmación de la videollamada.",
      imagenPresentacion: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&auto=format&fit=crop&q=80",
      limitesAgendar: 30, // hasta 30 días en el futuro
      limitesCancelar: 24, // mínimo 24 horas antes
      limitesReagendar: 24
    }
  });

  const cal2 = await prisma.calendario.create({
    data: {
      nombre: "Calendario de Ana Gómez",
      duenoId: dueno2.id,
      permitirInvitados: false,
      mensajeCierre: "Tu cita presencial ha sido programada. Favor de traer su documento de identidad.",
      imagenPresentacion: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80",
      limitesAgendar: 15,
      limitesCancelar: 12,
      limitesReagendar: 12
    }
  });

  // Create Event Types
  const types1 = [
    { nombre: "REALIZAR_LLAMADA", duracion: 15, margenSeguridad: 15 },
    { nombre: "RECIBIR_LLAMADA", duracion: 15, margenSeguridad: 15 },
    { nombre: "CITA_REUNION", duracion: 45, margenSeguridad: 15 },
    { nombre: "VIDEOCONFERENCIA", duracion: 30, margenSeguridad: 15 }
  ];

  for (const t of types1) {
    await prisma.tipoEvento.create({
      data: {
        nombre: t.nombre,
        duracion: t.duracion,
        margenSeguridad: t.margenSeguridad,
        calendarioId: cal1.id
      }
    });
    await prisma.tipoEvento.create({
      data: {
        nombre: t.nombre,
        duracion: t.duracion,
        margenSeguridad: t.margenSeguridad,
        calendarioId: cal2.id
      }
    });
  }

  // Create Weekly Availability (Lunes a Viernes 9:00 - 13:00 y 14:00 - 18:00)
  for (let day = 1; day <= 5; day++) {
    await prisma.disponibilidad.create({
      data: { diaSemana: day, horaInicio: "09:00", horaFin: "13:00", calendarioId: cal1.id }
    });
    await prisma.disponibilidad.create({
      data: { diaSemana: day, horaInicio: "14:00", horaFin: "18:00", calendarioId: cal1.id }
    });
    await prisma.disponibilidad.create({
      data: { diaSemana: day, horaInicio: "09:00", horaFin: "12:00", calendarioId: cal2.id }
    });
    await prisma.disponibilidad.create({
      data: { diaSemana: day, horaInicio: "13:00", horaFin: "17:00", calendarioId: cal2.id }
    });
  }

  console.log("Database seeded successfully!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
