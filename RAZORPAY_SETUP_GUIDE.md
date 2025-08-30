# Razorpay Integration Guide for Ticketease

## Overview
This guide explains how to set up Razorpay payment gateway integration in your Ticketease project for testing and production.

## Prerequisites
1. Razorpay account (sign up at https://razorpay.com)
2. Test API keys from Razorpay Dashboard
3. Basic understanding of JavaScript and payment flows

## Step 1: Create Razorpay Account
1. Go to https://razorpay.com and sign up
2. Complete KYC verification (required for live payments)
3. Access your Dashboard

## Step 2: Get API Keys
1. Login to Razorpay Dashboard
2. Go to Settings → API Keys
3. Generate Test Keys (for development)
4. Copy the Key ID (starts with `rzp_test_`)
5. Keep the Key Secret secure (never expose in frontend)

## Step 3: Update Configuration
1. Open `public/js/razorpay-config.js`
2. Replace `rzp_test_9WseLfh391sh6t` with your actual Test Key ID
3. For production, add your Live Key ID

```javascript
const RAZORPAY_CONFIG = {
    TEST_KEY_ID: 'rzp_test_YOUR_ACTUAL_KEY_HERE',
    LIVE_KEY_ID: 'rzp_live_YOUR_LIVE_KEY_HERE',
    ENVIRONMENT: 'test' // Change to 'live' for production
};
```

## Step 4: Test the Integration

### Test Cards for Development:
- **Success**: 4111 1111 1111 1111
- **Failure**: 4000 0000 0000 0002
- **CVV**: Any 3 digits
- **Expiry**: Any future date

### Test UPI IDs:
- **Success**: success@razorpay
- **Failure**: failure@razorpay

### Test Wallets:
- Use any mobile number for wallet payments in test mode

## Step 5: How It Works

### Current Implementation:
1. User selects flight and goes to booking page
2. Flight details are stored in localStorage
3. Pricing is calculated dynamically (base fare + taxes + service charge)
4. User clicks "Continue" → Razorpay modal opens
5. User completes payment
6. Success/failure handled with appropriate redirects

### Payment Flow:
```
Flight Selection → Booking Page → Payment Modal → Status Page
```

## Step 6: Testing Instructions

1. **Select a Flight**:
   - Go to flights.html
   - Search and select any flight
   - Click "BOOK"

2. **Review Booking**:
   - Check flight details on booking page
   - Verify pricing calculation
   - Click "Continue"

3. **Test Payment**:
   - Razorpay modal should open
   - Use test card: 4111 1111 1111 1111
   - Enter any CVV and future expiry
   - Complete payment

4. **Verify Success**:
   - Should redirect to payment-status.html
   - Payment details should be displayed
   - Check browser console for payment response

## Step 7: Production Setup

### Before Going Live:
1. Complete Razorpay KYC verification
2. Get Live API keys
3. Update `RAZORPAY_CONFIG.ENVIRONMENT` to 'live'
4. Add your Live Key ID
5. Set up webhooks for payment verification
6. Implement server-side payment verification

### Security Best Practices:
1. Never expose Key Secret in frontend
2. Always verify payments on server-side
3. Use webhooks for payment confirmation
4. Implement proper error handling
5. Log all payment transactions

## Step 8: Advanced Features (Optional)

### Order Creation (Recommended for Production):
```javascript
// Create order on your backend first
const order = await fetch('/api/create-order', {
    method: 'POST',
    body: JSON.stringify({ amount: totalAmount })
});

const orderData = await order.json();
options.order_id = orderData.id;
```

### Webhook Setup:
1. Go to Razorpay Dashboard → Webhooks
2. Add your server endpoint
3. Select events: payment.captured, payment.failed
4. Verify webhook signatures on server

### Payment Verification:
```javascript
// Server-side verification (Node.js example)
const crypto = require('crypto');

function verifyPayment(razorpayOrderId, razorpayPaymentId, razorpaySignature) {
    const body = razorpayOrderId + "|" + razorpayPaymentId;
    const expectedSignature = crypto
        .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
        .update(body.toString())
        .digest('hex');
    
    return expectedSignature === razorpaySignature;
}
```

## Troubleshooting

### Common Issues:
1. **Payment modal not opening**: Check if Razorpay script is loaded
2. **Invalid key error**: Verify your Key ID is correct
3. **Amount validation**: Ensure amount is in paise (multiply by 100)
4. **CORS errors**: Razorpay handles CORS, but check your domain settings

### Debug Steps:
1. Open browser console
2. Check for JavaScript errors
3. Verify localStorage data
4. Test with different browsers
5. Check network requests

## Current File Structure:
```
public/
├── category/
│   └── flight-booking.html (Updated with Razorpay)
├── js/
│   └── razorpay-config.js (New configuration file)
├── payment-status.html (Updated status page)
└── ...
```

## Support
- Razorpay Documentation: https://razorpay.com/docs/
- Integration Guide: https://razorpay.com/docs/payments/payment-gateway/web-integration/
- Test Cards: https://razorpay.com/docs/payments/payments/test-card-details/

## Next Steps
1. Test the current implementation
2. Set up proper backend for order creation
3. Implement webhook handling
4. Add payment verification
5. Set up proper error handling and logging