-- DropIndex
DROP INDEX "TourPackage_createdAt_idx";

-- DropIndex
DROP INDEX "TourPackage_duration_idx";

-- DropIndex
DROP INDEX "TourPackage_location_idx";

-- DropIndex
DROP INDEX "TourPackage_location_price_duration_idx";

-- DropIndex
DROP INDEX "TourPackage_price_idx";

-- AlterTable
ALTER TABLE "TourPackage" ADD COLUMN     "excluded" TEXT[] DEFAULT ARRAY[]::TEXT[],
ADD COLUMN     "included" TEXT[] DEFAULT ARRAY[]::TEXT[],
ALTER COLUMN "dates" SET DEFAULT ARRAY[]::TIMESTAMP(3)[];
