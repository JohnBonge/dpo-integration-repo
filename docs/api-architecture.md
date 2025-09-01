# 🌐 API Architecture

## Overview

The API architecture follows **Next.js 14 App Router** conventions with RESTful principles. Built with TypeScript for type safety, Zod for validation, and comprehensive error handling patterns.

## 🗂️ Route Structure

```
/api/
├── auth/                    # Authentication & Session Management
│   ├── [...nextauth]/      # NextAuth.js integration
│   │   ├── auth.ts         # Auth configuration
│   │   └── route.ts        # Auth handlers
│   ├── session/route.ts    # Session validation
│   ├── logout/route.ts     # Logout handler
│   ├── signout/route.ts    # Sign out handler
│   └── verify-email/route.ts # Email verification
├── bookings/               # Booking Management
│   ├── route.ts           # GET/POST bookings
│   ├── [id]/route.ts      # Individual booking CRUD
│   └── confirm/route.ts   # Booking confirmation
├── tours/                 # Tour Package Management
│   ├── route.ts          # Tours CRUD
│   ├── [slug]/route.ts   # Individual tour operations
│   └── search/route.ts   # Tour search functionality
├── payments/              # Payment Processing
│   ├── initialize/route.ts # Payment initialization
│   └── webhook/route.ts   # Payment webhooks
├── stories/               # Community Stories
│   ├── route.ts          # Stories CRUD
│   └── [id]/route.ts     # Individual story operations
├── reviews/route.ts       # Tour Reviews
├── faqs/                  # FAQ Management
│   ├── route.ts          # FAQs CRUD
│   └── [id]/route.ts     # Individual FAQ operations
├── users/                 # User Management
│   ├── profile/route.ts  # User profile
│   ├── change-password/route.ts # Password updates
│   └── delete/route.ts   # Account deletion
├── contact/route.ts       # Contact form handler
└── upload/route.ts        # File upload handler
```

## 🛠️ API Patterns

### Request/Response Pattern

```typescript
// Standard API route structure
export async function GET(request: Request) {
  try {
    // 1. Authentication check
    // 2. Input validation
    // 3. Business logic
    // 4. Database operations
    // 5. Response formatting
    return NextResponse.json(data);
  } catch (error) {
    return handleError(error);
  }
}
```

### Validation with Zod

```typescript
const createBookingSchema = z.object({
  tourId: z.string(),
  customerName: z.string().min(1, 'Name is required'),
  customerEmail: z.string().email('Valid email is required'),
  participants: z.number().min(1, 'At least 1 participant is required'),
  startDate: z.string().refine((date) => {
    try {
      new Date(date);
      return true;
    } catch {
      return false;
    }
  }, 'Invalid date format'),
  phone: z.string().optional(),
  country: z.string().optional(),
});
```

## 🔐 Authentication System

### NextAuth Configuration

```typescript
// app/api/auth/[...nextauth]/auth.ts
export const authOptions: AuthOptions = {
  adapter: PrismaAdapter(prisma) as Adapter,
  secret: process.env.NEXTAUTH_SECRET,
  session: { strategy: 'jwt' },
  providers: [
    CredentialsProvider({
      // Email/password authentication
      async authorize(credentials) {
        // Validate credentials and return user
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) token.role = user.role;
      return token;
    },
    async session({ session, token }) {
      if (token && session.user) {
        session.user.id = token.sub as string;
        session.user.role = token.role as string;
      }
      return session;
    },
  },
};
```

### Authentication Middleware

```typescript
// middleware.ts
export default withAuth({
  callbacks: {
    authorized: ({ token }) => !!token,
  },
});

export const config = {
  matcher: ['/dashboard/:path*'],
};
```

## 📝 Core API Endpoints

### Bookings API

```typescript
// GET /api/bookings - List all bookings
export async function GET() {
  const bookings = await prisma.booking.findMany({
    include: { tourPackage: true },
    orderBy: { createdAt: 'desc' },
  });
  return NextResponse.json(bookings);
}

// POST /api/bookings - Create new booking
export async function POST(request: Request) {
  const body = await request.json();
  const validatedData = createBookingSchema.parse(body);

  // Get tour details
  const tour = await prisma.tourPackage.findUnique({
    where: { id: validatedData.tourId },
  });

  // Calculate total amount
  const totalAmount = Number(tour.price) * validatedData.participants;

  // Create booking
  const booking = await prisma.booking.create({
    data: {
      ...validatedData,
      totalAmount: new Prisma.Decimal(totalAmount),
      status: BookingStatus.PENDING,
      paymentStatus: PaymentStatus.PENDING,
    },
  });

  return NextResponse.json(booking);
}
```

### Tours API

```typescript
// GET /api/tours - List all tours
export async function GET() {
  const tours = await prisma.tourPackage.findMany({
    include: {
      itinerary: true,
      reviews: {
        select: { rating: true },
      },
    },
    orderBy: { createdAt: 'desc' },
  });

  return NextResponse.json(tours);
}

// GET /api/tours/[slug] - Get single tour
export async function GET(
  request: Request,
  { params }: { params: { slug: string } }
) {
  const tour = await prisma.tourPackage.findUnique({
    where: { slug: params.slug },
    include: {
      itinerary: { orderBy: { day: 'asc' } },
      reviews: true,
    },
  });

  if (!tour) {
    return NextResponse.json({ error: 'Tour not found' }, { status: 404 });
  }

  return NextResponse.json(tour);
}
```

### Payment API

