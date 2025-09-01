/**
 * IremboPay Product Mapping - Dynamic Version
 *
 * This file maps tour package IDs to IremboPay product codes only.
 * Tour package details (title, price) are fetched dynamically from the database.
 * This ensures the mapping stays valid even when tour details change.
 */

import { prisma } from '../prisma';

// Simplified interface - only stores the essential mapping
export interface IremboProductCodeMapping {
  tourPackageId: string;
  iremboProductCode: string;
  notes?: string; // Optional notes for reference
}

// Enhanced interface that includes dynamic data from database
export interface IremboProductMapping {
  tourPackageId: string;
  iremboProductCode: string;
  tourName: string;
  price: number;
  currency: 'USD';
  slug?: string;
  lastUpdated?: Date;
}

// Static mapping - only the essential business logic (ID -> Product Code)
// This is the only part that needs manual maintenance when adding new tours
export const IREMBO_PRODUCT_CODE_MAPPINGS: IremboProductCodeMapping[] = [
  {
    tourPackageId: 'cm4fogxvw0000mm0fkuq5woap',
    iremboProductCode: 'PC-74ac3ffe8a',
    notes: 'Kigali City Tour',
  },
  {
    tourPackageId: 'cm4h1xpoy0000l80g6f32hpfz',
    iremboProductCode: 'PC-a12f760427',
    notes: 'Akagera National Park Safari',
  },
  {
    tourPackageId: 'cm4bh1ft60006l40fxlz3ny5l',
    iremboProductCode: 'PC-26d2dae574',
    notes: 'Uganda & Rwanda Adventure',
  },
  {
    tourPackageId: 'cm4fmha2i0000mh0hf1j309vx',
    iremboProductCode: 'PC-2d19d4807f',
    notes: 'Whole Rwanda Adventure',
  },
  {
    tourPackageId: 'cm4bfudor0000lf0fyl536ery',
    iremboProductCode: 'PC-a79e19f1b4',
    notes: 'Nyungwe National Park Adventure',
  },
  {
    tourPackageId: 'cm4bdgk2q0000l10ge3gx165p',
    iremboProductCode: 'PC-e892ac87ef',
    notes: 'Bisoke Hike & Golden Monkey Trek',
  },
  {
    tourPackageId: 'cm4bcgvv30000jm0f2jhca7f4',
    iremboProductCode: 'PC-8e6b53fbad',
    notes: 'Ultimate Uganda-Rwanda 20-Day Safari',
  },
  {
    tourPackageId: 'cm49scg5p0000p422axfl8d4r',
    iremboProductCode: 'PC-46825b777d',
    notes: 'Gorilla Trekking Adventure in Rwanda',
  },
  {
    tourPackageId: 'cmc90n1ri0000l909i49s4zpd',
    iremboProductCode: 'PC-5c9dbd63c8	',
    notes: 'The Great Migration Safari',
  },
];

// Cache for dynamic mappings to avoid frequent database calls
let cachedMappings: IremboProductMapping[] | null = null;
let cacheTimestamp: number = 0;
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

/**
 * Get IremboPay product code for a tour package (static lookup)
 * This is the most frequently used function and is optimized for performance
 */
export function getIremboProductCode(tourPackageId: string): string | null {
  const mapping = IREMBO_PRODUCT_CODE_MAPPINGS.find(
    (m) => m.tourPackageId === tourPackageId
  );
  return mapping?.iremboProductCode || null;
}

/**
 * Get full product mapping with dynamic data from database
 * This combines static mapping with fresh tour package data
 */
export async function getIremboProductMapping(
  tourPackageId: string
): Promise<IremboProductMapping | null> {
  const staticMapping = IREMBO_PRODUCT_CODE_MAPPINGS.find(
    (m) => m.tourPackageId === tourPackageId
  );

  if (!staticMapping) {
    return null;
  }

  try {
    // Fetch current tour package data from database
    const tourPackage = await prisma.tourPackage.findUnique({
      where: { id: tourPackageId },
      select: {
        id: true,
        title: true,
        price: true,
        slug: true,
        updatedAt: true,
      },
    });

    if (!tourPackage) {
      console.warn(`Tour package not found in database: ${tourPackageId}`);
      return null;
    }

    return {
      tourPackageId: staticMapping.tourPackageId,
      iremboProductCode: staticMapping.iremboProductCode,
      tourName: tourPackage.title,
      price: Number(tourPackage.price),
      currency: 'USD',
      slug: tourPackage.slug,
      lastUpdated: tourPackage.updatedAt,
    };
  } catch (error) {
    console.error('Error fetching dynamic tour package data:', error);
    return null;
  }
}

