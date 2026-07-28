# Estructura de Base de Datos Recomendada para PostgreSQL

Este documento describe la arquitectura recomendada para migrar la base de datos actual del **Sistema de Calendarios Multi-Rol** de SQLite a **PostgreSQL** para entornos de producción.

---

## 💎 Ventajas de PostgreSQL sobre SQLite en este Proyecto

Al migrar a PostgreSQL se incorporan las siguientes mejoras arquitectónicas:
1.  **Tipos Enum Nativos:** Para restringir el estado de las citas, tipos de miembros y estado de los dueños directamente a nivel del motor de base de datos.
2.  **Soporte Nativo de Zonas Horarias (`TIMESTAMPTZ`):** Crucial para la lógica multi-zona horaria (Dueños vs. Terceros).
3.  **Índices Compuestos de Alto Rendimiento:** Para acelerar la búsqueda de disponibilidad y slots de citas.
4.  **Generación de UUIDs en la BD:** Utilizando la función nativa `gen_random_uuid()` de PostgreSQL.

---

## 🛠️ Esquema de Prisma Recomendado para PostgreSQL

Modificación sugerida para el archivo [schema.prisma](file:///d:/proyectos_personales/html/Calendario/prisma/schema.prisma) para migrar a PostgreSQL:

```prisma
datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

generator client {
  provider = "prisma-client-js"
  output   = "../src/generated/prisma"
}

// Enums nativos de Postgres
enum TipoMiembro {
  DUENO_DE_CALENDARIO
  ASISTENTE_DE_TRANSICION
}

enum EstadoMiembro {
  ACTIVO
  AUSENTE_TEMPORAL
  EN_TRANSICION
  BAJA
}

enum EstadoEvento {
  PENDIENTE
  EJECUTADO
  CANCELADO
}

model Organizacion {
  id         String   @id @default(dbgenerated("gen_random_uuid()")) @db.Uuid
  nombre     String   @db.VarChar(100)
  pais       String   @db.VarChar(50)
  region     String   @db.VarChar(50)
  imagenUrl  String?  @db.Text
  leyenda    String?  @db.VarChar(255)
  duenos     Dueno[]
  createdAt  DateTime @default(now()) @db.Timestamptz
  updatedAt  DateTime @updatedAt @db.Timestamptz
}

model Dueno {
  id                  String        @id @default(dbgenerated("gen_random_uuid()")) @db.Uuid
  nombre              String        @db.VarChar(50)
  apellido            String        @db.VarChar(50)
  puesto              String        @db.VarChar(100)
  correo              String        @unique @db.VarChar(150)
  tipo                TipoMiembro   @default(DUENO_DE_CALENDARIO)
  estado              EstadoMiembro @default(ACTIVO)
  fechaInicioAusencia DateTime?     @db.Timestamptz
  fechaFinAusencia    DateTime?     @db.Timestamptz
  causaAusencia       String?       @db.VarChar(255)
  organizacionId      String        @db.Uuid
  organizacion        Organizacion  @relation(fields: [organizacionId], references: [id], onDelete: Cascade)
  calendario          Calendario?
  createdAt           DateTime      @default(now()) @db.Timestamptz
  updatedAt           DateTime      @updatedAt @db.Timestamptz
}

model Calendario {
  id                 String             @id @default(dbgenerated("gen_random_uuid()")) @db.Uuid
  nombre             String             @db.VarChar(100)
  duenoId            String             @unique @db.Uuid
  dueno              Dueno              @relation(fields: [duenoId], references: [id], onDelete: Cascade)
  permitirInvitados  Boolean            @default(true)
  mensajeCierre      String?            @db.VarChar(255)
  imagenPresentacion String?            @db.Text
  limitesAgendar     Int                @default(30)
  limitesCancelar    Int                @default(24)
  limitesReagendar   Int                @default(24)
  tiposEventos       TipoEvento[]
  disponibilidades   Disponibilidad[]
  fechasEspeciales   FechaEspecial[]
  eventos            Evento[]
  createdAt          DateTime           @default(now()) @db.Timestamptz
  updatedAt          DateTime           @updatedAt @db.Timestamptz
}

model TipoEvento {
  id               String     @id @default(dbgenerated("gen_random_uuid()")) @db.Uuid
  nombre           String     @db.VarChar(50)
  duracion         Int        
  margenSeguridad  Int        
  calendarioId     String     @db.Uuid
  calendario       Calendario @relation(fields: [calendarioId], references: [id], onDelete: Cascade)
  createdAt        DateTime   @default(now()) @db.Timestamptz
  updatedAt        DateTime   @updatedAt @db.Timestamptz
}

model Disponibilidad {
  id           String     @id @default(dbgenerated("gen_random_uuid()")) @db.Uuid
  diaSemana    Int        
  horaInicio   String     @db.VarChar(5) // Format: "HH:MM"
  horaFin      String     @db.VarChar(5)
  calendarioId String     @db.Uuid
  calendario   Calendario @relation(fields: [calendarioId], references: [id], onDelete: Cascade)
  createdAt    DateTime   @default(now()) @db.Timestamptz
  updatedAt    DateTime   @updatedAt @db.Timestamptz
}

model FechaEspecial {
  id           String     @id @default(dbgenerated("gen_random_uuid()")) @db.Uuid
  fecha        DateTime   @db.Date
  horaInicio   String     @db.VarChar(5)
  horaFin      String     @db.VarChar(5)
  calendarioId String     @db.Uuid
  calendario   Calendario @relation(fields: [calendarioId], references: [id], onDelete: Cascade)
  createdAt    DateTime   @default(now()) @db.Timestamptz
  updatedAt    DateTime   @updatedAt @db.Timestamptz
}

model Evento {
  id                String         @id @default(dbgenerated("gen_random_uuid()")) @db.Uuid
  tema              String         @db.VarChar(150)
  fecha             DateTime       @db.Date
  horaInicio        String         @db.VarChar(5)
  duracion          Int            
  estado            EstadoEvento   @default(PENDIENTE)
  archivoAdjuntoUrl String?        @db.Text
  calendarioId      String         @db.Uuid
  calendario        Calendario     @relation(fields: [calendarioId], references: [id], onDelete: Cascade)
  participantes     Participante[]
  createdAt         DateTime       @default(now()) @db.Timestamptz
  updatedAt         DateTime       @updatedAt @db.Timestamptz

  @@index([calendarioId, fecha]) // Índice compuesto para búsquedas veloces de disponibilidad
}

model Participante {
  id        String   @id @default(dbgenerated("gen_random_uuid()")) @db.Uuid
  nombre    String   @db.VarChar(50)
  apellido  String   @db.VarChar(50)
  correo    String   @db.VarChar(150)
  telefono  String?  @db.VarChar(20)
  esCreador Boolean  @default(false)
  eventoId  String   @db.Uuid
  evento    Evento   @relation(fields: [eventoId], references: [id], onDelete: Cascade)
  createdAt DateTime @default(now()) @db.Timestamptz
  updatedAt DateTime @updatedAt @db.Timestamptz
}
```

---

## 🗄️ Sentencias de Definición de Datos (DDL) en SQL Nativo

Si prefieres estructurar la base de datos directamente en PostgreSQL mediante scripts SQL sin Prisma, esta es la estructura DDL recomendada:

```sql
-- 1. Habilitar la extensión para generación de UUID v4 si no está activa
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 2. Creación de tipos ENUM
CREATE TYPE tipo_miembro AS ENUM ('DUENO_DE_CALENDARIO', 'ASISTENTE_DE_TRANSICION');
CREATE TYPE estado_miembro AS ENUM ('ACTIVO', 'AUSENTE_TEMPORAL', 'EN_TRANSICION', 'BAJA');
CREATE TYPE estado_evento AS ENUM ('PENDIENTE', 'EJECUTADO', 'CANCELADO');

-- 3. Tabla Organizacion
CREATE TABLE "Organizacion" (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    nombre VARCHAR(100) NOT NULL,
    pais VARCHAR(50) NOT NULL,
    region VARCHAR(50) NOT NULL,
    "imagenUrl" TEXT,
    leyenda VARCHAR(255),
    "createdAt" TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 4. Tabla Dueno
CREATE TABLE "Dueno" (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    nombre VARCHAR(50) NOT NULL,
    apellido VARCHAR(50) NOT NULL,
    puesto VARCHAR(100) NOT NULL,
    correo VARCHAR(150) UNIQUE NOT NULL,
    tipo tipo_miembro DEFAULT 'DUENO_DE_CALENDARIO',
    estado estado_miembro DEFAULT 'ACTIVO',
    "fechaInicioAusencia" TIMESTAMP WITH TIME ZONE,
    "fechaFinAusencia" TIMESTAMP WITH TIME ZONE,
    "causaAusencia" VARCHAR(255),
    "organizacionId" UUID NOT NULL REFERENCES "Organizacion"(id) ON DELETE CASCADE,
    "createdAt" TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 5. Tabla Calendario
CREATE TABLE "Calendario" (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    nombre VARCHAR(100) NOT NULL,
    "duenoId" UUID UNIQUE NOT NULL REFERENCES "Dueno"(id) ON DELETE CASCADE,
    "permitirInvitados" BOOLEAN DEFAULT TRUE,
    "mensajeCierre" VARCHAR(255),
    "imagenPresentacion" TEXT,
    "limitesAgendar" INT DEFAULT 30,
    "limitesCancelar" INT DEFAULT 24,
    "limitesReagendar" INT DEFAULT 24,
    "createdAt" TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 6. Tabla TipoEvento
CREATE TABLE "TipoEvento" (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    nombre VARCHAR(50) NOT NULL,
    duracion INT NOT NULL,
    "margenSeguridad" INT NOT NULL,
    "calendarioId" UUID NOT NULL REFERENCES "Calendario"(id) ON DELETE CASCADE,
    "createdAt" TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 7. Tabla Disponibilidad
CREATE TABLE "Disponibilidad" (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    "diaSemana" INT NOT NULL CHECK ("diaSemana" BETWEEN 0 AND 6),
    "horaInicio" VARCHAR(5) NOT NULL,
    "horaFin" VARCHAR(5) NOT NULL,
    "calendarioId" UUID NOT NULL REFERENCES "Calendario"(id) ON DELETE CASCADE,
    "createdAt" TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 8. Tabla FechaEspecial
CREATE TABLE "FechaEspecial" (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    fecha DATE NOT NULL,
    "horaInicio" VARCHAR(5) NOT NULL,
    "horaFin" VARCHAR(5) NOT NULL,
    "calendarioId" UUID NOT NULL REFERENCES "Calendario"(id) ON DELETE CASCADE,
    "createdAt" TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 9. Tabla Evento
CREATE TABLE "Evento" (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    tema VARCHAR(150) NOT NULL,
    fecha DATE NOT NULL,
    "horaInicio" VARCHAR(5) NOT NULL,
    duracion INT NOT NULL,
    estado estado_evento DEFAULT 'PENDIENTE',
    "archivoAdjuntoUrl" TEXT,
    "calendarioId" UUID NOT NULL REFERENCES "Calendario"(id) ON DELETE CASCADE,
    "createdAt" TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 10. Tabla Participante
CREATE TABLE "Participante" (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    nombre VARCHAR(50) NOT NULL,
    apellido VARCHAR(50) NOT NULL,
    correo VARCHAR(150) NOT NULL,
    telefono VARCHAR(20),
    "esCreador" BOOLEAN DEFAULT FALSE,
    "eventoId" UUID NOT NULL REFERENCES "Evento"(id) ON DELETE CASCADE,
    "createdAt" TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 11. Creación de Índices para optimizar búsquedas de disponibilidad
CREATE INDEX idx_eventos_busqueda ON "Evento"("calendarioId", "fecha");
CREATE INDEX idx_disponibilidad_dia ON "Disponibilidad"("calendarioId", "diaSemana");
CREATE INDEX idx_fechas_especiales_dia ON "FechaEspecial"("calendarioId", "fecha");
```
