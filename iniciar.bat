@echo off
title Sistema de Correos Automatizados

echo ========================================
echo   Sistema de Correos Automatizados
echo ========================================
echo.

REM Si se pasa el argumento --rebuild, forzar recompilacion del frontend
set REBUILD=0
if "%1"=="--rebuild" set REBUILD=1

REM === FRONTEND ===
cd /d "%~dp0frontend"

if not exist "node_modules" (
  echo [1/3] Instalando dependencias del frontend...
  call npm install
  if errorlevel 1 (
    echo ERROR: Fallo la instalacion del frontend.
    pause
    exit /b 1
  )
)

if "%REBUILD%"=="1" (
  echo [2/3] Forzando recompilacion del frontend...
  if exist "build" rmdir /s /q "build"
)

if not exist "build" (
  echo [2/3] Compilando frontend ^(puede tardar 1-2 minutos^)...
  call npm run build
  if errorlevel 1 (
    echo ERROR: Fallo la compilacion del frontend.
    pause
    exit /b 1
  )
  echo Frontend compilado correctamente.
) else (
  echo [2/3] Frontend ya compilado, omitiendo build...
)

REM === BACKEND ===
cd /d "%~dp0backend"

if not exist "node_modules" (
  echo [3/3] Instalando dependencias del backend...
  call npm install
  if errorlevel 1 (
    echo ERROR: Fallo la instalacion del backend.
    pause
    exit /b 1
  )
)

echo.
echo ========================================
echo  Iniciando servidor...
echo  Aplicacion disponible en: http://localhost:5000
echo  Para recompilar el frontend usar: iniciar.bat --rebuild
echo  Presiona Ctrl+C para detener
echo ========================================
echo.

timeout /t 2 /nobreak >nul
start http://localhost:5000

call npm start
