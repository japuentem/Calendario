import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const calendarId = searchParams.get('calendarId');

    if (!calendarId) {
      return NextResponse.json({ error: 'Falta calendarId' }, { status: 400 });
    }

    const events = await prisma.evento.findMany({
      where: { calendarioId: calendarId },
      include: {
        participantes: true,
      },
      orderBy: {
        fecha: 'asc',
      },
    });

    return NextResponse.json(events);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const data = await request.json();
    
    const event = await prisma.$transaction(async (tx) => {
      const newEvent = await tx.evento.create({
        data: {
          tema: data.tema,
          fecha: new Date(data.fecha),
          horaInicio: data.horaInicio,
          duracion: parseInt(data.duracion),
          calendarioId: data.calendarioId,
          estado: 'PENDIENTE',
        },
      });

      // Crear el participante principal (Usuario Tercero que agendó)
      await tx.participante.create({
        data: {
          nombre: data.contactoNombre,
          apellido: data.contactoApellido,
          correo: data.contactoCorreo,
          telefono: data.contactoTelefono,
          esCreador: true,
          eventoId: newEvent.id,
        },
      });

      // Invitados adicionales (guardar nombre, apellido y correo)
      if (data.invitados && Array.isArray(data.invitados)) {
        for (const item of data.invitados) {
          if (typeof item === 'object' && item !== null && item.correo) {
            await tx.participante.create({
              data: {
                nombre: item.nombre?.trim() || 'Invitado',
                apellido: item.apellido?.trim() || '',
                correo: item.correo.trim(),
                esCreador: false,
                eventoId: newEvent.id,
              },
            });
          } else if (typeof item === 'string' && item.trim() !== '') {
            await tx.participante.create({
              data: {
                nombre: 'Invitado',
                apellido: '',
                correo: item.trim(),
                esCreador: false,
                eventoId: newEvent.id,
              },
            });
          }
        }
      }

      return newEvent;
    });

    return NextResponse.json(event);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
