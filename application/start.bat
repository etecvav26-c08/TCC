@echo off
echo Iniciando Sapientia...
echo.

echo Iniciando backend...
start "Backend Sapientia" cmd /k "cd /d %~dp0backend && node index.js"

timeout /t 2 /nobreak >nul

echo Iniciando frontend...
start "Frontend Sapientia" cmd /k "cd /d %~dp0frontend && npm run dev"

timeout /t 3 /nobreak >nul

echo.
echo ================================
echo  Sistema rodando!
echo  Acesse: http://localhost:5173
echo  Moodle: http://localhost
echo ================================
echo.
pause
