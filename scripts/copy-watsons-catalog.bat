@echo off
set SRC=%USERPROFILE%\Downloads\Documents\Watsons - Haziran_insert_2026.pdf
set DST=%~dp0..\assets\catalogs\watsons-haziran-2026.pdf
if not exist "%SRC%" (
  echo [HATA] Katalog PDF bulunamadi: %SRC%
  pause
  exit /b 1
)
if not exist "%~dp0..\assets\catalogs" mkdir "%~dp0..\assets\catalogs"
copy /Y "%SRC%" "%DST%"
echo [OK] Katalog kopyalandi: %DST%
echo.
echo Sayfa goruntuleri olusturuluyor (ilk seferde ~5 dk)...
cd /d "%~dp0.."
node scripts\render-catalog-pages.js
echo.
echo [OK] Katalog siteye hazir! http://localhost:8765/katalog.html
pause