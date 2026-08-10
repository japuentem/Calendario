# Guía de Instalación y Configuración del Proyecto (Linux y Desarrollo)

Esta guía detalla los pasos para instalar, configurar y ejecutar el **Sistema de Calendarios Multi-Rol** en un servidor **Linux (instalación limpia de producción)** y en entorno local.

---

## ⚡ Instalación Automatizada con Scripts (Recomendado)

Si prefieres realizar la instalación automatizada en 2 simples pasos:

### 1️⃣ Paso 1 (Como `root` o con `sudo`):
Descarga o ejecuta el script de preparación de servidor que instala Node.js, PM2, crea el usuario sin privilegios `calendario` y prepara el directorio `/var/www/calendario`:

```bash
bash scripts/setup_server.sh
```

### 2️⃣ Paso 2 (Como usuario `calendario`):
Cámbiate al usuario `calendario` e inicia el despliegue automático:

```bash
sudo su - calendario
cd /var/www/calendario
bash scripts/deploy.sh https://github.com/tu-usuario/calendario.git
```

---

## 🐧 Instalación Paso a Paso (Manual)

Sigue estos pasos si deseas ejecutar cada comando manualmente en un servidor Linux recién instalado (Ubuntu, Debian, RHEL o similar).

---

### 1. 📋 Prerrequisitos en el Servidor
* **Usuario:** `root` o cualquier usuario con privilegios `sudo`.
* **Ruta de ejecución:** Cualquier directorio (ej. `/home/usuario` o `/root`).

```bash
# Actualizar repositorios
sudo apt update && sudo apt upgrade -y

# Instalar Git, Curl y utilidades básicas
sudo apt install -y git curl build-essential

# Instalar Node.js (Versión 20 LTS recomendada) vía NodeSource
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt install -y nodejs

# Verificar versiones instaladas
node -v
npm -v
git --version
```

---

### 2. 👤 Creación del Usuario Dedicado de Sistema
* **Usuario:** `root` o usuario con `sudo`.
* **Ruta de ejecución:** Cualquier directorio.

> ⚠️ **REGLA DE SEGURIDAD IMPORTANTE:** Nunca ejecutes `npm`, `npx` ni la aplicación con el usuario `root` o `sudo`. Se debe crear un usuario exclusivo de sistema sin privilegios administrativos para aislar el proceso y evitar problemas de permisos o seguridad.

```bash
# Crear el usuario de sistema 'calendario' con su carpeta de inicio (/home/calendario)
sudo adduser calendario

# (Opcional) Si usas useradd en CentOS/RHEL:
# sudo useradd -m -s /bin/bash calendario
```

---

### 3. 📂 Creación de Directorios y Permisos
* **Usuario:** `root` o usuario con `sudo`.
* **Ruta de ejecución:** Cualquier directorio.

Crea la carpeta donde residirá la aplicación web (`/var/www/calendario`) y asigna la propiedad total al nuevo usuario `calendario`:

```bash
# Crear la estructura de directorio para la aplicación web
sudo mkdir -p /var/www/calendario

# Asignar la propiedad del directorio al usuario 'calendario'
sudo chown -R calendario:calendario /var/www/calendario

# Asignar permisos adecuados de lectura/escritura
sudo chmod -R 755 /var/www/calendario
```

---

### 4. 🚀 Despliegue de la Aplicación como Usuario `calendario`
* **Usuario:** `calendario` (SIN `sudo`).
* **Ruta de ejecución:** `/var/www/calendario`

Cambia al usuario `calendario` recién creado e ingresa al directorio de la aplicación antes de clonar el código o instalar dependencias:

```bash
# 1. Cambiar la sesión al usuario 'calendario' (en cualquier directorio)
sudo su - calendario

# 2. IMPORTANTE: Ingresar al directorio del proyecto
cd /var/www/calendario

# 3. Clonar el repositorio dentro de /var/www/calendario
git clone <url-del-repositorio> .

# 4. Instalar dependencias del proyecto (SIN sudo)
npm install

# 5. Configurar variables de entorno (.env)
cp .env.example .env  # O crea tu archivo .env
```

