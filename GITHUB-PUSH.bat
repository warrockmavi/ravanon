@echo off
title RAVANON GitHub Yukleme
cd /d "%~dp0"
echo.
echo  RAVANON — GitHub'a Yukleme
echo.
where gh >nul 2>&1
if errorlevel 1 (
    echo  GitHub CLI (gh) bulunamadi.
    echo  https://cli.github.com/ adresinden kurun.
    pause
    exit /b 1
)
gh auth status >nul 2>&1
if errorlevel 1 (
    echo  GitHub oturumu yok. Tarayicida giris yapin...
    gh auth login -h github.com -p https -w
)
echo.
echo  Repo olusturuluyor ve yukleniyor...
gh repo create ravanon --public --source=. --remote=origin --push --description "RAVANON - Premium kozmetik e-ticaret + admin panel"
if errorlevel 1 (
    echo.
    echo  Repo zaten varsa manuel push deneniyor...
    git push -u origin main
)
echo.
echo  Tamamlandi: https://github.com/mavioguzhan/ravanon
pause