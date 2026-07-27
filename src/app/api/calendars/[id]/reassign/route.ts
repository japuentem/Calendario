import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

export async function POST(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params; // ID del Calendario
    const { newOwnerId } = await request.json();

    if (!newOwnerId) {
      return NextResponse.json({ error: 'Falta newOwnerId' }, { status: 400 });
    }

    const result = await prisma.$transaction(async (tx) => {
      // 1. Obtener información del nuevo dueño
      const newOwner = await tx.dueno.findUnique({
        where: { id: newOwnerId },
      });

      if (!newOwner) {
        throw new Error('El asistente seleccionado no existe.');
      }

      // 2. Reasignar el calendario al nuevo dueño
      const updatedCalendar = await tx.calendario.update({
        where: { id },
        data: {
          duenoId: newOwnerId,
        },
      });

      // 3. Cambiar el tipo de miembro del nuevo dueño a DUEÑO_DE_CALENDARIO (opcional/deseable según flujo)
      await tx.dueno.update({
        where: { id: newOwnerId },
        data: {
          tipo: 'DUEÑO_DE_CALENDARIO',
        },
      });

      return updatedCalendar;
    });

    return NextResponse.json(result);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
