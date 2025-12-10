# Create PayPal Subscription Plans
# This script creates the monthly and yearly subscription plans in PayPal

$clientId = "AQuPla_v-nyUoP7R9DASWT3GQgTOn-vSb40MyB_4G2llS0fFMhH199cU1pCHUFZZltAuX70odwwPoRQR"
$clientSecret = "EG0EXtyBr0uqjT6g_OmYTgS9vTp05rt0_BmdV37r4QzFrMg7PjtLp9QekUXNH7myH921MR31LDrRsF_E"
$baseUrl = "https://api-m.sandbox.paypal.com"

# Get access token
function Get-PayPalToken {
    $auth = "${clientId}:${clientSecret}"
    $bytes = [System.Text.Encoding]::UTF8.GetBytes($auth)
    $base64 = [Convert]::ToBase64String($bytes)
    
    $response = Invoke-RestMethod -Uri "$baseUrl/v1/oauth2/token" `
        -Method Post `
        -Headers @{
        "Authorization" = "Basic $base64"
        "Content-Type"  = "application/x-www-form-urlencoded"
    } `
        -Body "grant_type=client_credentials"
    
    return $response.access_token
}

# Create a product first (required for subscription plans)
function Create-PayPalProduct {
    param([string]$Token)
    
    $headers = @{
        "Authorization" = "Bearer $Token"
        "Content-Type"  = "application/json"
    }
    
    $product = @{
        name        = "DuckShot Analytics Premium"
        description = "Premium subscription for DuckShot Analytics with AI-powered insights and advanced features"
        type        = "SERVICE"
        category    = "SOFTWARE"
        image_url   = "https://duckshotanalytics.com/logo.png"
        home_url    = "https://duckshotanalytics.com"
    } | ConvertTo-Json
    
    try {
        $response = Invoke-RestMethod -Uri "$baseUrl/v1/catalogs/products" `
            -Method Post `
            -Headers $headers `
            -Body $product
        
        Write-Host "✓ Product created: $($response.id)" -ForegroundColor Green
        return $response.id
    }
    catch {
        Write-Host "Error creating product: $($_.Exception.Message)" -ForegroundColor Red
        return $null
    }
}

# Create subscription plan
function Create-SubscriptionPlan {
    param(
        [string]$Token,
        [string]$ProductId,
        [string]$Name,
        [string]$Description,
        [decimal]$Price,
        [string]$IntervalUnit,
        [int]$IntervalCount
    )
    
    $headers = @{
        "Authorization" = "Bearer $Token"
        "Content-Type"  = "application/json"
        "Prefer"        = "return=representation"
    }
    
    $plan = @{
        product_id          = $ProductId
        name                = $Name
        description         = $Description
        status              = "ACTIVE"
        billing_cycles      = @(
            @{
                frequency      = @{
                    interval_unit  = $IntervalUnit
                    interval_count = $IntervalCount
                }
                tenure_type    = "REGULAR"
                sequence       = 1
                total_cycles   = 0
                pricing_scheme = @{
                    fixed_price = @{
                        value         = $Price.ToString("F2")
                        currency_code = "USD"
                    }
                }
            }
        )
        payment_preferences = @{
            auto_bill_outstanding     = $true
            setup_fee_failure_action  = "CONTINUE"
            payment_failure_threshold = 3
        }
    } | ConvertTo-Json -Depth 10
    
    try {
        $response = Invoke-RestMethod -Uri "$baseUrl/v1/billing/plans" `
            -Method Post `
            -Headers $headers `
            -Body $plan
        
        Write-Host "✓ Plan created: $($response.name)" -ForegroundColor Green
        Write-Host "  Plan ID: $($response.id)" -ForegroundColor Cyan
        return $response.id
    }
    catch {
        Write-Host "Error creating plan: $($_.Exception.Message)" -ForegroundColor Red
        Write-Host $_.Exception.Response -ForegroundColor Yellow
        return $null
    }
}

# Main execution
Write-Host "Creating PayPal Subscription Plans..." -ForegroundColor Cyan
Write-Host ""

# Get token
Write-Host "Getting access token..." -ForegroundColor Gray
$token = Get-PayPalToken

if (-not $token) {
    Write-Host "Failed to get access token" -ForegroundColor Red
    exit
}

# Create product
Write-Host "Creating product..." -ForegroundColor Gray
$productId = Create-PayPalProduct -Token $token

if (-not $productId) {
    Write-Host "Failed to create product" -ForegroundColor Red
    exit
}

Write-Host ""
Write-Host "Creating subscription plans..." -ForegroundColor Gray

# Create Monthly Plan
$monthlyPlanId = Create-SubscriptionPlan `
    -Token $token `
    -ProductId $productId `
    -Name "DuckShot Analytics Premium - Monthly" `
    -Description "Monthly subscription with AI insights, advanced analytics, and premium features" `
    -Price 19.99 `
    -IntervalUnit "MONTH" `
    -IntervalCount 1

# Create Yearly Plan
$yearlyPlanId = Create-SubscriptionPlan `
    -Token $token `
    -ProductId $productId `
    -Name "DuckShot Analytics Premium - Yearly" `
    -Description "Annual subscription with 20% savings - AI insights, advanced analytics, and premium features" `
    -Price 191.90 `
    -IntervalUnit "YEAR" `
    -IntervalCount 1

Write-Host ""
Write-Host "=" * 80 -ForegroundColor Yellow
Write-Host "Subscription Plans Created Successfully!" -ForegroundColor Green
Write-Host "=" * 80 -ForegroundColor Yellow
Write-Host ""
Write-Host "Add these to your .env file:" -ForegroundColor Cyan
Write-Host ""
Write-Host "VITE_PAYPAL_MONTHLY_PLAN_ID=$monthlyPlanId" -ForegroundColor White
Write-Host "VITE_PAYPAL_YEARLY_PLAN_ID=$yearlyPlanId" -ForegroundColor White
Write-Host ""
