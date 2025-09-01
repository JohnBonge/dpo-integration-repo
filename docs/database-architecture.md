# 🗃️ Database Architecture

## Overview

The database architecture is built on **PostgreSQL** with **Prisma ORM**, following a relational model optimized for tour booking operations. The schema emphasizes data integrity, performance through strategic indexing, and clear relationships between entities.

## 🏗️ Core Models

### TourPackage

Central entity representing available tours.

```prisma
model TourPackage {
  id          String      @id @default(cuid())
  title       String
  slug        String      @unique
  description String      @db.Text
  duration    Int         // Duration in days
  price       Decimal     @db.Decimal(10, 2)
  location    String
  coverImage  String
  dates       DateTime[]  @default([])  // Available tour dates
  included    String[]    @default([])  // What's included
  excluded    String[]    @default([])  // What's excluded

  // Relations
  itinerary   Itinerary[]
  bookings    Booking[]
  reviews     Review[]
  auditLogs   AuditLog[]

  createdAt   DateTime    @default(now())
  updatedAt   DateTime    @updatedAt
}
```

**Key Features:**

- Unique slug for SEO-friendly URLs
- Array fields for flexible content (dates, included/excluded items)
- Decimal precision for accurate pricing
- Comprehensive relationship mapping

### Booking

Core transaction entity handling customer bookings.

```prisma
model Booking {
  id              String         @id @default(cuid())
  status          BookingStatus  @default(PENDING)
  customerName    String
  customerEmail   String
  phone           String?
  country         String?
  participants    Int
  startDate       DateTime
  totalAmount     Decimal
  paymentStatus   PaymentStatus  @default(PENDING)
  paymentIntentId String?

  // Foreign Keys
  tourPackageId   String
  userId          String

  // Relations
  tourPackage     TourPackage    @relation(fields: [tourPackageId], references: [id])
  user            User           @relation(fields: [userId], references: [id])
  paymentEvents   PaymentEvent[]
  auditLogs       AuditLog[]

  // Timestamps
  paidAt          DateTime?
  confirmedAt     DateTime?
  cancelledAt     DateTime?
  createdAt       DateTime       @default(now())
  updatedAt       DateTime       @updatedAt

  // Performance Indexes
  @@index([tourPackageId])
  @@index([userId])
  @@index([createdAt])
  @@index([startDate])
  @@index([status])
  @@index([status, createdAt])  // Composite index for filtering
}
```

**Key Features:**

- Comprehensive status tracking with timestamps
- Strategic indexing for common query patterns
- Optional phone/country for international bookings
- Audit trail through payment events and logs

### User

User management with role-based access control.

```prisma
model User {
  id                 String              @id @default(cuid())
  name               String?
  email              String?             @unique
  emailVerified      DateTime?
  password           String?
  role               String              @default("USER")
  image              String?
  phone              String?
  country            String?

  // NextAuth Relations
  accounts           Account[]
  sessions           Session[]
  verificationTokens VerificationToken[]

  // App Relations
  bookings           Booking[]
  reviews            Review[]

  @@index([email])
}
```

**Key Features:**

- NextAuth.js integration
- Role-based access (ADMIN, USER, GUEST)
- Optional fields for flexibility
- Email verification support

## 📊 Supporting Models

### Itinerary

Detailed day-by-day tour planning.

```prisma
model Itinerary {
  id            String      @id @default(cuid())
  day           Int
  title         String
  description   String      @db.Text
  tourPackageId String
  tourPackage   TourPackage @relation(fields: [tourPackageId], references: [id], onDelete: Cascade)
  createdAt     DateTime    @default(now())
  updatedAt     DateTime    @updatedAt
}
```

### Review

Customer feedback and ratings.

```prisma
model Review {
  id            String      @id @default(cuid())
  rating        Int         // 1-5 rating scale
  comment       String      @db.Text
  authorName    String
  source        String      // "website", "google", etc.
  tourPackageId String
  userId        String

  tourPackage   TourPackage @relation(fields: [tourPackageId], references: [id], onDelete: Cascade)
  user          User        @relation(fields: [userId], references: [id])

  createdAt     DateTime    @default(now())
  updatedAt     DateTime    @updatedAt

  @@index([userId])
}
```

### Story

Community-generated content.

