# Manual de Mantenimiento y Operación del Sistema (Linux & Producción)

Este documento contiene los procedimientos operativos estándar para administrar, mantener, monitorear y actualizar el **Sistema de Calendarios Multi-Rol** en un entorno de producción Linux.

---

## 🏗️ 1. Arquitectura de Servicios del Sistema

El sistema opera mediante una pila de tres servicios interconectados:

| Servicio | Tecnología | Usuario de Ejecución | Puerto / Protocolo | Ubicación / Archivo |
| :--- | :--- | :--- | :--- | :--- |
| **Servidor Web / Proxy** | Nginx | `root` / `www-data` | `80` (HTTP) | `/etc/nginx/sites-available/calendario` |
| **Aplicación Web** | Next.js + Node.js (PM2) | `calendario` | `3000` (Interno HTTP) | `/var/www/calendario` |
| **Base de Datos** | PostgreSQL 14 (Prisma) | `postgres` | `5433` (Interno TCP) | `calendario_db` |

---

## 🔄 2. Operación y Reinicio de Servicios

### 🟢 2.1 Aplicación Web (Next.js con PM2)
Todas las operaciones de la aplicación deben ejecutarse autenticado como el usuario **`calendario`**:

```bash
# Cambiar al usuario de la aplicación
sudo su - calendario
cd /var/www/calendario

# Ver estado de la aplicación
pm2 status

# Reiniciar aplicación sin tiempo de caída (Zero-Downtime Reload)
pm2 reload calendario-app

# Reiniciar aplicación en caso de falla grave
pm2 restart calendario-app

# Ver logs de error en tiempo real (Salida interactiva con Ctrl+C)
pm2 logs calendario-app

# Ver últimas 100 líneas de logs
pm2 logs calendario-app --lines 100
```

---

### 🌐 2.2 Servidor Web Nginx (Proxy Inverso)
Las operaciones de Nginx deben ejecutarse como **`root`** o con **`sudo`**:

```bash
# Verificar la sintaxis de configuración de Nginx (Sin reiniciar)
sudo nginx -t

# Reiniciar el servicio Nginx
sudo systemctl restart nginx

# Ver el estado del servicio
sudo systemctl status nginx

# Ver logs de errores de Nginx
sudo tail -f /var/log/nginx/error.log
```

---

### 🗄️ 2.3 Base de Datos PostgreSQL
Las operaciones de PostgreSQL deben ejecutarse como **`root`** o con **`sudo`**:

```bash
# Ver el estado del servicio PostgreSQL
sudo systemctl status postgresql

# Reiniciar servicio de PostgreSQL (Cluster 14 Main)
sudo systemctl restart postgresql@14-main || sudo systemctl restart postgresql

# Verificar que PostgreSQL esté escuchando en el puerto 5433
sudo ss -tlpn | grep postgres
```

---

## 📊 3. Consulta y Gestión de Datos en la Base de Datos

### 🔹 Opción A: Conexión remota con pgAdmin (Túnel SSH seguro)
Para conectarte desde **pgAdmin** en tu equipo local hacia la base de datos del servidor:

1. Abre **pgAdmin** en tu computadora local.
2. Crea un nuevo servidor (**Servers > Register > Server...**).
3. **Pestaña General:** Asigna el nombre `Servidor Calendario Linux`.
4. **Pestaña Connection:**
   - **Host:** `127.0.0.1`
   - **Port:** `5433`
   - **Maintenance DB:** `calendario_db`
   - **Username:** `postgres`
   - **Password:** `postgres`
5. **Pestaña SSH Tunnel:**
   - **Use SSH tunneling:** `YES`
   - **Tunnel host:** `74.208.163.44`
   - **Tunnel port:** `22`
   - **Username:** `root` (o tu usuario SSH de la máquina)
   - **Authentication:** `Password` o selecciona tu archivo de clave privada `.pem`.

---

### 🔹 Opción B: Consulta desde Terminal Linux (psql)
Para consultar la base de datos directamente por consola:

```bash
# Acceder a la consola interactiva psql
sudo -u postgres psql -h 127.0.0.1 -p 5433 -U postgres -d calendario_db

# Dentro de la consola psql:
\dt                  # Listar todas las tablas
SELECT * FROM "Organizacion"; # Consultar organizaciones
SELECT * FROM "Dueno";        # Consultar dueños registrados
SELECT * FROM "Evento";       # Consultar eventos agendados
\q                   # Salir de psql
```

---

## 🚀 4. Procedimiento para Aplicar Actualizaciones (Despliegues Futuros)

Cuando existan cambios en el código o en la estructura de la base de datos en el repositorio de GitHub:

```bash
# 1. Cambiar al usuario 'calendario'
sudo su - calendario
cd /var/www/calendario

# 2. Ejecutar el script de despliegue automatizado
bash scripts/deploy.sh
```

El script `deploy.sh` realizará automáticamente:
1. `git pull origin main` para descargar el nuevo código.
2. `npm install` para instalar nuevas dependencias.
3. `npx prisma generate` y `npx prisma db push` para aplicar cambios en la base de datos **sin perder datos existentes**.
4. `npm run build` para compilar los cambios.
5. `pm2 reload calendario-app` para aplicar los cambios sin tiempo de inactividad.

---

## 💾 5. Respaldos y Restauración de Base de Datos (Backups)

### 📤 Crear un respaldo completo (Dump)
```bash
# Ejecutar como root o usuario con permisos
sudo -u postgres pg_dump -h 127.0.0.1 -p 5433 -U postgres calendario_db > /var/backups/calendario_db_$(date +%Y%m%d_%H%M%S).sql
```

### 📥 Restaurar un respaldo
```bash
sudo -u postgres psql -h 127.0.0.1 -p 5433 -U postgres -d calendario_db < /var/backups/calendario_db_backup.sql
```

---

## 🆘 6. Matriz de Solución de Problemas Frecuentes

| Síntoma / Error | Causa Posible | Solución Ejecutable |
| :--- | :--- | :--- |
| **Error 502 Bad Gateway en navegador** | PM2 o Next.js está detenido. | `sudo su - calendario && pm2 restart calendario-app` |
| **ERR_CONNECTION_TIMED_OUT** | Nginx está caído o puerto 80 bloqueado. | `sudo systemctl restart nginx` |
| **Error: P1001 Can't reach DB server** | PostgreSQL o puerto 5433 no escucha. | `sudo systemctl restart postgresql@14-main` |
| **Cambios visuales no se reflejan** | El build de Next.js no se ha regenerado. | `cd /var/www/calendario && npm run build && pm2 reload calendario-app` |
