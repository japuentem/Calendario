import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const pais = searchParams.get('pais');
    const tipo = searchParams.get('tipo');
    const nombre = searchParams.get('nombre');

    const where: any = {};
    if (pais && pais !== 'TODOS') {
      where.pais = pais;
    }
    if (tipo && tipo !== 'TODOS') {
      where.tipoComunicacion = tipo;
    }
    if (nombre) {
      where.nombre = { contains: nombre, mode: 'insensitive' };
    }

    const comunicaciones = await prisma.comunicacion.findMany({
      where,
      orderBy: { codigo: 'asc' },
    });


    return NextResponse.json(comunicaciones);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const data = await request.json();

    if (data.id) {
      // Update existing record
      const updated = await prisma.comunicacion.update({
        where: { id: data.id },
        data: {
          codigo: data.codigo,
          nombre: data.nombre,
          pais: data.pais || 'México',
          tipoComunicacion: data.tipoComunicacion || 'CORREO',
          tipoActivador: data.tipoActivador,
          idActivador: data.idActivador,
          accionActivador: data.accionActivador,
          horasRelativas: data.horasRelativas ? parseInt(data.horasRelativas, 10) : null,
          incluirFinSemana: data.incluirFinSemana !== undefined ? Boolean(data.incluirFinSemana) : true,
          origen: data.origen || 'ORGANIZACION',
          segmento: data.segmento || 'TODOS',
          destinatarios: typeof data.destinatarios === 'string' ? data.destinatarios : JSON.stringify(data.destinatarios || []),
          asuntoHeader: data.asuntoHeader || '',
          mensajeCopy: data.mensajeCopy || '',
          variables: typeof data.variables === 'string' ? data.variables : JSON.stringify(data.variables || []),
          enlacesAcciones: typeof data.enlacesAcciones === 'string' ? data.enlacesAcciones : JSON.stringify(data.enlacesAcciones || []),
          adjuntos: typeof data.adjuntos === 'string' ? data.adjuntos : JSON.stringify(data.adjuntos || []),
          status: data.status || 'ACTIVO',
        },
      });
      return NextResponse.json(updated);
    } else {
      // Create new record
      // Autogenerate code if not provided
      const count = await prisma.comunicacion.count();
      const generatedCode = data.codigo || `COM-${String(count + 1).padStart(3, '0')}`;

      const created = await prisma.comunicacion.create({
        data: {
          codigo: generatedCode,
          nombre: data.nombre,
          pais: data.pais || 'México',
          tipoComunicacion: data.tipoComunicacion || 'CORREO',
          tipoActivador: data.tipoActivador || 'EVENTO',
          idActivador: data.idActivador || 'CALMX-001',
          accionActivador: data.accionActivador || 'SOLICITUD EVENTO USUARIO',
          horasRelativas: data.horasRelativas ? parseInt(data.horasRelativas, 10) : null,
          incluirFinSemana: data.incluirFinSemana !== undefined ? Boolean(data.incluirFinSemana) : true,
          origen: data.origen || 'ORGANIZACION',
          segmento: data.segmento || 'TODOS',
          destinatarios: typeof data.destinatarios === 'string' ? data.destinatarios : JSON.stringify(data.destinatarios || []),
          asuntoHeader: data.asuntoHeader || '',
          mensajeCopy: data.mensajeCopy || '',
          variables: typeof data.variables === 'string' ? data.variables : JSON.stringify(data.variables || []),
          enlacesAcciones: typeof data.enlacesAcciones === 'string' ? data.enlacesAcciones : JSON.stringify(data.enlacesAcciones || []),
          adjuntos: typeof data.adjuntos === 'string' ? data.adjuntos : JSON.stringify(data.adjuntos || []),
          status: data.status || 'ACTIVO',
        },
      });
      return NextResponse.json(created);
    }
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ error: 'ID es requerido' }, { status: 400 });
    }

    const deleted = await prisma.comunicacion.delete({
      where: { id },
    });

    return NextResponse.json(deleted);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
