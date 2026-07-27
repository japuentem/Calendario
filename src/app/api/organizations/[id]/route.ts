import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

export async function PUT(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const data = await request.json();

    const updatedOrg = await prisma.organizacion.update({
      where: { id },
      data: {
        nombre: data.nombre,
        pais: data.pais,
        region: data.region,
        imagenUrl: data.imagenUrl,
        leyenda: data.leyenda,
      },
    });

    return NextResponse.json(updatedOrg);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function DELETE(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    
    // Se elimina en cascada según las relaciones onDelete: Cascade de Prisma
    await prisma.organizacion.delete({
      where: { id },
    });

    return NextResponse.json({ message: 'Organización eliminada exitosamente' });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
