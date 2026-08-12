#!/bin/bash
# ==============================================================================
# SCRIPT DE ACTUALIZACIÓN RÁPIDA EN SERVIDOR LINUX
# Ruta esperada: /var/www/calendario
# Uso: bash scripts/update_remote.sh
# ==============================================================================
set -e

echo "📂 [1/5] Navegando a la carpeta de la aplicación..."
cd /var/www/calendario || exit 1

echo "📥 [2/5] Descargando últimos cambios desde Git..."
git pull origin main || git pull

echo "📦 [3/5] Actualizando Prisma ORM y Base de Datos..."
npx prisma generate
npx prisma db push

echo "🔨 [4/5] Compilando la aplicación Next.js para producción..."
npm run build

echo "🚀 [5/5] Reiniciando la aplicación en PM2..."
if pm2 list | grep -q "calendario-app"; then
  pm2 reload calendario-app
else
  pm2 start npm --name "calendario-app" -- start
fi

pm2 save

echo "=============================================================================="
echo "🎉 ¡ACTUALIZACIÓN COMPLETADA EXITOSAMENTE EN EL SERVIDOR LINUX!"
echo "📊 Estado del proceso: pm2 status"
echo "📋 Logs en tiempo real: pm2 logs calendario-app"
echo "=============================================================================="
