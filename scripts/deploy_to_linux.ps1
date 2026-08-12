# ==============================================================================
# SCRIPT DE DESPLIEGUE A LINUX DESDE ENTORNO LOCAL (WINDOWS POWERSHELL)
# Uso: .\scripts\deploy_to_linux.ps1 "Mensaje del commit"
# ==============================================================================
param (
    [string]$CommitMessage = "Ajustes de disponibilidad, nombres de eventos, menus y captura de invitados"
)

Write-Host "📦 [1/3] Guardando cambios locales en Git..." -ForegroundColor Cyan
git add .
git commit -m "$CommitMessage"

Write-Host "🚀 [2/3] Subiendo cambios al repositorio Git remoto (git push)..." -ForegroundColor Cyan
git push origin main

Write-Host "`n==============================================================================" -ForegroundColor Green
Write-Host "🎉 ¡CAMBIOS SUBIDOS AL REPOSITORIO DE GIT!" -ForegroundColor Green
Write-Host "==============================================================================" -ForegroundColor Green
Write-Host "👉 Para aplicar los cambios en tu Servidor Linux, ejecuta:" -ForegroundColor Yellow
Write-Host "   ssh usuario@tu-servidor-ip 'cd /var/www/calendario && bash scripts/update_remote.sh'" -ForegroundColor White
Write-Host "==============================================================================" -ForegroundColor Green
