# Dynamic IremboPay Product Mapping System

## 🎯 **Overview**

The dynamic product mapping system solves the problem of maintaining consistency between your tour packages in the database and IremboPay product mappings. Instead of hardcoding titles and prices that can become outdated, the system now fetches tour package data dynamically from your database.

## 🚀 **Key Benefits**

✅ **Future-Proof**: Tour package titles and prices can change without breaking payments  
✅ **Automatic Sync**: Always uses the latest data from your database  
✅ **Reduced Maintenance**: Only the essential mapping (ID → Product Code) needs manual updates  
✅ **Performance Optimized**: Includes caching to minimize database calls  
✅ **Backward Compatible**: Existing code continues to work

## 🏗️ **Architecture**

### **Before (Static Mapping)**

```typescript
const IREMBO_PRODUCT_MAPPINGS = [
  {
    tourPackageId: 'cm4fogxvw0000mm0fkuq5woap',
    iremboProductCode: 'PC-74ac3ffe8a',
    tourName: 'Kigali City Tour', // ❌ Can become outdated
    price: 200.0, // ❌ Can become outdated
    currency: 'USD',
  },
];
```

### **After (Dynamic Mapping)**

```typescript
// Static mapping - only essential business logic
const IREMBO_PRODUCT_CODE_MAPPINGS = [
  {
    tourPackageId: 'cm4fogxvw0000mm0fkuq5woap',
    iremboProductCode: 'PC-74ac3ffe8a',
    notes: 'Kigali City Tour', // ✅ Just for reference
  },
];

// Dynamic data fetched from database at runtime
const dynamicMapping = await getIremboProductMapping(tourPackageId);
// Returns: { tourName: "Current DB Title", price: CurrentDBPrice, ... }
```

## 📚 **API Reference**

### **Core Functions**

#### `getIremboProductCode(tourPackageId: string): string | null`

**Fast static lookup** for IremboPay product codes. Use this for most cases.

```typescript
const productCode = getIremboProductCode('cm4fogxvw0000mm0fkuq5woap');
// Returns: 'PC-74ac3ffe8a'
```

#### `getIremboProductMapping(tourPackageId: string): Promise<IremboProductMapping | null>`

**Dynamic lookup** that combines static mapping with current database data.

```typescript
const mapping = await getIremboProductMapping('cm4fogxvw0000mm0fkuq5woap');
// Returns:
// {
//   tourPackageId: 'cm4fogxvw0000mm0fkuq5woap',
//   iremboProductCode: 'PC-74ac3ffe8a',
//   tourName: 'Kigali city Tour',        // ✅ From database
//   price: 200,                          // ✅ From database
//   currency: 'USD',
//   slug: 'kigali-city-tour',
//   lastUpdated: '2025-01-24T...'
// }
```

#### `getAllIremboProductMappings(): Promise<IremboProductMapping[]>`

**Bulk dynamic lookup** with 5-minute caching for performance.

```typescript
const allMappings = await getAllIremboProductMappings();
// Returns array of all mappings with current database data
```

### **Cache Management**

#### `clearMappingCache(): void`

Clear the cache after tour package updates.

```typescript
// After updating tour packages
await prisma.tourPackage.update({ ... });
clearMappingCache(); // Force fresh data on next request
```

### **Validation**

#### `validateMappings(tourPackageIds?: string[]): Promise<ValidationResult>`

Validate that all mappings are complete and consistent.

```typescript
const validation = await validateMappings();
if (!validation.valid) {
  console.log('Missing mappings:', validation.missing);
  console.log('Outdated mappings:', validation.outdated);
}
```

## 🔧 **Implementation Guide**

### **1. Adding New Tour Packages**

When you add a new tour package to IremboPay dashboard:

```typescript
// Add only the essential mapping to irembopay-product-mapping.ts
{
  tourPackageId: 'new-tour-id-from-database',
  iremboProductCode: 'PC-newcode123', // From IremboPay dashboard
  notes: 'Short description for reference',
}
```

The title, price, and other details will be automatically fetched from your database!

### **2. Updating Tour Packages**

When you update tour titles or prices in your database:

```typescript
// Update in database as usual
await prisma.tourPackage.update({
  where: { id: tourId },
  data: { title: 'New Title', price: 250 },
});

// Optional: Clear cache for immediate effect
clearMappingCache();
```

No changes needed in the mapping file! 🎉