Edita tu archivo `.env` en la ruta `/var/www/calendario/.env` con la cadena de conexión a PostgreSQL:
```env
DATABASE_URL="postgresql://usuario_db:contraseña_db@localhost:5432/nombre_basedatos?schema=public"
```

---

### 5. 🗄️ Inicialización de la Base de Datos (Prisma ORM)
* **Usuario:** `calendario` (SIN `sudo`).
* **Ruta de ejecución:** `/var/www/calendario`

Asegúrate de estar en el directorio de la aplicación antes de ejecutar las herramientas CLI de Prisma:

```bash
# IMPORTANTE: Confirmar que estás en la raíz del proyecto
cd /var/www/calendario

# 1. Generar los tipos e interfaz de Prisma Client
npx prisma generate

# 2. Sincronizar la estructura de tablas en PostgreSQL
npx prisma db push

# 3. (Opcional) Poblar la base de datos con datos de demostración
npx tsx prisma/seed.ts
```

---

### 6. 💻 Compilación y Ejecución en Producción (PM2)
* **Usuario:** `calendario` (para compilar e iniciar PM2) y `root`/`sudo` (solo para instalar PM2 globalmente).
* **Ruta de ejecución:** `/var/www/calendario`

Para mantener la aplicación ejecutándose en segundo plano y con reinicio automático ante fallos:

```bash
# 1. IMPORTANTE: Asegurarte de estar en la raíz del proyecto
cd /var/www/calendario

# 2. Compilar el proyecto Next.js para producción
npm run build

# 3. Instalar PM2 globalmente (ejecutar este paso único con sudo/root)
exit # salir temporalmente a tu usuario administrador con sudo
sudo npm install -g pm2
sudo su - calendario # regresar al usuario 'calendario'

# 4. Iniciar la aplicación en segundo plano con PM2 desde /var/www/calendario
cd /var/www/calendario
pm2 start npm --name "calendario-app" -- start

# 5. Guardar el estado de PM2
pm2 save
```

La aplicación quedará corriendo por defecto en **`http://localhost:3000`**. Para exponerla públicamente se recomienda configurar **Nginx** como Proxy Inverso apuntando al puerto 3000.

---

## 💻 Instalación Rápida en Entorno Local (Windows / macOS / Linux Local)

Si estás desarrollando localmente en tu máquina personal:

1. **Clonar el proyecto:**
   * **Ruta de ejecución:** Tu carpeta personal de proyectos (ej. `C:\Proyectos` o `~/Proyectos`)
   ```bash
   git clone <url-del-repositorio>
   cd Calendario
   ```
2. **Instalar paquetes:**
   * **Ruta de ejecución:** Carpetas del proyecto (ej. `.../Calendario`)
   ```bash
   cd Calendario
   npm install
   ```
3. **Configurar la base de datos en `.env`:**
   * Archivo: `.../Calendario/.env`
   ```env
   DATABASE_URL="postgresql://postgres:postgres@localhost:5432/calendario_db?schema=public"
   ```
4. **Inicializar base de datos:**
   * **Ruta de ejecución:** `.../Calendario`
   ```bash
   cd Calendario
   npx prisma generate
   npx prisma db push
   npx tsx prisma/seed.ts
   ```
5. **Iniciar en modo desarrollo:**
   * **Ruta de ejecución:** `.../Calendario`
   ```bash
   cd Calendario
   npm run dev
   ```
   Abre tu navegador en: 👉 **[http://localhost:3000/](http://localhost:3000/)**

---

## 🛠️ Comandos de Utilidad

* **Abrir visor visual de base de datos (Prisma Studio):**
  * **Ruta de ejecución:** `/var/www/calendario` (en servidor Linux) o `.../Calendario` (en local)
  ```bash
  npx prisma studio
  ```
  *(Disponible en `http://localhost:5555`)*

* **Ver estado del proceso en Linux (PM2):**
  * **Ruta de ejecución:** Cualquier directorio (como usuario `calendario`)
  ```bash
  pm2 status
  pm2 logs calendario-app
  ```
