# 🔧 Environment Variables Reference

## Required Environment Variables

### Database Configuration

```bash
DATABASE_URL="postgresql://username:password@localhost:5432/ingoma_tours"
DIRECT_URL="postgresql://username:password@localhost:5432/ingoma_tours"
```

### Authentication (NextAuth.js)

```bash
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="your-nextauth-secret-key"
```

### IremboPay Payment Gateway

```bash
# IremboPay API Credentials
IREMBO_SECRET_KEY="your-irembo-secret-key"
IREMBO_PAYMENT_ACCOUNT_ID="your-payment-account-identifier"
IREMBO_PRODUCT_CODE="TOUR-BOOKING"

# IremboPay JavaScript Widget (for in-page payment modal)
NEXT_PUBLIC_IREMBO_PUBLIC_KEY="your-irembo-public-key"

# Webhook Security
IREMBOPAY_WEBHOOK_SECRET="your-webhook-secret"
```

### Application URLs

```bash
NEXT_PUBLIC_APP_URL="http://localhost:3000"
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME="your-cloud-name"
```

### Email Service (Resend)

```bash
RESEND_API_KEY="your-resend-api-key"
FROM_EMAIL="noreply@yourdomain.com"
```

### File Upload (Cloudinary)

```bash
CLOUDINARY_API_KEY="your-api-key"
CLOUDINARY_API_SECRET="your-api-secret"
```

### Admin Configuration

```bash
ADMIN_EMAIL="admin@ingomatours.com"
```

### Development Configuration

```bash
NODE_ENV="development"
```

## Environment Variable Usage

### IremboPay Integration

- **IREMBO_SECRET_KEY**: Your IremboPay secret key for API authentication
- **IREMBO_PAYMENT_ACCOUNT_ID**: The payment account identifier where funds will be deposited (e.g., "TST-RWF" for sandbox)
- **IREMBO_PRODUCT_CODE**: Product code for tour bookings (default: "TOUR-BOOKING")
- **IREMBOPAY_WEBHOOK_SECRET**: Secret used to verify webhook signatures from IremboPay

### Security Notes

1. Never commit actual values to version control
2. Use different keys for development and production
3. Webhook secret should be a strong, randomly generated string
4. Ensure all keys are properly secured in your deployment environment

## Example .env File Structure

```bash
# Copy this structure to your .env file and fill in your actual values

# Database
DATABASE_URL="postgresql://..."
DIRECT_URL="postgresql://..."

# Authentication
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="..."

# IremboPay
IREMBO_SECRET_KEY="..."
IREMBO_PAYMENT_ACCOUNT_ID="..."
IREMBO_PRODUCT_CODE="..."
NEXT_PUBLIC_IREMBO_PUBLIC_KEY="..."
IREMBOPAY_WEBHOOK_SECRET="..."

# Application
NEXT_PUBLIC_APP_URL="http://localhost:3000"
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME="..."

# External Services
RESEND_API_KEY="..."
FROM_EMAIL="..."
CLOUDINARY_API_KEY="..."
CLOUDINARY_API_SECRET="..."

# Admin
ADMIN_EMAIL="admin@ingomatours.com"

# Environment
NODE_ENV="development"
```

## Deployment Checklist

### Before Deploying

- [ ] All environment variables are set in production
- [ ] IremboPay credentials are for production environment
- [ ] Webhook URLs are correctly configured in IremboPay dashboard
- [ ] NEXT_PUBLIC_APP_URL points to production domain
- [ ] Database URL is production database
- [ ] All API keys are production keys

### Testing Environment Variables

You can test if your environment variables are properly set by running:

```bash
node -e "console.log('IREMBO_SECRET_KEY:', process.env.IREMBO_SECRET_KEY ? 'Set' : 'Missing')"
node -e "console.log('IREMBO_PAYMENT_ACCOUNT_ID:', process.env.IREMBO_PAYMENT_ACCOUNT_ID ? 'Set' : 'Missing')"
```
