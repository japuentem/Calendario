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
Crea un archivo llamado `.env` en la raíz del proyecto (si no existe ya) con tu cadena de conexión a PostgreSQL. Por ejemplo:
```env
DATABASE_URL="postgresql://usuario:contraseña@localhost:5432/nombre_basedatos?schema=public"
```

---

## 🗄️ Inicialización de la Base de Datos (Prisma)

El proyecto utiliza **Prisma ORM (v7)** con el adaptador `@prisma/adapter-pg` para una integración nativa de alto rendimiento con PostgreSQL. Sigue estos pasos para estructurar y poblar la base de datos:

### 1. Generar el Cliente de Prisma
Genera los tipos estáticos de TypeScript y compila el motor de consultas para PostgreSQL:
```bash
npx prisma generate
```

### 2. Empujar el Esquema a PostgreSQL
Sincroniza las tablas del esquema en tu base de datos de PostgreSQL:
```bash
npx prisma db push
```

### 3. Cargar Datos de Prueba (Seed)
Rellena la base de datos con datos de demostración iniciales (organizaciones, dueños de calendarios, disponibilidades y tipos de citas):
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
