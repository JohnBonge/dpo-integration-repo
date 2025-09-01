#!/usr/bin/env tsx

/**
 * Complete IremboPay Product Mappings Script - Dynamic Version
 *
 * This script helps you complete the product mappings based on your IremboPay dashboard
 * Updated to work with the new dynamic mapping system
 *
 * Run with: npx tsx scripts/complete-irembopay-mappings.ts
 */

/* import { PrismaClient } from '@prisma/client';
import {
  IREMBO_PRODUCT_CODE_MAPPINGS,
  getAllIremboProductMappings,
} from '../lib/services/irembopay-product-mapping';

const prisma = new PrismaClient();

// IremboPay products from your dashboard screenshot
const IREMBO_DASHBOARD_PRODUCTS = [
  {
    code: 'PC-46825b777d',
    name: 'Gorilla Trekking Advd44enture in Rwanda',
    amount: 4000.0,
  },
  {
    code: 'PC-8e6b53fbad',
    name: 'Ultimate Uganda-Rwanda 20-Day Safari',
    amount: 9269.0,
  },
  {
    code: 'PC-e892ac87ef',
    name: 'Bisoke Hike, Golden Monkey Trek, Lake Kivu and Twin Lake Adventure',
    amount: 2800.0,
  },
  {
    code: 'PC-a79e19f1b4', // Fixed the typo in the original
    name: 'Nyungwe National Park Adventure: Chimpanzees, Waterfalls & Canopy Walk',
    amount: 2900.0,
  },
  {
    code: 'PC-26d2dae574',
    name: 'Uganda & Rwanda Adventure: Gorilla Trekking and Kigali City Highlights',
    amount: 3595.0,
  },
  {
    code: 'PC-2d19d4807f', // Fixed the typo in the original
    name: 'Whole Rwanda Adventure: Gorilla Trekking, Lake Kivu, Akagera & Nyungwe',
    amount: 9070.0,
  },
  {
    code: 'PC-a12f760427',
    name: 'Akagera National Park Safari',
    amount: 850.0,
  },
  {
    code: 'PC-74ac3ffe8a',
    name: 'Kigali City Tour',
    amount: 200.0,
  },
  {
    code: 'PC-5c9dbd63c8',
    name: 'The Great Migration Safari',
    amount: 9102.0,
  },
];

async function main() {
  try {
    console.log(
      '🔍 Analyzing IremboPay Product Mappings (Dynamic Version)...\n'
    );

    // Get all tour packages from database
    const tourPackages = await prisma.tourPackage.findMany({
      select: {
        id: true,
        title: true,
        price: true,
        duration: true,
        slug: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    // Get dynamic mappings
    const dynamicMappings = await getAllIremboProductMappings();

    console.log(`📋 Found ${tourPackages.length} tour packages in database`);
    console.log(
      `📋 Found ${IREMBO_DASHBOARD_PRODUCTS.length} products in IremboPay dashboard`
    );
    console.log(`📋 Static mappings: ${IREMBO_PRODUCT_CODE_MAPPINGS.length}`);
    console.log(`📋 Dynamic mappings: ${dynamicMappings.length}\n`);

    console.log('🎯 MAPPING ANALYSIS:');
    console.log('='.repeat(80));

    // Check existing mappings
    console.log('\n✅ EXISTING DYNAMIC MAPPINGS:');
    dynamicMappings.forEach((mapping, index) => {
      const staticMapping = IREMBO_PRODUCT_CODE_MAPPINGS.find(
        (s) => s.tourPackageId === mapping.tourPackageId
      );
      const iremboProduct = IREMBO_DASHBOARD_PRODUCTS.find(
        (p) => p.code === mapping.iremboProductCode
      );

      console.log(`${index + 1}. ${mapping.tourName}`);
      console.log(`   Tour ID: ${mapping.tourPackageId}`);
      console.log(`   IremboPay Code: ${mapping.iremboProductCode}`);
      console.log(`   Current Price: $${mapping.price}`);
      console.log(`   Notes: ${staticMapping?.notes || 'N/A'}`);
      console.log(
        `   Status: ${
          staticMapping
            ? '✅ Static mapping exists'
            : '❌ Static mapping missing'
        } | ${
          iremboProduct
            ? '✅ IremboPay product exists'
            : '❌ IremboPay product not found'
        }`
      );
      console.log('   ' + '-'.repeat(50));
    });

    // Find unmapped tour packages
    const mappedTourIds = IREMBO_PRODUCT_CODE_MAPPINGS.map(
      (m) => m.tourPackageId
    );
    const unmappedTours = tourPackages.filter(
      (t) => !mappedTourIds.includes(t.id)
    );

    if (unmappedTours.length > 0) {
      console.log('\n❌ UNMAPPED TOUR PACKAGES:');
      unmappedTours.forEach((tour, index) => {
        console.log(`${index + 1}. ${tour.title}`);
        console.log(`   Tour ID: ${tour.id}`);
        console.log(`   Price: $${tour.price}`);
        console.log(`   Duration: ${tour.duration} days`);

        // Try to find matching IremboPay product by name similarity
        const possibleMatch = IREMBO_DASHBOARD_PRODUCTS.find(
          (p) =>
            p.name
              .toLowerCase()
              .includes(tour.title.toLowerCase().split(' ')[0]) ||
            tour.title
              .toLowerCase()
              .includes(p.name.toLowerCase().split(' ')[0])
        );

        if (possibleMatch) {
          console.log(
            `   🎯 Possible match: ${possibleMatch.name} (${possibleMatch.code})`
          );
        } else {
          console.log(`   ❓ No obvious match found`);
        }
        console.log('   ' + '-'.repeat(50));
      });
    }

    // Find unmapped IremboPay products
    const mappedIremboCodes = IREMBO_PRODUCT_CODE_MAPPINGS.map(
      (m) => m.iremboProductCode
    );
    const unmappedIremboProducts = IREMBO_DASHBOARD_PRODUCTS.filter(
      (p) => !mappedIremboCodes.includes(p.code)
    );

    if (unmappedIremboProducts.length > 0) {
      console.log('\n❌ UNMAPPED IREMBOPAY PRODUCTS:');
      unmappedIremboProducts.forEach((product, index) => {
        console.log(`${index + 1}. ${product.name}`);
        console.log(`   Code: ${product.code}`);
        console.log(`   Amount: $${product.amount}`);
        console.log('   ' + '-'.repeat(50));
      });
    }

    console.log('\n🚀 NEXT STEPS:');
    console.log(
      '1. Update IREMBO_PRODUCT_CODE_MAPPINGS in lib/services/irembopay-product-mapping.ts'
    );
    console.log('2. Only add the essential mapping (ID → Product Code)');
    console.log(
      '3. Tour titles and prices will be fetched dynamically from database'
    );
    console.log('4. Test the payment flow');

    console.log('\n📝 SUGGESTED STATIC MAPPING TEMPLATE:');
    console.log('Add these to IREMBO_PRODUCT_CODE_MAPPINGS array:');
    console.log('```typescript');
    unmappedTours.forEach((tour) => {
      console.log(`{`);
      console.log(`  tourPackageId: '${tour.id}',`);
      console.log(
        `  iremboProductCode: 'PC-XXXXXXXX', // Find matching code from dashboard`
      );
      console.log(`  notes: '${tour.title}', // Just for reference`);
      console.log(`},`);
    });
    console.log('```');

    console.log('\n💡 DYNAMIC BENEFITS:');
    console.log(
      '✅ Tour titles and prices are automatically synced from database'
    );
    console.log('✅ No manual updates needed when tour details change');
    console.log(
      '✅ Only essential business logic (ID → Product Code) in static mapping'
    );
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
*/