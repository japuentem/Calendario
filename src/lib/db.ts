import 'dotenv/config';
// Asegura que DATABASE_URL esté definida en process.env para evitar errores de validación del motor de Prisma antes de importar PrismaClient
process.env.DATABASE_URL = process.env.DATABASE_URL || 'file:dev.db';
console.log("[db.ts] DATABASE_URL en process.env:", process.env.DATABASE_URL);

import { PrismaClient } from '../generated/prisma/client';
import { PrismaLibSql } from '@prisma/adapter-libsql';

const globalForPrisma = globalThis as unknown as { prisma: PrismaClient };

// En Prisma v7, se pasa el objeto de configuración de LibSQL directamente a la factoría
const adapter = new PrismaLibSql({
  url: process.env.DATABASE_URL,
});

export const prisma = globalForPrisma.prisma || new PrismaClient({ adapter });

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;
