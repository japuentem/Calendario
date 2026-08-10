#!/bin/bash
# ==============================================================================
# SCRIPT 2: DESPLIEGUE Y CONFIGURACIÓN (Ejecutar como usuario 'calendario')
# Ruta esperada: /var/www/calendario
# ==============================================================================
set -e

# Verificar que NO se esté ejecutando como root
if [ "$EUID" -eq 0 ]; then
  echo "❌ ERROR: No ejecutes este script como root ni con sudo."
  echo "   Ejecútalo como el usuario 'calendario': sudo su - calendario"
  exit 1
fi

REPO_URL=$1

echo "📂 [1/6] Verificando directorio de trabajo (/var/www/calendario)..."
cd /var/www/calendario

if [ ! -d ".git" ]; then
  if [ -z "$REPO_URL" ]; then
    echo "⚠️ Por favor proporciona la URL del repositorio Git."
    echo "   Uso: bash deploy.sh <URL-DEL-REPOSITORIO>"
    echo "   Ejemplo: bash deploy.sh https://github.com/tu-usuario/calendario.git"
    exit 1
  fi
  echo "📥 Clonando e inicializando código fuente..."
  git init
  git remote add origin "$REPO_URL" || git remote set-url origin "$REPO_URL"
  git fetch origin
  git checkout -f main || git checkout -f master
else
  echo "📥 Actualizando repositorio existente..."
  git pull origin main || git pull
fi

echo "📦 [2/6] Instalando dependencias Node.js..."
npm ci || npm install

echo "⚙️ [3/6] Verificando archivo de entorno (.env)..."
if [ ! -f ".env" ]; then
  if [ -f ".env.example" ]; then
    cp .env.example .env
    echo "⚠️ Se creó el archivo .env desde .env.example."
    echo "   Recuerda configurar DATABASE_URL en /var/www/calendario/.env"
  else
    echo 'DATABASE_URL="postgresql://postgres:postgres@localhost:5432/calendario_db?schema=public"' > .env
    echo "⚠️ Se creó un archivo .env base."
  fi
fi

echo "🗄️ [4/6] Configurando Prisma ORM y Base de Datos..."
npx prisma generate
npx prisma db push

# Poblar datos base/demo si existe el script de seed
if [ -f "prisma/seed.ts" ]; then
  echo "🌱 Poblando base de datos inicial (seed)..."
  npx tsx prisma/seed.ts || true
fi

echo "🔨 [5/6] Compilando la aplicación Next.js..."
npm run build

echo "🚀 [6/6] Iniciando la aplicación en producción con PM2..."
if pm2 list | grep -q "calendario-app"; then
  echo "🔄 Reiniciando aplicación existente en PM2..."
  pm2 reload calendario-app
else
  echo "▶️ Iniciando aplicación en PM2..."
  pm2 start npm --name "calendario-app" -- start
fi

pm2 save

echo "=============================================================================="
echo "🎉 DESPLIEGUE COMPLETADO CON ÉXITO!"
echo "📍 Tu aplicación está corriendo en: http://localhost:3000"
echo "📊 Puedes ver el estado del proceso con: pm2 status"
echo "📋 Puedes ver los logs en tiempo real con: pm2 logs calendario-app"
echo "=============================================================================="
