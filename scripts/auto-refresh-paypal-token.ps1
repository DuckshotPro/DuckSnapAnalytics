# PayPal Token Auto-Refresh Script
# This script runs in the background and automatically refreshes your PayPal token
# and updates the Claude config file before it expires

param(
    [int]$RefreshIntervalHours = 8  # Refresh every 8 hours (before 9 hour expiration)
)

$clientId = "AQuPla_v-nyUoP7R9DASWT3GQgTOn-vSb40MyB_4G2llS0fFMhH199cU1pCHUFZZltAuX70odwwPoRQR"
$clientSecret = "EG0EXtyBr0uqjT6g_OmYTgS9vTp05rt0_BmdV37r4QzFrMg7PjtLp9QekUXNH7myH921MR31LDrRsF_E"
$configPath = "$env:APPDATA\Claude\claude_desktop_config.json"

function Get-PayPalToken {
    $auth = "${clientId}:${clientSecret}"
    $bytes = [System.Text.Encoding]::UTF8.GetBytes($auth)
    $base64 = [Convert]::ToBase64String($bytes)
    
    try {
        $response = Invoke-RestMethod -Uri "https://api-m.sandbox.paypal.com/v1/oauth2/token" `
            -Method Post `
            -Headers @{
            "Authorization" = "Basic $base64"
            "Content-Type"  = "application/x-www-form-urlencoded"
        } `
            -Body "grant_type=client_credentials"
        
        return $response.access_token
    }
    catch {
        Write-Error "Failed to get token: $_"
        return $null
    }
}

function Update-ClaudeConfig {
    param([string]$Token)
    
    if (-not (Test-Path $configPath)) {
        Write-Error "Claude config not found at $configPath"
        return $false
    }
    
    try {
        $config = Get-Content $configPath -Raw | ConvertFrom-Json
        
        # Update the PayPal MCP server token
        if ($config.mcpServers.'paypal-mcp-server') {
            # Find and replace the Authorization header
            for ($i = 0; $i -lt $config.mcpServers.'paypal-mcp-server'.args.Count; $i++) {
                if ($config.mcpServers.'paypal-mcp-server'.args[$i] -like "Authorization: Bearer *") {
                    $config.mcpServers.'paypal-mcp-server'.args[$i] = "Authorization: Bearer $Token"
                    break
                }
            }
            
            # Save updated config
            $config | ConvertTo-Json -Depth 10 | Set-Content $configPath
            Write-Host "[$(Get-Date -Format 'HH:mm:ss')] ✓ Token refreshed successfully" -ForegroundColor Green
            return $true
        }
        else {
            Write-Error "PayPal MCP server not found in config"
            return $false
        }
    }
    catch {
        Write-Error "Failed to update config: $_"
        return $false
    }
}

# Main loop
Write-Host "PayPal Token Auto-Refresh Service Started" -ForegroundColor Cyan
Write-Host "Refresh interval: $RefreshIntervalHours hours" -ForegroundColor Gray
Write-Host "Press Ctrl+C to stop" -ForegroundColor Yellow
Write-Host ""

while ($true) {
    Write-Host "[$(Get-Date -Format 'HH:mm:ss')] Getting new token..." -ForegroundColor Cyan
    
    $token = Get-PayPalToken
    
    if ($token) {
        $success = Update-ClaudeConfig -Token $token
        
        if ($success) {
            $nextRefresh = (Get-Date).AddHours($RefreshIntervalHours)
            Write-Host "[$(Get-Date -Format 'HH:mm:ss')] Next refresh at: $($nextRefresh.ToString('HH:mm:ss'))" -ForegroundColor Gray
        }
    }
    else {
        Write-Host "[$(Get-Date -Format 'HH:mm:ss')] ⚠ Failed to get token, will retry..." -ForegroundColor Yellow
    }
    
    # Wait before next refresh
    Start-Sleep -Seconds ($RefreshIntervalHours * 3600)
}
