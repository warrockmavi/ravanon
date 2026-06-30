@echo off
title RAVANON Admin Panel
cd /d "%~dp0"
echo RAVANON Admin Panel baslatiliyor...
start http://localhost:3000/admin
npm run dev