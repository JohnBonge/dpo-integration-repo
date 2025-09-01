/*
  Warnings:

  - The values [MANAGER] on the enum `UserRole` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "UserRole_new" AS ENUM ('ADMIN', 'USER', 'GUEST');
ALTER TYPE "UserRole" RENAME TO "UserRole_old";
ALTER TYPE "UserRole_new" RENAME TO "UserRole";
DROP TYPE "UserRole_old";
COMMIT;

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "country" TEXT,
ADD COLUMN     "phone" TEXT;

-- CreateIndex
CREATE INDEX "Booking_createdAt_idx" ON "Booking"("createdAt");

-- CreateIndex
CREATE INDEX "Booking_startDate_idx" ON "Booking"("startDate");

-- CreateIndex
CREATE INDEX "Booking_status_idx" ON "Booking"("status");

-- CreateIndex
CREATE INDEX "Booking_status_createdAt_idx" ON "Booking"("status", "createdAt");

-- CreateIndex
CREATE INDEX "Story_createdAt_idx" ON "Story"("createdAt");

-- CreateIndex
CREATE INDEX "Story_status_createdAt_idx" ON "Story"("status", "createdAt");

-- CreateIndex
CREATE INDEX "Story_slug_idx" ON "Story"("slug");

-- CreateIndex
CREATE INDEX "TourPackage_createdAt_idx" ON "TourPackage"("createdAt");

-- CreateIndex
CREATE INDEX "TourPackage_price_idx" ON "TourPackage"("price");

-- CreateIndex
CREATE INDEX "TourPackage_location_idx" ON "TourPackage"("location");

-- CreateIndex
CREATE INDEX "TourPackage_duration_idx" ON "TourPackage"("duration");

-- CreateIndex
CREATE INDEX "TourPackage_location_price_duration_idx" ON "TourPackage"("location", "price", "duration");

-- CreateIndex
CREATE INDEX "faqs_order_idx" ON "faqs"("order");

-- CreateIndex
CREATE INDEX "faqs_createdAt_idx" ON "faqs"("createdAt");

-- CreateIndex
CREATE INDEX "faqs_category_order_createdAt_idx" ON "faqs"("category", "order", "createdAt");

-- CreateIndex
CREATE INDEX "faqs_category_order_idx" ON "faqs"("category", "order");
