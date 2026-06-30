# RAVANON — Masaustu + proje klasoru kisayollari (Magaza + Admin)
param(
    [switch]$DesktopOnly,
    [switch]$ProjectOnly
)

$ErrorActionPreference = "Stop"
$projectDir = Split-Path $PSScriptRoot -Parent
$adminDir   = Join-Path $projectDir "admin"
$assetsDir  = Join-Path $projectDir "assets"
$iconIco    = Join-Path $assetsDir "ravanon.ico"
$wscript    = Join-Path $env:WINDIR "System32\wscript.exe"
$desktop    = [Environment]::GetFolderPath("Desktop")

function Ensure-Icon {
    $createIcon = Join-Path $projectDir "create-shortcut.ps1"
    if (-not (Test-Path $iconIco) -and (Test-Path $createIcon)) {
        & $createIcon | Out-Null
    }
    if (Test-Path $iconIco) { return $iconIco }
    return "$wscript,0"
}

function New-RavanonShortcut {
    param(
        [string]$Path,
        [string]$TargetVbs,
        [string]$WorkingDir,
        [string]$Description,
        [string]$Icon
    )
    $dir = Split-Path $Path -Parent
    if ($dir -and -not (Test-Path $dir)) {
        New-Item -ItemType Directory -Force -Path $dir | Out-Null
    }
    $shell = New-Object -ComObject WScript.Shell
    $lnk = $shell.CreateShortcut($Path)
    $lnk.TargetPath = $wscript
    $lnk.Arguments = "//B ""$TargetVbs"""
    $lnk.WorkingDirectory = $WorkingDir
    $lnk.IconLocation = $Icon
    $lnk.Description = $Description
    $lnk.WindowStyle = 7
    $lnk.Save()
    Write-Host "  + $Path" -ForegroundColor Green
}

$icon = Ensure-Icon

$shortcuts = @(
    @{
        Name = "RAVANON"
        ProjectPath = Join-Path $projectDir "RAVANON.lnk"
        DesktopPath = Join-Path $desktop "RAVANON.lnk"
        Vbs = Join-Path $projectDir "Baslat.vbs"
        WorkDir = $projectDir
        Desc = "RAVANON - Premium Kozmetik Magaza"
    },
    @{
        Name = "RAVANON Admin"
        ProjectPath = Join-Path $projectDir "RAVANON Admin.lnk"
        DesktopPath = Join-Path $desktop "RAVANON Admin.lnk"
        Vbs = Join-Path $adminDir "Baslat-Admin.vbs"
        WorkDir = $adminDir
        Desc = "RAVANON Admin Panel - Yonetim"
    }
)

Write-Host ""
Write-Host "  RAVANON kisayollari olusturuluyor..." -ForegroundColor Cyan

foreach ($s in $shortcuts) {
    if (-not $DesktopOnly) {
        New-RavanonShortcut -Path $s.ProjectPath -TargetVbs $s.Vbs -WorkingDir $s.WorkDir -Description $s.Desc -Icon $icon
    }
    if (-not $ProjectOnly) {
        New-RavanonShortcut -Path $s.DesktopPath -TargetVbs $s.Vbs -WorkingDir $s.WorkDir -Description $s.Desc -Icon $icon
    }
}

# Geriye uyumluluk: admin klasorundeki eski isim
$legacyAdmin = Join-Path $adminDir "RAVANON-Admin.lnk"
New-RavanonShortcut -Path $legacyAdmin -TargetVbs (Join-Path $adminDir "Baslat-Admin.vbs") -WorkingDir $adminDir -Description "RAVANON Admin Baslatici" -Icon $icon

Write-Host ""
Write-Host "  Kisayollar hazir!" -ForegroundColor Green
Write-Host "    Proje:  RAVANON.lnk / RAVANON Admin.lnk"
Write-Host "    Masaustu: ayni isimlerle"
Write-Host ""