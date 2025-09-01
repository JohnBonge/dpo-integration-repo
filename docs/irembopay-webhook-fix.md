# 🚨 IremboPay Webhook Configuration Fix

## 🔍 Problem Analysis

### Primary Issue: Webhook URL Configuration ❌

The main problem causing webhook failures is **incorrect webhook URL configuration** in the IremboPay sandbox dashboard:

- **Current URL**: `https://webhook.site/...` (testing URL)
- **Required URL**: `https://your-domain.com/api/payments/webhook`

This explains the 6 failed webhook attempts with 404 errors for invoice #880623211210.

### Secondary Issue: Sandbox Environment Quirks 🧪

Sandbox environments often have different behaviors than production, including:

- Different webhook retry policies
- Modified signature generation (though our implementation matches the docs exactly)
- Network connectivity restrictions
- Different secret keys or authentication requirements

## ✅ Signature Verification Implementation

Our webhook signature verification **perfectly matches** the IremboPay documentation:

```typescript
// Our implementation follows IremboPay docs exactly:
// 1. Extract timestamp and signature from header
const elements = signatureHeader.split(',');
elements.forEach((element) => {
  const [prefix, value] = element.trim().split('=');
  if (prefix === 't') timestamp = value;
  else if (prefix === 's') signatureHash = value;
});

// 2. Prepare signed payload: timestamp + "#" + body
const signedPayload = `${timestamp}#${body}`;

// 3. Calculate expected signature
const expectedSignature = createHmac('sha256', secretKey)
  .update(signedPayload)
  .digest('hex');

// 4. Compare using timing-safe comparison
const isValid = timingSafeEqual(expectedBuffer, receivedBuffer);
```

## 🔧 Immediate Fixes Required

### 1. Update Webhook URL in IremboPay Dashboard

**Action**: Log into IremboPay sandbox dashboard and update webhook URL:

- **From**: `https://webhook.site/...`
- **To**: `https://your-actual-domain.com/api/payments/webhook`

### 2. Verify Environment Variables

Ensure your `.env` has the correct sandbox credentials:

```bash
# Sandbox Environment
IREMBO_API_URL=https://sandbox.irembopay.com/api/v1
IREMBO_PAYMENT_URL=https://sandbox.irembopay.com
IREMBO_SECRET_KEY=your_sandbox_secret_key
IREMBO_CLIENT_ID=your_sandbox_client_id
```

### 3. Test Webhook Endpoint

Run our test script to verify webhook functionality:

```bash
npx tsx scripts/test-sandbox-webhook.ts
```

## 🧪 Sandbox Testing Strategy

### Manual Webhook Test

Use the generated curl command from the test script:

```bash
curl -X POST https://your-domain.com/api/payments/webhook-test \
  -H "Content-Type: application/json" \
  -H "irembopay-signature: t=1737547200000,s=generated_signature" \
  -d '{"success":true,"data":{"amount":100,"invoiceNumber":"880623211210"}}'
```

### Webhook Test Endpoint

We've created `/api/payments/webhook-test` for debugging:

