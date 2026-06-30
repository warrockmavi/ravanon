@echo off
title RAVANON Sunucu Kapat
echo RAVANON sunucusu kapatiliyor...
for /f "tokens=5" %%a in ('netstat -ano ^| findstr ":8765" ^| findstr "LISTENING"') do (
    taskkill /PID %%a /F >nul 2>&1
)
echo Tamamlandi.
timeout /t 2 /nobreak >nul