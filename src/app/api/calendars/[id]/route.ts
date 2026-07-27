import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

export async function PUT(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const data = await request.json();

    const result = await prisma.$transaction(async (tx) => {
      // 1. Actualizar configuración básica
      const updatedCalendar = await tx.calendario.update({
        where: { id },
        data: {
          nombre: data.nombre,
          permitirInvitados: data.permitirInvitados,
          mensajeCierre: data.mensajeCierre,
          imagenPresentacion: data.imagenPresentacion,
          limitesAgendar: parseInt(data.limitesAgendar || 0),
          limitesCancelar: parseInt(data.limitesCancelar || 0),
          limitesReagendar: parseInt(data.limitesReagendar || 0),
        },
      });

      // 2. Actualizar tipos de eventos
      if (data.tiposEventos) {
        await tx.tipoEvento.deleteMany({
          where: { calendarioId: id },
        });

        for (const t of data.tiposEventos) {
          await tx.tipoEvento.create({
            data: {
              nombre: t.nombre,
              duracion: parseInt(t.duracion),
              margenSeguridad: parseInt(t.margenSeguridad),
              calendarioId: id,
            },
          });
        }
      }

      // 3. Actualizar disponibilidades semanales
      if (data.disponibilidades) {
        await tx.disponibilidad.deleteMany({
          where: { calendarioId: id },
        });

        for (const d of data.disponibilidades) {
          await tx.disponibilidad.create({
            data: {
              diaSemana: parseInt(d.diaSemana),
              horaInicio: d.horaInicio,
              horaFin: d.horaFin,
              calendarioId: id,
            },
          });
        }
      }

      // 4. Actualizar fechas especiales
      if (data.fechasEspeciales) {
        await tx.fechaEspecial.deleteMany({
          where: { calendarioId: id },
        });

        for (const f of data.fechasEspeciales) {
          await tx.fechaEspecial.create({
            data: {
              fecha: new Date(f.fecha),
              horaInicio: f.horaInicio,
              horaFin: f.horaFin,
              calendarioId: id,
            },
          });
        }
      }

      return updatedCalendar;
    });

    return NextResponse.json(result);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
