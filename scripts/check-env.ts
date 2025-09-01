import { config } from 'dotenv';

// Load environment variables from .env file
config();

// Check IremboPay environment variables
// console.log('🔍 IremboPay Environment Variables Status:');
console.log('');

/* const requiredVars = [
  'IREMBO_SECRET_KEY',
  'IREMBO_PAYMENT_ACCOUNT_ID',
  'NEXT_PUBLIC_IREMBO_PUBLIC_KEY',
  'IREMBOPAY_WEBHOOK_SECRET',
  'NEXT_PUBLIC_APP_URL',
];
*/
// const optionalVars = ['IREMBO_PRODUCT_CODE'];

console.log('📋 Required Variables:');
requiredVars.forEach((varName) => {
  const value = process.env[varName];
  const status = value ? '✅ SET' : '❌ MISSING';
  const displayValue = value
    ? value.length > 20
      ? value.substring(0, 20) + '...'
      : value
    : 'undefined';
  console.log(`  ${varName}: ${status} ${value ? `(${displayValue})` : ''}`);
});

console.log('');
console.log('📋 Optional Variables:');
optionalVars.forEach((varName) => {
  const value = process.env[varName];
  const status = value ? '✅ SET' : '⚠️  NOT SET (using default)';
  const displayValue = value
    ? value.length > 20
      ? value.substring(0, 20) + '...'
      : value
    : 'undefined';
  console.log(`  ${varName}: ${status} ${value ? `(${displayValue})` : ''}`);
});

console.log('');
console.log('🌐 Application URLs:');
console.log(
  `  NEXT_PUBLIC_APP_URL: ${process.env.NEXT_PUBLIC_APP_URL || 'NOT SET'}`
);
console.log(`  Current NODE_ENV: ${process.env.NODE_ENV || 'NOT SET'}`);

console.log('');
console.log('📝 Notes:');
/* console.log(
  '  - IREMBO_PRODUCT_CODE is optional (we use product mapping instead)'
);
console.log('  - IREMBOPAY_WEBHOOK_SECRET is needed for webhook security');
console.log(
  '  - NEXT_PUBLIC_IREMBO_PUBLIC_KEY is needed for JavaScript widget'
);
console.log(
  '  - IREMBO_PAYMENT_ACCOUNT_ID should be your payment account identifier'
); */
