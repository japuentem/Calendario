# Guía de Instalación y Configuración del Proyecto

Esta guía detalla los pasos necesarios para descargar, instalar, configurar y ejecutar el **Sistema de Calendarios Multi-Rol** en un entorno de desarrollo local.

---

## 📋 Prerrequisitos

Antes de comenzar, asegúrate de tener instalado en tu sistema:
*   **Node.js** (Versión 18 o superior recomendada).
*   **npm** (Gestor de paquetes de Node, incluido por defecto).
*   **Git** (Para clonar el repositorio).

---

## 🚀 Pasos para la Instalación

### 1. Clonar el Repositorio
Abre tu terminal y clona el proyecto:
```bash
git clone <url-del-repositorio>
cd Calendario
```

### 2. Instalar las Dependencias
Ejecuta el siguiente comando para instalar todos los paquetes requeridos por Next.js, Prisma, y LibSQL (compatible con Windows):
```bash
npm install
```

### 3. Configurar el Archivo de Entorno
Crea un archivo llamado `.env` en la raíz del proyecto (si no existe ya) con la siguiente línea para definir la ubicación de la base de datos local SQLite:
```env
DATABASE_URL="file:dev.db"
```

---

## 🗄️ Inicialización de la Base de Datos (Prisma)

El proyecto utiliza **Prisma ORM** con un adaptador WebAssembly para SQLite, lo cual evita problemas de compilación en entornos Windows. Sigue estos pasos para estructurar y rellenar la base de datos:

### 1. Crear y Empujar el Esquema
Crea el archivo local `dev.db` y sincroniza las tablas de la base de datos con el esquema de Prisma actual:
```bash
npx prisma db push
```

### 2. Generar el Cliente de Prisma
Genera los tipos estáticos autocompletados de TypeScript para interactuar con la base de datos:
```bash
npx prisma generate
```

### 3. Cargar Datos de Prueba (Seed)
Rellena la base de datos con datos de demostración iniciales (organizaciones como *Tech Solutions*, dueños de calendario como *Juan Pérez*, disponibilidades por defecto y tipos de citas):
```bash
npx tsx prisma/seed.ts
```

---

## 💻 Ejecución del Servidor

### Modo de Desarrollo
Para iniciar el servidor de desarrollo local con recarga en caliente (*hot-reload*):
```bash
npm run dev
```
Una vez iniciado, abre tu navegador y entra a:
👉 [http://localhost:3000/](http://localhost:3000/)

### Compilación y Producción
Para compilar la aplicación optimizada para producción y ejecutar el servidor local en modo producción:
```bash
# Compilar el proyecto
npm run build

# Iniciar el servidor compilado
npm start
```

---

## 🛠️ Comandos de Utilidad

*   **Ver el esquema de base de datos:** El archivo de base de datos se describe en [prisma/schema.prisma](file:///d:/proyectos_personales/html/Calendario/prisma/schema.prisma).
*   **Abrir visor de base de datos (Prisma Studio):** Si deseas inspeccionar, editar o borrar registros de forma visual desde el navegador:
    ```bash
    npx prisma studio
    ```