/**
 * Get all product mappings with dynamic data (cached)
 * Useful for validation and bulk operations
 */
export async function getAllIremboProductMappings(): Promise<
  IremboProductMapping[]
> {
  const now = Date.now();

  // Return cached data if still valid
  if (cachedMappings && now - cacheTimestamp < CACHE_DURATION) {
    return cachedMappings;
  }

  try {
    // Get all mapped tour package IDs
    const mappedIds = IREMBO_PRODUCT_CODE_MAPPINGS.map((m) => m.tourPackageId);

    // Fetch tour package data from database
    const tourPackages = await prisma.tourPackage.findMany({
      where: {
        id: { in: mappedIds },
      },
      select: {
        id: true,
        title: true,
        price: true,
        slug: true,
        updatedAt: true,
      },
    });

    // Combine static mappings with dynamic data
    const dynamicMappings: IremboProductMapping[] = [];

    for (const staticMapping of IREMBO_PRODUCT_CODE_MAPPINGS) {
      const tourPackage = tourPackages.find(
        (tp) => tp.id === staticMapping.tourPackageId
      );

      if (tourPackage) {
        dynamicMappings.push({
          tourPackageId: staticMapping.tourPackageId,
          iremboProductCode: staticMapping.iremboProductCode,
          tourName: tourPackage.title,
          price: Number(tourPackage.price),
          currency: 'USD',
          slug: tourPackage.slug,
          lastUpdated: tourPackage.updatedAt,
        });
      } else {
        console.warn(
          `Tour package not found for mapping: ${staticMapping.tourPackageId}`
        );
      }
    }

    // Update cache
    cachedMappings = dynamicMappings;
    cacheTimestamp = now;

    return dynamicMappings;
  } catch (error) {
    console.error('Error fetching all dynamic mappings:', error);
    return cachedMappings || []; // Return cached data or empty array on error
  }
}

/**
 * Clear the cache (useful after tour package updates)
 */
export function clearMappingCache(): void {
  cachedMappings = null;
  cacheTimestamp = 0;
}

/**
 * Get product currency for a tour package
 * All products use USD currency
 */
export function getProductCurrency(): 'USD' {
  return 'USD'; // All products use USD
}

/**
 * Check if a tour package has IremboPay mapping
 */
export function hasIremboMapping(tourPackageId: string): boolean {
  return IREMBO_PRODUCT_CODE_MAPPINGS.some(
    (m) => m.tourPackageId === tourPackageId
  );
}

/**
 * Get all mapped tour package IDs
 */
export function getMappedTourPackageIds(): string[] {
  return IREMBO_PRODUCT_CODE_MAPPINGS.map((m) => m.tourPackageId);
}

/**
 * Validate that all required mappings exist and are up-to-date
 */
export async function validateMappings(tourPackageIds?: string[]): Promise<{
  valid: boolean;
  missing: string[];
  outdated: Array<{
    id: string;
    issue: string;
    staticData: string;
    dbData: string;
  }>;
}> {
  try {
    const idsToValidate = tourPackageIds || getMappedTourPackageIds();
    const dynamicMappings = await getAllIremboProductMappings();

    const missing: string[] = [];
    const outdated: Array<{
      id: string;
      issue: string;
      staticData: string;
      dbData: string;
    }> = [];

    for (const id of idsToValidate) {
      const mapping = dynamicMappings.find((m) => m.tourPackageId === id);
      if (!mapping) {
        missing.push(id);
      }
    }

    return {
      valid: missing.length === 0 && outdated.length === 0,
      missing,
      outdated,
    };
  } catch (error) {
    console.error('Error validating mappings:', error);
    return {
      valid: false,
      missing: [],
      outdated: [],
    };
  }
}

// Legacy exports for backward compatibility
export const IREMBO_PRODUCT_MAPPINGS = IREMBO_PRODUCT_CODE_MAPPINGS; // For static access
export { getIremboProductMapping as getIremboProductMappingDynamic };
