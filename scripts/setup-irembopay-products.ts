#!/usr/bin/env tsx

/**
 * Setup IremboPay Products Script
 *
 * This script helps you identify which tour packages need to be set up as products
 * in your IremboPay merchant dashboard.
 *
 * Run with: npx tsx scripts/setup-irembopay-products.ts
 */

import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  try {
    console.log('🔍 Fetching all tour packages from your database...\n');

    const tourPackages = await prisma.tourPackage.findMany({
      select: {
        id: true,
        title: true,
        price: true,
        duration: true,
        slug: true,
        createdAt: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    if (tourPackages.length === 0) {
      console.log('❌ No tour packages found in your database.');
      console.log('   Please add some tour packages first.');
      return;
    }

    console.log(
      `✅ Found ${tourPackages.length} tour packages. Here's what you need to set up in IremboPay:\n`
    );

    console.log('📋 PRODUCTS TO CREATE IN IREMBOPAY DASHBOARD:');
    console.log('='.repeat(80));

    tourPackages.forEach((tour, index) => {
      const productCode = `TOUR-${tour.id}`;

      console.log(`${index + 1}. Product Code: ${productCode}`);
      console.log(`   Product Name: ${tour.title}`);
      console.log(`   Price: ${tour.price} RWF`);
      console.log(`   Duration: ${tour.duration} days`);
      console.log(`   Tour ID: ${tour.id}`);
      console.log('   ' + '-'.repeat(50));
    });

    console.log('\n🚀 NEXT STEPS:');
    console.log('1. Log into your IremboPay merchant dashboard');
    console.log('2. Navigate to Products/Services section');
    console.log('3. Create products using the codes and details listed above');
    console.log(
      "4. Make sure the product codes EXACTLY match what's shown above"
    );
    console.log('5. Test a booking to ensure everything works');

    console.log('\n💡 ALTERNATIVE APPROACH:');
    console.log(
      'Instead of creating individual products for each tour, you can:'
    );
    console.log('1. Create one generic product (e.g., "TOUR-BOOKING")');
    console.log(
      '2. Add this environment variable: IREMBO_PRODUCT_CODE=TOUR-BOOKING'
    );
    console.log(
      '3. Modify the code to use this generic product for all bookings'
    );

    console.log('\n📞 SUPPORT:');
    console.log('If you need help setting up products in IremboPay:');
    console.log('- Contact IremboPay support');
    console.log('- Ask about dynamic product creation for tour bookings');
    console.log('- Request API access for automated product management');
  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

main().catch((error) => {
  console.error('❌ Script failed:', error);
  process.exit(1);
});