```typescript
// POST /api/payments/initialize - Initialize payment
export async function POST(request: Request) {
  const { bookingId } = await request.json();

  const booking = await prisma.booking.findUnique({
    where: { id: bookingId },
    include: { tourPackage: true },
  });

  // Create IremboPay payment invoice
  const { invoiceId, paymentUrl } = await createChargeToken({
    amount: Number(booking.totalAmount),
    currency: 'RWF',
    companyRef: booking.id,
    customerEmail: booking.customerEmail,
    // ... other payment data
  });

  return NextResponse.json({ token, paymentUrl });
}

// POST /api/payments/webhook - Handle payment webhooks
export async function POST(request: Request) {
  const body = await request.text();

  // Verify webhook signature
  // Parse payment data
  // Update booking status
  // Send confirmation email

  return NextResponse.json({ received: true });
}
```

## 🎯 Validation Schemas

### Booking Validation

```typescript
// lib/validations/booking.ts
export const bookingSchema = z.object({
  tourPackageId: z.string(),
  customerName: z.string().min(1, 'Name is required'),
  customerEmail: z.string().email('Valid email is required'),
  participants: z.number().min(1, 'At least 1 participant is required'),
  startDate: z.string().min(1, 'Please select a date'),
  phone: z.string().optional(),
  country: z.string().optional(),
});
```

### Tour Validation

```typescript
// lib/validations/tour.ts
export const tourSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  description: z.string().min(1, 'Description is required'),
  duration: z.number().min(1, 'Duration must be at least 1 day'),
  price: z.number().min(0, 'Price must be 0 or greater'),
  location: z.string().min(1, 'Location is required'),
  coverImage: z.string().url('Must be a valid URL'),
  dates: z.array(z.date()).optional(),
  itinerary: z
    .array(
      z.object({
        day: z.number(),
        title: z.string().min(1, 'Title is required'),
        description: z.string().min(1, 'Description is required'),
      })
    )
    .optional(),
});
```

## ❌ Error Handling

### Custom Error Classes

```typescript
// lib/errors/api-error.ts
export class APIError extends Error {
  constructor(
    message: string,
    public code: string,
    public statusCode: number = 500,
    public details?: unknown
  ) {
    super(message);
    this.name = 'APIError';
  }
}

export class ValidationError extends APIError {
  constructor(message: string, details?: unknown) {
    super(message, 'VALIDATION_ERROR', 400, details);
  }
}
```

### Error Handler

```typescript
function handleError(error: unknown) {
  console.error('API Error:', error);

  if (error instanceof z.ZodError) {
    return NextResponse.json(
      { error: 'Validation failed', details: error.errors },
      { status: 400 }
    );
  }

  if (error instanceof APIError) {
    return NextResponse.json(
      { error: error.message, code: error.code },
      { status: error.statusCode }
    );
  }

  return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
}
```

## 🔒 Security Patterns

### Rate Limiting

```typescript
// middleware/rate-limit.ts
import { Ratelimit } from '@upstash/ratelimit';

const ratelimit = new Ratelimit({
  redis: Redis.fromEnv(),
  limiter: Ratelimit.slidingWindow(10, '10 s'),
});

export async function rateLimit(request: Request) {
  const identifier = request.headers.get('x-forwarded-for') ?? 'anonymous';
  const { success } = await ratelimit.limit(identifier);

  if (!success) {
    throw new APIError('Too many requests', 'RATE_LIMIT', 429);
  }
}
```

### Input Sanitization

```typescript
// lib/utils/sanitize.ts
export function sanitizeString(value: string): string {
  return value.trim().replace(/[<>]/g, '');
}

export function sanitizeEmail(email: string): string {
  return email.toLowerCase().trim();
}
```

## 📊 Response Patterns

### Success Response

```typescript
// Standard success response
{
  data: T,
  message?: string,
  meta?: {
    total?: number,
    page?: number,
    limit?: number
  }
}
```

### Error Response

```typescript
// Standard error response
{
  error: string,
  code?: string,
  details?: unknown,
  timestamp?: string
}
```

### Pagination

```typescript
// Paginated response pattern
export async function getPaginatedTours(page: number, limit: number) {
  const skip = (page - 1) * limit;

  const [tours, total] = await Promise.all([
    prisma.tourPackage.findMany({
      skip,
      take: limit,
      orderBy: { createdAt: 'desc' },
    }),
    prisma.tourPackage.count(),
  ]);

  return {
    data: tours,
    meta: {
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    },
  };
}
```

## 🚀 Performance Optimizations

### Database Query Optimization

```typescript
// Selective field inclusion
const tours = await prisma.tourPackage.findMany({
  select: {
    id: true,
    title: true,
    slug: true,
    price: true,
    coverImage: true,
    // Only select needed fields
  },
});

// Use transactions for multi-table operations
await prisma.$transaction(async (tx) => {
  const booking = await tx.booking.create({ data: bookingData });
  await tx.paymentEvent.create({ data: eventData });
});
```

### Caching Strategy

```typescript
// Cache frequently accessed data
import { cache } from 'react';

export const getFeaturedTours = cache(async () => {
  return prisma.tourPackage.findMany({
    where: { featured: true },
    take: 6,
  });
});
```

## 🔧 Development Tools

### API Testing

```bash
# Test endpoints with curl
curl -X GET http://localhost:3000/api/tours \
  -H "Content-Type: application/json"

curl -X POST http://localhost:3000/api/bookings \
  -H "Content-Type: application/json" \
  -d '{"tourId":"...", "customerName":"..."}'
```

### Type Generation

```typescript
// Generate API types from schemas
export type BookingInput = z.infer<typeof bookingSchema>;
export type TourInput = z.infer<typeof tourSchema>;
```

---

This API architecture provides a robust, type-safe, and scalable foundation for the tour booking platform with comprehensive error handling, validation, and security patterns.
