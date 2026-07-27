import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

export async function GET() {
  try {
    const owners = await prisma.dueno.findMany({
      include: {
        organizacion: true,
        calendario: {
          include: {
            tiposEventos: true,
            disponibilidades: true,
            fechasEspeciales: true,
          }
        },
      },
      orderBy: {
        apellido: 'asc',
      },
    });
    return NextResponse.json(owners);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const data = await request.json();
    
    const result = await prisma.$transaction(async (tx) => {
      const owner = await tx.dueno.create({
        data: {
          nombre: data.nombre,
          apellido: data.apellido,
          puesto: data.puesto,
          correo: data.correo,
          tipo: data.tipo,
          estado: data.estado || 'ACTIVO',
          organizacionId: data.organizacionId,
        },
      });

      let calendario = null;
      if (data.tipo === 'DUEÑO_DE_CALENDARIO') {
        calendario = await tx.calendario.create({
          data: {
            nombre: `Calendario de ${data.nombre} ${data.apellido}`,
            duenoId: owner.id,
            permitirInvitados: true,
            limitesAgendar: 30,
            limitesCancelar: 24,
            limitesReagendar: 24,
          },
        });

        // Crear tipos de eventos por defecto
        const defaultTypes = [
          { nombre: "REALIZAR_LLAMADA", duracion: 15, margenSeguridad: 15 },
          { nombre: "RECIBIR_LLAMADA", duracion: 15, margenSeguridad: 15 },
          { nombre: "CITA_REUNION", duracion: 45, margenSeguridad: 15 },
          { nombre: "VIDEOCONFERENCIA", duracion: 30, margenSeguridad: 15 }
        ];

        for (const t of defaultTypes) {
          await tx.tipoEvento.create({
            data: {
              nombre: t.nombre,
              duracion: t.duracion,
              margenSeguridad: t.margenSeguridad,
              calendarioId: calendario.id
            }
          });
        }

        // Disponibilidad por defecto (Lunes a Viernes 9am a 6pm)
        for (let day = 1; day <= 5; day++) {
          await tx.disponibilidad.create({
            data: { diaSemana: day, horaInicio: "09:00", horaFin: "18:00", calendarioId: calendario.id }
          });
        }
      }

      return { owner, calendario };
    });

    return NextResponse.json(result);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
