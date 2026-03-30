$ErrorActionPreference = "Stop"

$root = Split-Path -Parent $PSScriptRoot
Set-Location $root

Write-Host "Starting WiseForgeStudio Headquarters..."
Write-Host "Root: $root"
Write-Host "Press Ctrl+C to stop."

node src/server.mjs --host 127.0.0.1 --port 4786
