# Start PayPal Token Auto-Refresh as a Background Job
# This starts the auto-refresh service in the background

$scriptPath = Join-Path $PSScriptRoot "auto-refresh-paypal-token.ps1"

# Check if already running
$existingJob = Get-Job -Name "PayPalTokenRefresh" -ErrorAction SilentlyContinue

if ($existingJob) {
    Write-Host "PayPal token refresh service is already running!" -ForegroundColor Yellow
    Write-Host "Job ID: $($existingJob.Id)" -ForegroundColor Gray
    Write-Host ""
    Write-Host "To stop: Stop-Job -Name 'PayPalTokenRefresh'; Remove-Job -Name 'PayPalTokenRefresh'" -ForegroundColor Gray
}
else {
    # Start as background job
    $job = Start-Job -Name "PayPalTokenRefresh" -FilePath $scriptPath
    
    Write-Host "✓ PayPal token auto-refresh service started!" -ForegroundColor Green
    Write-Host "Job ID: $($job.Id)" -ForegroundColor Gray
    Write-Host ""
    Write-Host "Commands:" -ForegroundColor Cyan
    Write-Host "  View output:  Receive-Job -Name 'PayPalTokenRefresh' -Keep" -ForegroundColor White
    Write-Host "  Stop service: Stop-Job -Name 'PayPalTokenRefresh'; Remove-Job -Name 'PayPalTokenRefresh'" -ForegroundColor White
    Write-Host ""
    Write-Host "The service will automatically refresh your token every 8 hours." -ForegroundColor Gray
}
