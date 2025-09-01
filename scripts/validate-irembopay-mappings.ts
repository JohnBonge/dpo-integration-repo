/**
 * Validate IremboPay Product Mappings - Dynamic Version
 *
 * This script checks the new dynamic mapping system
 */

import { prisma } from '../lib/prisma';
import {
  getAllIremboProductMappings,
  getMappedTourPackageIds,
} from '../lib/services/irembopay-product-mapping';

async function validateMappings() {
  console.log(
    '🔍 Validating IremboPay Product Mappings (Dynamic Version)...\n'
  );

  try {
    // Get all tour packages from database
    const tourPackages = await prisma.tourPackage.findMany({
      select: {
        id: true,
        title: true,
        price: true,
        slug: true,
      },
    });

    // Get dynamic mappings
    const dynamicMappings = await getAllIremboProductMappings();
    const mappedIds = getMappedTourPackageIds();

    console.log(`📦 Found ${tourPackages.length} tour packages in database`);
    console.log(`🗺️  Found ${mappedIds.length} static mappings`);
    console.log(`🔄 Generated ${dynamicMappings.length} dynamic mappings\n`);

    // 1. Check for missing mappings
    const missingMappings: string[] = [];
    const orphanedMappings: string[] = [];

    tourPackages.forEach((tour) => {
      if (!mappedIds.includes(tour.id)) {
        missingMappings.push(`${tour.title} (ID: ${tour.id})`);
      }
    });

    // 2. Check for orphaned mappings
    mappedIds.forEach((mappedId) => {
      const tour = tourPackages.find((t) => t.id === mappedId);
      if (!tour) {
        const mapping = dynamicMappings.find(
          (m) => m.tourPackageId === mappedId
        );
        orphanedMappings.push(
          `${mapping?.tourName || 'Unknown'} (ID: ${mappedId})`
        );
      }
    });

    // 3. Display results
    console.log('📋 VALIDATION RESULTS:\n');

    if (missingMappings.length === 0) {
      console.log('✅ All tour packages have IremboPay mappings');
    } else {
      console.log(
        `❌ ${missingMappings.length} tour package(s) missing IremboPay mappings:`
      );
      missingMappings.forEach((missing) => console.log(`   - ${missing}`));
    }

    if (orphanedMappings.length === 0) {
      console.log('✅ No orphaned mappings found');
    } else {
      console.log(`\n🔗 ${orphanedMappings.length} orphaned mapping(s) found:`);
      orphanedMappings.forEach((orphaned) => console.log(`   - ${orphaned}`));
    }

    // 4. Show dynamic mappings with current data
    if (dynamicMappings.length > 0) {
      console.log('\n🔄 Current Dynamic Mappings:');
      dynamicMappings.forEach((mapping) => {
        console.log(`   ${mapping.tourName}:`);
        console.log(`     ID: ${mapping.tourPackageId}`);
        console.log(`     Product Code: ${mapping.iremboProductCode}`);
        console.log(`     Price: $${mapping.price}`);
        console.log(`     Last Updated: ${mapping.lastUpdated?.toISOString()}`);
        console.log('');
      });
    }

    // 5. Summary
    const totalIssues = missingMappings.length + orphanedMappings.length;
    console.log(`📊 SUMMARY:`);
    console.log(`   Total tour packages: ${tourPackages.length}`);
    console.log(`   Static mappings: ${mappedIds.length}`);
    console.log(`   Dynamic mappings: ${dynamicMappings.length}`);
    console.log(`   Issues found: ${totalIssues}`);

    if (totalIssues === 0) {
      console.log('\n🎉 All mappings are valid and up-to-date!');
      console.log('💡 Dynamic data is automatically fetched from database');
    } else {
      console.log(
        '\n🔧 Please update the static mappings in lib/services/irembopay-product-mapping.ts'
      );
    }
  } catch (error) {
    console.error('❌ Error validating mappings:', error);
  } finally {
    await prisma.$disconnect();
  }
}

validateMappings();
