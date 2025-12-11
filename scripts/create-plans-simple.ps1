# Simple PayPal Plan Creation Script
# Using existing product: PROD-1U316450TW459990L

$clientId = "AQuPla_v-nyUoP7R9DASWT3GQgTOn-vSb40MyB_4G2llS0fFMhH199cU1pCHUFZZltAuX70odwwPoRQR"
$clientSecret = "EG0EXtyBr0uqjT6g_OmYTgS9vTp05rt0_BmdV37r4QzFrMg7PjtLp9QekUXNH7myH921MR31LDrRsF_E"
$baseUrl = "https://api-m.sandbox.paypal.com"
$productId = "PROD-1U316450TW459990L"

Write-Host "Creating PayPal Subscription Plans..." -ForegroundColor Cyan
Write-Host ""

# Get access token
Write-Host "Getting access token..." -ForegroundColor Gray
$auth = "${clientId}:${clientSecret}"
$bytes = [System.Text.Encoding]::UTF8.GetBytes($auth)
$base64 = [Convert]::ToBase64String($bytes)

$tokenResponse = Invoke-RestMethod -Uri "$baseUrl/v1/oauth2/token" `
    -Method Post `
    -Headers @{
    "Authorization" = "Basic $base64"
    "Content-Type"  = "application/x-www-form-urlencoded"
} `
    -Body "grant_type=client_credentials"

$token = $tokenResponse.access_token
Write-Host "[OK] Token obtained" -ForegroundColor Green
Write-Host ""

# Create Monthly Plan
Write-Host "Creating Monthly Plan..." -ForegroundColor Gray

$monthlyPlanBody = @{
    product_id          = $productId
    name                = "DuckShot Analytics Premium - Monthly"
    description         = "Monthly subscription with AI insights, advanced analytics, and premium features"
    status              = "ACTIVE"
    billing_cycles      = @(
        @{
            frequency      = @{
                interval_unit  = "MONTH"
                interval_count = 1
            }
            tenure_type    = "REGULAR"
            sequence       = 1
            total_cycles   = 0
            pricing_scheme = @{
                fixed_price = @{
                    value         = "19.99"
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
    $monthlyPlan = Invoke-RestMethod -Uri "$baseUrl/v1/billing/plans" `
        -Method Post `
        -Headers @{
        "Authorization" = "Bearer $token"
        "Content-Type"  = "application/json"
        "Prefer"        = "return=representation"
    } `
        -Body $monthlyPlanBody
    
    Write-Host "[OK] Monthly Plan Created!" -ForegroundColor Green
    Write-Host "  Plan ID: $($monthlyPlan.id)" -ForegroundColor Cyan
    $monthlyPlanId = $monthlyPlan.id
}
catch {
    Write-Host "[ERROR] Error creating monthly plan:" -ForegroundColor Red
    Write-Host $_.Exception.Message -ForegroundColor Red
    $monthlyPlanId = "ERROR"
}

Write-Host ""

# Create Yearly Plan
Write-Host "Creating Yearly Plan..." -ForegroundColor Gray

$yearlyPlanBody = @{
    product_id          = $productId
    name                = "DuckShot Analytics Premium - Yearly"
    description         = "Annual subscription with 20% savings - AI insights, advanced analytics, and premium features"
    status              = "ACTIVE"
    billing_cycles      = @(
        @{
            frequency      = @{
                interval_unit  = "YEAR"
                interval_count = 1
            }
            tenure_type    = "REGULAR"
            sequence       = 1
            total_cycles   = 0
            pricing_scheme = @{
                fixed_price = @{
                    value         = "191.90"
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
    $yearlyPlan = Invoke-RestMethod -Uri "$baseUrl/v1/billing/plans" `
        -Method Post `
        -Headers @{
        "Authorization" = "Bearer $token"
        "Content-Type"  = "application/json"
        "Prefer"        = "return=representation"
    } `
        -Body $yearlyPlanBody
    
    Write-Host "[OK] Yearly Plan Created!" -ForegroundColor Green
    Write-Host "  Plan ID: $($yearlyPlan.id)" -ForegroundColor Cyan
    $yearlyPlanId = $yearlyPlan.id
}
catch {
    Write-Host "[ERROR] Error creating yearly plan:" -ForegroundColor Red
    Write-Host $_.Exception.Message -ForegroundColor Red
    $yearlyPlanId = "ERROR"
}

Write-Host ""
Write-Host ("=" * 80) -ForegroundColor Yellow
Write-Host "Subscription Plans Created!" -ForegroundColor Green
Write-Host ("=" * 80) -ForegroundColor Yellow
Write-Host ""
Write-Host "Add these to your .env file:" -ForegroundColor Cyan
Write-Host ""
Write-Host "PAYPAL_MONTHLY_PLAN_ID=$monthlyPlanId" -ForegroundColor White
Write-Host "PAYPAL_YEARLY_PLAN_ID=$yearlyPlanId" -ForegroundColor White
Write-Host "VITE_PAYPAL_MONTHLY_PLAN_ID=$monthlyPlanId" -ForegroundColor White
Write-Host "VITE_PAYPAL_YEARLY_PLAN_ID=$yearlyPlanId" -ForegroundColor White
Write-Host ""