- ✅ Logs all headers and body content
- ✅ Tests signature verification
- ✅ Provides detailed debugging output
- ✅ Safe for testing (doesn't update database)

## 📊 Current Status

### ✅ What's Working

- Signature verification implementation matches IremboPay docs exactly
- Payment initialization working (invoice #880623211210 created successfully)
- Payment processing working (customer successfully paid $100)
- Webhook endpoint exists and is functional

### ❌ What's Broken

- Webhook URL pointing to wrong destination (webhook.site vs actual app)
- Booking status not updating after successful payment
- 6 failed webhook attempts due to 404 errors

## 🎯 Next Steps

### Immediate (High Priority)

1. **Update webhook URL** in IremboPay sandbox dashboard
2. **Test webhook** using our test endpoint
3. **Verify** booking status updates after webhook receives payment confirmation

### Testing (Medium Priority)

1. Run sandbox webhook test script
2. Test with a new small payment
3. Monitor webhook logs for successful delivery

### Long-term (Low Priority)

1. Set up webhook monitoring/alerting
2. Implement webhook retry logic on our side
3. Add webhook event logging for audit trail

## 🚨 Critical Action Required

**The primary fix is updating the webhook URL in the IremboPay dashboard.** Our code implementation is correct according to their documentation - the issue is simply that webhooks are being sent to the wrong URL.

Once the webhook URL is corrected:

1. Existing stuck booking should be manually updated using our fix script
2. New payments should automatically update booking status
3. Webhook delivery should show success instead of 404 errors

## 📞 Support Escalation

If webhook issues persist after URL correction, contact IremboPay support with:

- Sandbox environment details
- Webhook URL configuration
- Sample webhook signature verification code (our implementation)
- Request clarification on sandbox-specific webhook behavior

## 🔧 Immediate Fix: Update Current Booking

### Step 1: Fix the Stuck Booking

Run this script to update the current booking that's stuck in PROCESSING status:

```bash
npx tsx scripts/fix-stuck-booking-simple.ts
```

This will:

- Find the booking `cmc94pqdu0003mfvzhhfhan`
- Update payment status to `PAID`
- Update booking status to `CONFIRMED`
- Set `paidAt` and `confirmedAt` timestamps
- Create a payment event record

## 🔗 Webhook URL Configuration

### Step 2: Update IremboPay Dashboard

**Current (Wrong) Webhook URL:**

```
https://webhook.site/9f47c2b2-fbf1-4d91-bf41-12c33c0bf3b4
```

**Correct Webhook URL:**

```
https://your-domain.com/api/payments/webhook
```

### How to Update:

1. **Log into IremboPay Dashboard**
2. **Go to Settings → Webhooks**
3. **Update the Callback URL to:**
   ```
   https://ingomatours.com/api/payments/webhook
   ```
   OR for development:
   ```
   https://your-ngrok-url.ngrok.io/api/payments/webhook
   ```

## 🧪 Testing the Webhook

### Step 3: Test Webhook Endpoint

Use the test endpoint to verify webhook functionality:

```bash
# Test if the endpoint is accessible
curl -X GET https://your-domain.com/api/payments/webhook-test

# Test with a sample payload
curl -X POST https://your-domain.com/api/payments/webhook-test \
  -H "Content-Type: application/json" \
  -H "irembopay-signature: t=1234567890,s=test_signature" \
  -d '{"test": "webhook_payload"}'
```

## 🔐 Environment Variables

### Step 4: Verify Environment Configuration

Make sure these environment variables are set:

```env
# IremboPay Configuration
IREMBO_SECRET_KEY=your_actual_secret_key_here
IREMBO_PAYMENT_ACCOUNT_ID=your_payment_account_id

# Application URLs
NEXT_PUBLIC_APP_URL=https://ingomatours.com
```

**Important:** The webhook uses `IREMBO_SECRET_KEY` (same as API calls), not a separate webhook secret.

## 🔍 Debugging Tools

### Test Signature Verification

```bash
# Test the signature verification logic
npx tsx scripts/test-irembopay-signature.ts
```

### Monitor Webhook Logs

Check the application logs when testing webhooks:

```bash
# In development
npm run dev

# Check logs for webhook activity
# Look for: 📨 IremboPay webhook received
```

## 📋 Webhook Payload Format

IremboPay sends webhooks in this format:

```json
{
  "success": true,
  "data": {
    "amount": 100,
    "invoiceNumber": "880623211210",
    "transactionId": "cmc94pqdu0003mfvzhhfhan",
    "paymentStatus": "PAID",
    "currency": "USD",
    "customer": {
      "email": "customer@example.com",
      "phoneNumber": "0780000001",
      "name": "Customer Name"
    },
    "paidAt": "2023-06-23T15:26:00.000+02:00"
  }
}
```

With headers:

```
irembopay-signature: t=1687523160000,s=bfecb20753326e5e8602f4a6e727bcd22b7cb1d00797fe5bd65db8cfaf2f4903
Content-Type: application/json
```

## ✅ Verification Checklist

After making changes, verify:

- [ ] **Webhook URL updated in IremboPay dashboard**
- [ ] **Current stuck booking fixed**
- [ ] **Environment variables configured**
- [ ] **Test webhook endpoint responds with 200**
- [ ] **Signature verification works**
- [ ] **New test payment updates booking status automatically**

## 🚨 Common Issues

### Issue 1: 404 Not Found

**Cause:** Webhook URL not accessible
**Solution:** Verify URL is correct and server is running

### Issue 2: 401 Unauthorized

**Cause:** Signature verification failing
**Solution:** Check `IREMBO_SECRET_KEY` matches IremboPay dashboard

### Issue 3: Booking Not Found

**Cause:** Transaction ID mismatch
**Solution:** Verify booking ID mapping in payment initialization

## 🔄 Future Prevention

1. **Always use production URLs** for webhook configuration
2. **Test webhook endpoints** before going live
3. **Monitor webhook logs** regularly
4. **Set up alerts** for webhook failures
5. **Document webhook URL changes** in deployment process

## 📞 Support

If issues persist:

1. **Check IremboPay Dashboard** for webhook retry attempts
2. **Review application logs** for error messages
3. **Test with webhook.site first** to see payload format
4. **Contact IremboPay support** if signature issues persist

---

**Last Updated:** January 2025  
**Status:** Critical Fix Required  
**Priority:** High - Affects payment confirmations
