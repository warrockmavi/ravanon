# RAVANON - Simge + Masaustu Kisayolu Olusturucu
$projectDir = $PSScriptRoot
$assetsDir  = Join-Path $projectDir "assets"
$desktop    = [Environment]::GetFolderPath("Desktop")
$iconPng    = Join-Path $assetsDir "ravanon-icon.png"
$iconIco    = Join-Path $assetsDir "ravanon.ico"
$shortcut   = Join-Path $desktop "RAVANON.lnk"
$wscript    = Join-Path $env:WINDIR "System32\wscript.exe"
$targetVbs  = Join-Path $projectDir "Baslat.vbs"

Add-Type -AssemblyName System.Drawing

function New-RavanonIconBitmap([int]$Size) {
    $bmp = New-Object System.Drawing.Bitmap $Size, $Size
    $g = [System.Drawing.Graphics]::FromImage($bmp)
    $g.SmoothingMode = [System.Drawing.Drawing2D.SmoothingMode]::AntiAlias
    $g.TextRenderingHint = [System.Drawing.Text.TextRenderingHint]::AntiAliasGridFit
    $g.InterpolationMode = [System.Drawing.Drawing2D.InterpolationMode]::HighQualityBicubic

    $navy = [System.Drawing.Color]::FromArgb(255, 10, 10, 18)
    $g.Clear($navy)

    $gold = [System.Drawing.Color]::FromArgb(255, 201, 169, 110)
    $rose = [System.Drawing.Color]::FromArgb(255, 232, 180, 184)
    $border = [Math]::Max(2, [int]($Size * 0.06))
    $pen = New-Object System.Drawing.Pen $gold, $border
    $pad = [int]($Size * 0.08)
    $g.DrawRectangle($pen, $pad, $pad, $Size - $pad * 2 - 1, $Size - $pad * 2 - 1)
    $pen.Dispose()

    $rect = New-Object System.Drawing.Rectangle ([int]($Size * 0.12)), ([int]($Size * 0.12)), ([int]($Size * 0.76)), ([int]($Size * 0.76))
    $brush = New-Object System.Drawing.Drawing2D.LinearGradientBrush(
        $rect,
        [System.Drawing.Color]::FromArgb(60, 201, 169, 110),
        [System.Drawing.Color]::FromArgb(10, 10, 10, 18),
        45
    )
    $g.FillRectangle($brush, $rect)
    $brush.Dispose()

    $fontSize = [int]($Size * 0.52)
    $font = $null
    foreach ($name in @("Georgia", "Times New Roman", "Segoe UI")) {
        try { $font = New-Object System.Drawing.Font($name, $fontSize, [System.Drawing.FontStyle]::Bold); break } catch {}
    }
    if (-not $font) { $font = New-Object System.Drawing.Font("Arial", $fontSize, [System.Drawing.FontStyle]::Bold) }

    $sf = New-Object System.Drawing.StringFormat
    $sf.Alignment = [System.Drawing.StringAlignment]::Center
    $sf.LineAlignment = [System.Drawing.StringAlignment]::Center
    $textRect = New-Object System.Drawing.RectangleF(0, ([float]($Size * 0.02)), $Size, $Size)
    $shadow = New-Object System.Drawing.SolidBrush ([System.Drawing.Color]::FromArgb(80, 0, 0, 0))
    $g.DrawString("R", $font, $shadow, (New-Object System.Drawing.RectangleF(2, 2, $Size, $Size)), $sf)
    $goldBrush = New-Object System.Drawing.SolidBrush $gold
    $g.DrawString("R", $font, $goldBrush, $textRect, $sf)
    $goldBrush.Dispose(); $shadow.Dispose()

    $sparkSize = [int]($Size * 0.11)
    $sparkBrush = New-Object System.Drawing.SolidBrush $rose
    $g.FillEllipse($sparkBrush, [int]($Size * 0.72), [int]($Size * 0.16), $sparkSize, $sparkSize)
    $sparkBrush.Dispose()
    $font.Dispose(); $sf.Dispose(); $g.Dispose()
    return $bmp
}

function Save-MultiSizeIco([System.Drawing.Bitmap]$source256, [string]$icoPath) {
    $sizes = @(16, 32, 48, 64, 128, 256)
    $images = New-Object System.Collections.Generic.List[byte[]]
    foreach ($s in $sizes) {
        $bmp = New-Object System.Drawing.Bitmap $s, $s
        $g = [System.Drawing.Graphics]::FromImage($bmp)
        $g.InterpolationMode = [System.Drawing.Drawing2D.InterpolationMode]::HighQualityBicubic
        $g.SmoothingMode = [System.Drawing.Drawing2D.SmoothingMode]::AntiAlias
        $g.DrawImage($source256, 0, 0, $s, $s)
        $g.Dispose()
        $ms = New-Object System.IO.MemoryStream
        $bmp.Save($ms, [System.Drawing.Imaging.ImageFormat]::Png)
        $images.Add($ms.ToArray())
        $ms.Dispose(); $bmp.Dispose()
    }
    $msOut = New-Object System.IO.MemoryStream
    $bw = New-Object System.IO.BinaryWriter $msOut
    $bw.Write([uint16]0); $bw.Write([uint16]1); $bw.Write([uint16]$images.Count)
    $offset = 6 + (16 * $images.Count); $idx = 0
    foreach ($s in $sizes) {
        $dim = if ($s -eq 256) { 0 } else { $s }
        $bw.Write([byte]$dim); $bw.Write([byte]$dim)
        $bw.Write([byte]0); $bw.Write([byte]0)
        $bw.Write([uint16]1); $bw.Write([uint16]32)
        $bw.Write([uint32]$images[$idx].Length); $bw.Write([uint32]$offset)
        $offset += $images[$idx].Length; $idx++
    }
    foreach ($data in $images) { $bw.Write($data) }
    $bw.Flush()
    [System.IO.File]::WriteAllBytes($icoPath, $msOut.ToArray())
    $bw.Dispose(); $msOut.Dispose()
}

New-Item -ItemType Directory -Force -Path $assetsDir | Out-Null
$bitmap256 = New-RavanonIconBitmap 256
$bitmap256.Save($iconPng, [System.Drawing.Imaging.ImageFormat]::Png)
Save-MultiSizeIco $bitmap256 $iconIco
$bitmap256.Dispose()

Add-Type @"
using System; using System.Runtime.InteropServices;
public class IconCache {
    [DllImport("shell32.dll")] public static extern void SHChangeNotify(int e, int f, IntPtr i1, IntPtr i2);
}
"@
[IconCache]::SHChangeNotify(0x08000000, 0, [IntPtr]::Zero, [IntPtr]::Zero) | Out-Null
Write-Host "RAVANON simgesi hazir: $iconIco" -ForegroundColor Green

# Kisayollar scripts/create-shortcuts.ps1 tarafindan olusturulur
$shortcutScript = Join-Path $projectDir "scripts\create-shortcuts.ps1"
if (Test-Path $shortcutScript) {
    & $shortcutScript
}