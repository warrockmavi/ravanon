# RAVANON Admin — Masaustu Kisayolu
$adminDir   = $PSScriptRoot
$projectDir = Split-Path $adminDir -Parent
$iconIco    = Join-Path $projectDir "assets\ravanon.ico"
$desktop    = [Environment]::GetFolderPath("Desktop")
$shortcut   = Join-Path $desktop "RAVANON Admin.lnk"
$targetVbs  = Join-Path $adminDir "Baslat-Admin.vbs"
$wscript    = Join-Path $env:WINDIR "System32\wscript.exe"

if (-not (Test-Path $iconIco)) {
    Write-Host "Uyari: Simge bulunamadi, varsayilan kullanilacak." -ForegroundColor Yellow
    $iconIco = "$wscript,0"
}

$shell = New-Object -ComObject WScript.Shell

# Masaustu kisayolu
$lnk = $shell.CreateShortcut($shortcut)
$lnk.TargetPath = $wscript
$lnk.Arguments = "//B ""$targetVbs"""
$lnk.WorkingDirectory = $adminDir
if (Test-Path (Join-Path $projectDir "assets\ravanon.ico")) {
    $lnk.IconLocation = "$(Join-Path $projectDir 'assets\ravanon.ico'),0"
}
$lnk.Description = "RAVANON Admin Panel - Yonetim"
$lnk.WindowStyle = 7
$lnk.Save()

# Admin klasoru icinde de kisayol
$innerShortcut = Join-Path $adminDir "RAVANON-Admin.lnk"
$lnk2 = $shell.CreateShortcut($innerShortcut)
$lnk2.TargetPath = $wscript
$lnk2.Arguments = "//B ""$targetVbs"""
$lnk2.WorkingDirectory = $adminDir
if (Test-Path (Join-Path $projectDir "assets\ravanon.ico")) {
    $lnk2.IconLocation = "$(Join-Path $projectDir 'assets\ravanon.ico'),0"
}
$lnk2.Description = "RAVANON Admin Baslatici"
$lnk2.Save()

Write-Host "Masaustu kisayolu olusturuldu: $shortcut" -ForegroundColor Green