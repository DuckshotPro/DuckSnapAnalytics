/**
 * Example usage of PayPal Subscription Button in pricing page
 */

// Add this import to your pricing-page.tsx
import PayPalSubscriptionButton from '@/components/payments/PayPalSubscriptionButton';

// Replace the existing "Upgrade to Premium" button with:

{/* Monthly Plan Payment Button */ }
<PayPalSubscriptionButton
    planId={import.meta.env.VITE_PAYPAL_MONTHLY_PLAN_ID || ''}
    billingPeriod="monthly"
    amount="19.99"
    buttonText="Upgrade to Premium"
    variant="premium"
    onSuccess={(subscriptionId) => {
        console.log('Subscription created:', subscriptionId);
        // Navigate to dashboard or show success message
    }}
/>

{/* Yearly Plan Payment Button */ }
<PayPalSubscriptionButton
    planId={import.meta.env.VITE_PAYPAL_YEARLY_PLAN_ID || ''}
    billingPeriod="yearly"
    amount="191.90"
    buttonText="Upgrade to Premium (Save 20%)"
    variant="premium"
    onSuccess={(subscriptionId) => {
        console.log('Subscription created:', subscriptionId);
    }}
/>

// Features:
// ✅ Branded with DuckSnapAnalytics amber/gold theme
// ✅ Official PayPal SDK integration
// ✅ Automatic subscription creation
// ✅ Secure payment through PayPal
// ✅ Success/error handling with toasts
// ✅ Cancel option
// ✅ Responsive design
