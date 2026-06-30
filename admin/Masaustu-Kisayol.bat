@echo off
title RAVANON Admin - Masaustu Kisayolu
cd /d "%~dp0"
powershell.exe -NoProfile -ExecutionPolicy Bypass -File "%~dp0create-shortcut.ps1"
pause