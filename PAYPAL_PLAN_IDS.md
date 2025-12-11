# PayPal Subscription Plan IDs

**Created:** 2025-12-10 22:06 CST

## ✅ Plans Created Successfully

### Product
- **Product ID:** `PROD-1U316450TW459990L`
- **Product Name:** DuckShot Analytics Premium
- **Description:** Premium subscription for DuckShot Analytics with AI-powered insights and advanced features

### Monthly Plan
- **Plan ID:** `P-7CG40635HU801524CNE5EHHI`
- **Name:** DuckShot Analytics Premium - Monthly
- **Price:** $19.99/month
- **Status:** ✅ ACTIVE

### Yearly Plan
- **Plan ID:** `P-9A17911506902021RNE5EHHQ`
- **Name:** DuckShot Analytics Premium - Yearly
- **Price:** $191.90/year (20% savings)
- **Status:** ✅ ACTIVE

---

## 📝 Add These to Your `.env` File

Copy and paste these lines into your `.env` file:

```env
# PayPal Subscription Plan IDs (Server-side)
PAYPAL_MONTHLY_PLAN_ID=P-7CG40635HU801524CNE5EHHI
PAYPAL_YEARLY_PLAN_ID=P-9A17911506902021RNE5EHHQ

# PayPal Subscription Plan IDs (Client-side - VITE_ prefix required)
VITE_PAYPAL_MONTHLY_PLAN_ID=P-7CG40635HU801524CNE5EHHI
VITE_PAYPAL_YEARLY_PLAN_ID=P-9A17911506902021RNE5EHHQ
```

---

## 🔧 Next Steps

1. ✅ **DONE:** Create PayPal subscription plans
2. **TODO:** Add plan IDs to `.env` file
3. **TODO:** Test the PayPal button on the pricing page
4. **TODO:** Set up PayPal webhook handling
5. **TODO:** Commit and push changes to Git

---

## 📖 PayPal Dashboard Links

- **Sandbox Dashboard:** https://www.sandbox.paypal.com/
- **Developer Portal:** https://developer.paypal.com/dashboard/
- **Product Details:** https://www.sandbox.paypal.com/billing/plans/PROD-1U316450TW459990L

---

## 🛠️ Testing

To test the subscription flow:
1. Start dev server: `npm run dev`
2. Navigate to `/pricing` 
3. Click a PayPal subscription button
4. Use PayPal Sandbox test credentials:
   - Email: Any sandbox buyer account
   - Password: Your sandbox test password

---

## ⚠️ Important Notes

- These are **SANDBOX** plan IDs for testing
- For production, create new plans in PayPal Live mode
- Keep plan IDs secret - never commit to Git
- The `.env` file is properly gitignored

