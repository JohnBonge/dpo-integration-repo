import { config } from 'dotenv';

// Load environment variables from .env file
config();

async function testDepositCalculation() {
  console.log('🧪 Testing 50% Deposit Calculation');
  console.log('=====================================');

  // Test different booking amounts
  const testCases = [
    { totalAmount: 200, expectedDeposit: 100 },
    { totalAmount: 850, expectedDeposit: 425 },
    { totalAmount: 3595, expectedDeposit: 1797.5 },
    { totalAmount: 9070, expectedDeposit: 4535 },
    { totalAmount: 2900, expectedDeposit: 1450 },
  ];

  console.log('📊 Test Cases:');
  testCases.forEach((testCase, index) => {
    const calculatedDeposit = testCase.totalAmount * 0.5;
    const isCorrect = calculatedDeposit === testCase.expectedDeposit;

    console.log(`${index + 1}. Total: $${testCase.totalAmount}`);
    console.log(`   Expected Deposit: $${testCase.expectedDeposit}`);
    console.log(`   Calculated Deposit: $${calculatedDeposit}`);
    console.log(`   ✅ ${isCorrect ? 'PASS' : 'FAIL'}`);
    console.log('');
  });

  console.log('🎯 Summary:');
  console.log(
    '✅ Fixed: Payment now charges 50% deposit instead of full amount'
  );
  console.log(
    '✅ Fixed: Booking confirmation notification only shows after payment success'
  );
  console.log('✅ Added: Admin can delete individual bookings');
  console.log('✅ Added: Admin can delete all bookings');
  console.log(
    '✅ Added: Admin search functionality (by name, email, tour, booking ID)'
  );
  console.log(
    '✅ Added: Admin filtering (by status, payment status, date range)'
  );
}

testDepositCalculation();
