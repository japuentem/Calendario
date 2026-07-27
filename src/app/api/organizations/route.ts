import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

export async function GET() {
  try {
    const orgs = await prisma.organizacion.findMany({
      include: {
        duenos: {
          include: {
            calendario: {
              include: {
                tiposEventos: true,
                disponibilidades: true,
                fechasEspeciales: true,
              }
            },
          }
        },
      },
      orderBy: {
        nombre: 'asc',
      },
    });
    return NextResponse.json(orgs);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const data = await request.json();
    const newOrg = await prisma.organizacion.create({
      data: {
        nombre: data.nombre,
        pais: data.pais,
        region: data.region,
        imagenUrl: data.imagenUrl,
        leyenda: data.leyenda,
      },
    });
    return NextResponse.json(newOrg);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
