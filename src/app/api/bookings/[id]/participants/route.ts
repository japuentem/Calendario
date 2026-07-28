import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const { nombre, apellido, correo, telefono } = body;

    if (!nombre || !correo) {
      return NextResponse.json(
        { error: 'El nombre y el correo son obligatorios.' },
        { status: 400 }
      );
    }

    const newParticipant = await prisma.participante.create({
      data: {
        nombre,
        apellido: apellido || '',
        correo,
        telefono: telefono || null,
        esCreador: false,
        eventoId: id,
      },
    });

    return NextResponse.json(newParticipant);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
