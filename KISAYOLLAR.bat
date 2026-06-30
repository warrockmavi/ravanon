@echo off
title RAVANON Kisayollar
cd /d "%~dp0"
echo.
echo  RAVANON kisayollari guncelleniyor...
echo  (Proje klasoru + masaustu)
echo.
powershell.exe -NoProfile -ExecutionPolicy Bypass -File "%~dp0scripts\create-shortcuts.ps1"
echo.
pause