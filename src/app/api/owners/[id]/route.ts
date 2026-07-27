import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

export async function PUT(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const data = await request.json();

    const updatedOwner = await prisma.dueno.update({
      where: { id },
      data: {
        nombre: data.nombre,
        apellido: data.apellido,
        puesto: data.puesto,
        correo: data.correo,
        estado: data.estado,
        fechaInicioAusencia: data.fechaInicioAusencia ? new Date(data.fechaInicioAusencia) : null,
        fechaFinAusencia: data.fechaFinAusencia ? new Date(data.fechaFinAusencia) : null,
        causaAusencia: data.causaAusencia,
      },
    });

    return NextResponse.json(updatedOwner);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function DELETE(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    
    // Se elimina en cascada según las relaciones onDelete: Cascade de Prisma
    await prisma.dueno.delete({
      where: { id },
    });

    return NextResponse.json({ message: 'Dueño eliminado exitosamente' });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
