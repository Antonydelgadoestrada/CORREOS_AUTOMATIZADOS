@echo off
REM Script para iniciar la aplicación portátil en USB
REM Cambiar a la carpeta del backend
cd /d "%~dp0backend"

REM Instalar dependencias si no existen
if not exist "node_modules" (
  echo Instalando dependencias...
  call npm install
)

REM Iniciar servidor Node.js
echo.
echo ========================================
echo Iniciando servidor portátil...
echo ========================================
echo.
echo Aplicación disponible en: http://localhost:5000
echo Presiona Ctrl+C para detener el servidor
echo.

REM Abrir el navegador automáticamente después de 3 segundos
timeout /t 3 /nobreak
start http://localhost:5000

REM Iniciar servidor
call npm start
