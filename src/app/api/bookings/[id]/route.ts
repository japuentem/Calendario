import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

export async function GET(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const event = await prisma.evento.findUnique({
      where: { id },
      include: {
        calendario: {
          include: {
            dueno: {
              include: {
                organizacion: true
              }
            },
            tiposEventos: true,
            disponibilidades: true,
            fechasEspeciales: true,
          }
        },
        participantes: true,
      }
    });

    if (!event) {
      return NextResponse.json({ error: 'Cita no encontrada' }, { status: 404 });
    }

    return NextResponse.json(event);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}


export async function PUT(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const data = await request.json();

    const updatedEvent = await prisma.evento.update({
      where: { id },
      data: {
        tema: data.tema,
        fecha: data.fecha ? new Date(data.fecha) : undefined,
        horaInicio: data.horaInicio,
        duracion: data.duracion ? parseInt(data.duracion) : undefined,
        estado: data.estado,
      },
    });

    return NextResponse.json(updatedEvent);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function DELETE(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;

    await prisma.evento.delete({
      where: { id },
    });

    return NextResponse.json({ message: 'Evento eliminado exitosamente' });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
