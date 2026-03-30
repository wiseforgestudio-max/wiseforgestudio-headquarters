$ErrorActionPreference = "Stop"

$root = Split-Path -Parent $PSScriptRoot
Set-Location $root

Write-Host "WiseForgeStudio Headquarters Doctor"
Write-Host "Root: $root"

$nodeVersion = node -v
Write-Host "Node: $nodeVersion"

$npmVersion = npm -v
Write-Host "npm: $npmVersion"

$apiProcess = Start-Process node -ArgumentList "src/server.mjs" -WorkingDirectory $root -PassThru -WindowStyle Hidden
Start-Sleep -Seconds 2

try {
  $runtime = Invoke-RestMethod "http://127.0.0.1:4786/health"
  Write-Host "Health: OK"
  Write-Host "Port: $($runtime.port)"
  Write-Host "URL: $($runtime.url)"

  $state = Invoke-RestMethod "http://127.0.0.1:$($runtime.port)/api/state"
  Write-Host "Phase: $($state.meta.phase)"
  Write-Host "Projects: $($state.derived.executiveSummary.activeProjects)"
  Write-Host "Approvals: $($state.derived.executiveSummary.pendingApprovals)"
}
catch {
  Write-Host "Doctor failed: $($_.Exception.Message)"
  exit 1
}
finally {
  if ($apiProcess -and !$apiProcess.HasExited) {
    Stop-Process -Id $apiProcess.Id -Force
  }
}
