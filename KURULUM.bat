@echo off
title RAVANON Kurulum
cd /d "%~dp0"
echo.
echo  RAVANON — Ilk Kurulum
echo  (Admin bagimliliklari + masaustu simgesi)
echo.
powershell.exe -NoProfile -ExecutionPolicy Bypass -File "%~dp0scripts\setup-windows.ps1"
if errorlevel 1 (
    echo.
    echo  Kurulum BASARISIZ. Node.js v20+ kurulu oldugundan emin olun.
    echo  https://nodejs.org/
    pause
    exit /b 1
)
echo.
echo  Simdi Baslat-Hepsi.vbs ile magaza ve admini acabilirsiniz.
pause