#!/bin/bash
# ==============================================================================
# SCRIPT 1: CONFIGURACIÓN INICIAL DEL SERVIDOR (Ejecutar como root o con sudo)
# ==============================================================================
set -e

echo "🚀 [1/3] Actualizando repositorios e instalando paquetes básicos, PostgreSQL y Nginx..."
export DEBIAN_FRONTEND=noninteractive
export NEEDRESTART_MODE=a
sudo -E apt update && sudo -E apt upgrade -y -o Dpkg::Options::="--force-confold" -o Dpkg::Options::="--force-confdef"
sudo -E apt install -y git curl build-essential postgresql postgresql-contrib nginx

echo "📦 [2/3] Instalando Node.js 20 LTS y PM2 globalmente..."
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt install -y nodejs
sudo npm install -g pm2

# Configurar Nginx como Proxy Inverso al puerto 3000
sudo tee /etc/nginx/sites-available/calendario << 'EOF'
server {
    listen 80;
    server_name _;

    location / {
        proxy_pass http://127.0.0.1:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
EOF
sudo ln -sf /etc/nginx/sites-available/calendario /etc/nginx/sites-enabled/
sudo rm -f /etc/nginx/sites-enabled/default
sudo systemctl enable nginx
sudo systemctl restart nginx

# Asegurar que el servicio de PostgreSQL esté iniciado y crear usuario/BD por defecto
sudo systemctl enable postgresql
sudo systemctl start postgresql
sudo -u postgres psql -c "CREATE USER postgres WITH PASSWORD 'postgres';" 2>/dev/null || true
sudo -u postgres psql -c "CREATE DATABASE calendario_db OWNER postgres;" 2>/dev/null || true
sudo -u postgres psql -c "GRANT ALL PRIVILEGES ON DATABASE calendario_db TO postgres;" 2>/dev/null || true

echo "👤 [3/3] Creando usuario 'calendario' y configurando directorio /var/www/calendario..."
if ! id "calendario" &>/dev/null; then
    sudo adduser --disabled-password --gecos "" calendario
    echo "✓ Usuario 'calendario' creado."
else
    echo "✓ Usuario 'calendario' ya existe."
fi

sudo mkdir -p /var/www/calendario
sudo chown -R calendario:calendario /var/www/calendario
sudo chmod -R 755 /var/www/calendario

echo "=============================================================================="
echo "✅ PASO 1 COMPLETADO EXITOSAMENTE."
echo "👉 Ahora cambia al usuario 'calendario' ejecutando:"
echo "   sudo su - calendario"
echo "👉 Luego navega a /var/www/calendario y ejecuta el Script 2 (despliegue):"
echo "   cd /var/www/calendario && bash deploy.sh <URL-DE-TU-REPOSITORIO-GIT>"
echo "=============================================================================="
