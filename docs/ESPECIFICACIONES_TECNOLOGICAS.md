# Especificaciones Tecnológicas del Proyecto

Este documento detalla la pila de tecnologías (Tech Stack) seleccionada para el desarrollo del **Sistema de Calendarios Multi-Rol**, su propósito, configuraciones clave y justificación de arquitectura.

---

## 🛠️ Pila Tecnológica Core

### 1. Framework: Next.js (versión 15/16)
*   **Paradigma:** App Router con soporte completo para React Server Components (RSC) y Client Components.
*   **Lenguaje:** TypeScript (Tipado estricto e interfaces sólidas para modelos de datos).
*   **Justificación:** Proporciona un renderizado híbrido de alto rendimiento, optimización SEO automática (Meta tags, Headers semánticos), ruteo simplificado basado en archivos, y una arquitectura escalable para un crecimiento futuro de la plataforma.

### 2. Base de Datos: SQLite (Local)
*   **Motor:** Base de datos relacional ligera embebida en archivo local `dev.db`.
*   **Justificación:** Ideal para el desarrollo rápido local y entornos de prueba sin necesidad de administrar servidores de base de datos complejos (como PostgreSQL o MySQL) en fases tempranas.

### 3. ORM y Gestión de Datos: Prisma ORM (versión 7.x)
*   **Generador:** `prisma-client-js` con salida tipada hacia `src/generated/prisma`.
*   **Justificación:** Permite definir el modelado de datos de forma declarativa ([schema.prisma](file:///d:/proyectos_personales/html/Calendario/prisma/schema.prisma)), realizar migraciones de esquema automáticas, y autogenerar un cliente de base de datos con tipados estáticos robustos en TypeScript.

### 4. Adaptador de Base de Datos: LibSQL (`@prisma/adapter-libsql`)
*   **Componentes:** `@prisma/adapter-libsql` + `@libsql/client`.
*   **Justificación:** **Crucial para desarrollo en Windows.** El driver tradicional de SQLite para Node.js (`better-sqlite3`) requiere compilación nativa en C++ y herramientas de compilación de Visual Studio instaladas en la máquina local. LibSQL soluciona esto proveyendo un motor SQLite compatible compilado en WebAssembly/Nativo portable que funciona sin configuraciones de C++.

### 5. Estilos: Vanilla CSS Modules
*   **Archivos:** Archivos modulares `*.module.css` mapeados directamente en los componentes de Next.js.
*   **Justificación:** Ofrece encapsulación de estilos nativa (evita colisiones de nombres de clases), total flexibilidad para implementar gradientes complejos, micro-animaciones premium de alto desempeño, y efectos visuales de cristal (*glassmorphism*) sin depender de frameworks utilitarios de terceros.

---

## ⚙️ Configuración y Variables de Entorno

La conexión a la base de datos se autogestiona en tiempo de ejecución en [src/lib/db.ts](file:///d:/proyectos_personales/html/Calendario/src/lib/db.ts) garantizando compatibilidad con el motor de consulta WASM de Prisma v7.

*   **Archivo `.env`:**
    ```env
    DATABASE_URL="file:dev.db"
    ```
*   **Archivo `prisma.config.ts` (Prisma v7):**
    Configura el Datasource dinámico para el CLI de Prisma:
    ```typescript
    import { defineConfig } from 'prisma'
    export default defineConfig({
      datasource: {
        url: process.env.DATABASE_URL
      }
    })
    ```

---

## 🚀 Comandos y Tareas del Proyecto

*   **Inicialización y Migración:**
    ```bash
    npx prisma db push
    ```
    *(Aplica los cambios del esquema directamente sobre el archivo `dev.db`)*
*   **Generación de Tipos de Prisma Client:**
    ```bash
    npx prisma generate
    ```
*   **Carga de Datos Semilla (Mock Data):**
    ```bash
    npx tsx prisma/seed.ts
    ```
*   **Ejecución del Servidor de Desarrollo:**
    ```bash
    npm run dev
    ```
*   **Compilación de Producción:**
    ```bash
    npm run build
    ```
