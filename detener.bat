@echo off
REM Script para detener la aplicación portátil
echo.
echo Deteniendo servidores Node.js...
echo.

REM Matar todos los procesos de node
taskkill /IM node.exe /F /T

echo.
echo ✓ Servidores detenidos correctamente
echo.
pause