```prisma
model Story {
  id          String      @id @default(cuid())
  title       String
  slug        String      @unique
  content     String      @db.Text
  image       String?
  status      StoryStatus @default(PENDING)
  authorName  String
  authorEmail String
  createdAt   DateTime    @default(now())
  updatedAt   DateTime    @updatedAt

  // Performance Indexes
  @@index([status])
  @@index([authorEmail])
  @@index([createdAt])
  @@index([status, createdAt])
  @@index([slug])
}
```

## 🏷️ Enums

### BookingStatus

```prisma
enum BookingStatus {
  PENDING     // Initial state
  CONFIRMED   // Payment successful
  CANCELLED   // Cancelled by user/admin
  COMPLETED   // Tour completed
  DISPUTED    // Payment/service dispute
}
```

### PaymentStatus

```prisma
enum PaymentStatus {
  PENDING     // Awaiting payment
  PROCESSING  // Payment in progress
  PAID        // Payment successful
  FAILED      // Payment failed
  REFUNDED    // Payment refunded
}
```

### StoryStatus

```prisma
enum StoryStatus {
  PENDING   // Awaiting moderation
  APPROVED  // Published
  REJECTED  // Rejected by moderator
}
```

## 🔄 Audit & Tracking

### PaymentEvent

Detailed payment transaction logging.

```prisma
model PaymentEvent {
  id        String   @id @default(cuid())
  createdAt DateTime @default(now())
  bookingId String
  booking   Booking  @relation(fields: [bookingId], references: [id])
  event     String   // Event type (e.g., "PAYMENT_INITIATED")
  metadata  Json?    // Additional event data

  @@index([bookingId])
}
```

### AuditLog

System-wide activity tracking.

```prisma
model AuditLog {
  id          String       @id @default(cuid())
  createdAt   DateTime     @default(now())
  action      String       // Action performed
  bookingId   String?
  tourId      String?
  metadata    Json?        // Additional context

  booking     Booking?     @relation(fields: [bookingId], references: [id])
  tourPackage TourPackage? @relation(fields: [tourId], references: [id])

  @@index([bookingId])
  @@index([tourId])
}
```

## 📈 Performance Optimizations

### Strategic Indexing

- **Booking queries**: Status, date ranges, customer lookups
- **Tour queries**: Slug-based routing, location filtering
- **Story moderation**: Status-based filtering
- **User queries**: Email-based authentication

### Query Patterns

```typescript
// Common query optimizations
const recentBookings = await prisma.booking.findMany({
  where: {
    status: 'CONFIRMED',
    createdAt: { gte: lastWeek },
  },
  include: { tourPackage: true },
  orderBy: { createdAt: 'desc' },
});
```

## 🔐 Data Integrity

### Constraints

- Unique email addresses for users
- Unique slugs for tours and stories
- Foreign key constraints with cascade deletes where appropriate
- Non-null validation for critical fields

### Validation Layers

1. **Database Level**: Prisma schema constraints
2. **Application Level**: Zod validation schemas
3. **API Level**: Request validation middleware

## 🚀 Migration Strategy

### Schema Evolution

```bash
# Generate migration
npx prisma migrate dev --name add_new_feature

# Deploy to production
npx prisma migrate deploy
```

### Seeding

```typescript
// prisma/seed.ts - Sample data for development
const sampleTours = [
  {
    title: 'Gorilla Trekking Adventure',
    slug: 'gorilla-trekking-adventure',
    duration: 3,
    price: 1200,
    location: 'Bwindi Impenetrable Forest',
  },
];
```

## 📋 Best Practices

1. **Always use transactions** for multi-table operations
2. **Include relations selectively** to avoid N+1 queries
3. **Use composite indexes** for complex filtering
4. **Implement soft deletes** for critical data
5. **Regular backup scheduling** for production data
6. **Monitor query performance** with Prisma metrics

## 🔧 Development Tools

### Prisma Studio

```bash
npx prisma studio
```

Visual database browser for development.

### Database Reset

```bash
npx prisma migrate reset
```

Reset database and re-run all migrations.

### Schema Validation

```bash
npx prisma validate
```

Validate schema file for errors.

---

This database architecture provides a solid foundation for the tour booking platform, with careful consideration for performance, data integrity, and future extensibility.
