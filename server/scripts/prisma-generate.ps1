# Stops Node processes that are running from this server folder (tsx/vite hold the Prisma engine DLL on Windows).
$ErrorActionPreference = "Continue"
$serverDir = (Resolve-Path (Join-Path $PSScriptRoot "..")).Path

Write-Host "Prisma generate (server: $serverDir)" -ForegroundColor Cyan

$killed = 0
Get-CimInstance Win32_Process -Filter "Name = 'node.exe'" | ForEach-Object {
  $cl = $_.CommandLine
  if (-not $cl) { return }
  # Only processes whose command line references this repo's server app (not client-only vite).
  if ($cl -notmatch [regex]::Escape($serverDir) -and $cl -notmatch 'gym_dashboard[/\\]server') { return }
  try {
    Write-Host "  Stopping PID $($_.ProcessId) (dev server)" -ForegroundColor DarkYellow
    Stop-Process -Id $_.ProcessId -Force -ErrorAction Stop
    $killed++
  } catch {
    Write-Host "  Could not stop PID $($_.ProcessId): $_" -ForegroundColor DarkRed
  }
}

if ($killed -gt 0) {
  Write-Host "Waiting for file locks to release..." -ForegroundColor DarkGray
  Start-Sleep -Seconds 2
}

Set-Location $serverDir
npx prisma generate
exit $LASTEXITCODE
