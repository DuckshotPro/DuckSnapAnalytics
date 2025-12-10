# PayPal Access Token Generator
# This script generates an OAuth access token for PayPal API access

# Your PayPal Sandbox credentials
$clientId = "AQuPla_v-nyUoP7R9DASWT3GQgTOn-vSb40MyB_4G2llS0fFMhH199cU1pCHUFZZltAuX70odwwPoRQR"
$clientSecret = "EG0EXtyBr0uqjT6g_OmYTgS9vTp05rt0_BmdV37r4QzFrMg7PjtLp9QekUXNH7myH921MR31LDrRsF_E"

# Combine credentials
$auth = "${clientId}:${clientSecret}"

# Convert to Base64
$bytes = [System.Text.Encoding]::UTF8.GetBytes($auth)
$base64 = [Convert]::ToBase64String($bytes)

Write-Host "Getting PayPal access token..." -ForegroundColor Cyan

try {
    # Request access token from PayPal Sandbox
    $response = Invoke-RestMethod -Uri "https://api-m.sandbox.paypal.com/v1/oauth2/token" `
        -Method Post `
        -Headers @{
            "Authorization" = "Basic $base64"
            "Content-Type" = "application/x-www-form-urlencoded"
        } `
        -Body "grant_type=client_credentials"

    # Display the token
    Write-Host "`nAccess Token Generated Successfully!" -ForegroundColor Green
    Write-Host "=" * 80 -ForegroundColor Yellow
    Write-Host $response.access_token -ForegroundColor White
    Write-Host "=" * 80 -ForegroundColor Yellow
    
    Write-Host "`nToken Type: $($response.token_type)" -ForegroundColor Gray
    Write-Host "Expires in: $($response.expires_in) seconds ($([math]::Round($response.expires_in/3600, 2)) hours)" -ForegroundColor Gray
    
    # Copy to clipboard if available
    try {
        Set-Clipboard -Value $response.access_token
        Write-Host "`n✓ Token copied to clipboard!" -ForegroundColor Green
    } catch {
        Write-Host "`nNote: Could not copy to clipboard automatically." -ForegroundColor Yellow
    }
    
    Write-Host "`nUse this token in your MCP client config:" -ForegroundColor Cyan
    Write-Host "Authorization: Bearer $($response.access_token)" -ForegroundColor White

} catch {
    Write-Host "`nError getting access token:" -ForegroundColor Red
    Write-Host $_.Exception.Message -ForegroundColor Red
}
