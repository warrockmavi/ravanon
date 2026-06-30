# RAVANON Windows Kurulum — clone/indirme sonrası bir kez çalıştırın
$ErrorActionPreference = "Stop"
$projectDir = Split-Path $PSScriptRoot -Parent

Write-Host ""
Write-Host "  RAVANON — Windows Kurulum" -ForegroundColor Cyan
Write-Host "  Proje: $projectDir"
Write-Host ""

# Node.js kontrolü
$node = Get-Command node -ErrorAction SilentlyContinue
if (-not $node) {
    Write-Host "  HATA: Node.js bulunamadi!" -ForegroundColor Red
    Write-Host "  https://nodejs.org/ adresinden LTS surumu indirin (v20+)." -ForegroundColor Yellow
    exit 1
}
$nodeVer = node -v
Write-Host "  Node.js: $nodeVer" -ForegroundColor Green

# Admin bagimliliklari
$adminDir = Join-Path $projectDir "admin"
Write-Host ""
Write-Host "  Admin panel bagimliliklari yukleniyor..." -ForegroundColor Cyan
Push-Location $adminDir
try {
    & npm.cmd install --no-fund --no-audit
    if ($LASTEXITCODE -ne 0) { throw "npm install basarisiz (kod: $LASTEXITCODE)" }
    Write-Host "  npm install tamamlandi." -ForegroundColor Green
} finally {
    Pop-Location
}

# Masaustu kisayolu
Write-Host ""
& (Join-Path $projectDir "create-shortcut.ps1")

Write-Host ""
Write-Host "  Kurulum tamamlandi!" -ForegroundColor Green
Write-Host ""
Write-Host "  Baslatma secenekleri:" -ForegroundColor White
Write-Host "    Baslat.vbs          -> Sadece magaza  (localhost:8765)"
Write-Host "    admin\Baslat-Admin.vbs -> Sadece admin (localhost:3000/admin)"
Write-Host "    Baslat-Hepsi.vbs    -> Ikisi birden"
Write-Host ""
Write-Host "  Admin giris: admin@ravanon.com / Ravanon2026!"
Write-Host ""