### **3. Payment Integration Example**

```typescript
// In your payment initialization
export async function initializePayment(tourPackageId: string) {
  // Fast static lookup for product code
  const productCode = getIremboProductCode(tourPackageId);

  if (!productCode) {
    throw new Error('No IremboPay mapping found');
  }

  // Optional: Get dynamic data for validation/logging
  const dynamicMapping = await getIremboProductMapping(tourPackageId);

  // Use the product code with IremboPay API
  const invoice = await createPaymentInvoice({
    productCode,
    // ... other payment data
  });
}
```

## 🛡️ **Error Handling**

The system gracefully handles various scenarios:

### **Database Connection Issues**

```typescript
const mapping = await getIremboProductMapping(tourId);
if (!mapping) {
  // Fallback: Use static product code lookup
  const productCode = getIremboProductCode(tourId);
  // Continue with reduced functionality
}
```

### **Missing Tour Packages**

```typescript
// If tour package doesn't exist in database
const mapping = await getIremboProductMapping('invalid-id');
// Returns: null (with warning logged)
```

### **Cache Failures**

```typescript
// If cache fails, system falls back to fresh database lookup
const mappings = await getAllIremboProductMappings();
// Always returns data or empty array, never throws
```

## 🚀 **Performance Optimizations**

### **Caching Strategy**

- **Static Lookups**: Instant (no database calls)
- **Dynamic Lookups**: 5-minute cache per mapping
- **Bulk Lookups**: Single database query with 5-minute cache

### **Usage Recommendations**

#### ✅ **Use Static Lookup For**

- Payment processing (performance critical)
- Quick validation checks
- High-frequency operations

```typescript
const productCode = getIremboProductCode(tourId); // Fast
```

#### ✅ **Use Dynamic Lookup For**

- Displaying current tour details
- Validation and admin operations
- When you need complete tour data

```typescript
const mapping = await getIremboProductMapping(tourId); // Complete data
```

## 🔍 **Monitoring & Validation**

### **Regular Validation**

Run the validation script to ensure all mappings are healthy:

```bash
npx tsx scripts/validate-irembopay-mappings.ts
```

Example output:

```
🔍 Validating IremboPay Product Mappings (Dynamic Version)...

📦 Found 12 tour packages in database
🗺️  Found 9 static mappings
🔄 Generated 9 dynamic mappings

📋 VALIDATION RESULTS:

❌ 3 tour package(s) missing IremboPay mappings:
   - New Safari Package (ID: cm123...)
   - Lake Kivu Tour (ID: cm456...)
   - Cultural Experience (ID: cm789...)

🔄 Current Dynamic Mappings:
   Kigali city Tour:
     ID: cm4fogxvw0000mm0fkuq5woap
     Product Code: PC-74ac3ffe8a
     Price: $200
     Last Updated: 2025-01-24T10:30:00.000Z
   ...

📊 SUMMARY:
   Total tour packages: 12
   Static mappings: 9
   Dynamic mappings: 9
   Issues found: 3

🔧 Please update the static mappings in lib/services/irembopay-product-mapping.ts
```

### **Production Monitoring**

Monitor these in your application:

```typescript
// In your application monitoring
const validation = await validateMappings();
if (!validation.valid) {
  // Alert: Some tour packages missing IremboPay mappings
  sendAlert('IremboPay mappings incomplete', validation);
}
```

## 🔄 **Migration from Static System**

The system is fully backward compatible. Existing code will continue to work:

```typescript
// These still work exactly the same
const productCode = getIremboProductCode(tourId);
const hasMaping = hasIremboMapping(tourId);
const mappedIds = getMappedTourPackageIds();
```

New dynamic features are opt-in:

```typescript
// Use new dynamic features when needed
const dynamicMapping = await getIremboProductMapping(tourId);
const allMappings = await getAllIremboProductMappings();
```

## 🎯 **Best Practices**

1. **Keep Static Mappings Minimal**: Only add essential ID → Product Code mappings
2. **Use Cache Wisely**: Clear cache after tour package updates for immediate consistency
3. **Monitor Regularly**: Run validation script weekly or after major changes
4. **Handle Errors Gracefully**: Always check for null returns from dynamic functions
5. **Performance First**: Use static lookups for payment processing

---

**Ready to use?** The system is already implemented and ready. Your existing payment flow will continue to work, and you can gradually adopt the dynamic features where beneficial! 🚀
