# 🎯 Technical Decisions & Architecture Patterns

## Overview

This document outlines the key technical decisions, architectural patterns, and design principles that drive the Ingoma Tours platform. Each decision includes the rationale, alternatives considered, and implementation patterns.

## 🏗️ Core Architecture Decisions

### 1. Next.js 14 with App Router

**Decision**: Use Next.js 14 with the new App Router architecture
**Rationale**:

- Built-in server-side rendering and static generation
- File-based routing with layout support
- React Server Components for better performance
- Built-in API routes for full-stack development
- Excellent TypeScript support

**Alternatives Considered**:

- Traditional React SPA with separate Node.js backend
- Remix framework
- Nuxt.js (for Vue)

**Implementation Pattern**:

```typescript
// app/tours/[slug]/page.tsx - Server Component
export default async function TourPage({
  params,
}: {
  params: { slug: string };
}) {
  const tour = await getTour(params.slug); // Direct database query
  return <TourDetail tour={tour} />;
}

// Dynamic route with server-side data fetching
// No client-side JavaScript needed for initial render
```

### 2. PostgreSQL with Prisma ORM

**Decision**: PostgreSQL as primary database with Prisma as ORM
**Rationale**:

- Relational data model fits tour booking requirements
- ACID compliance for financial transactions
- Prisma provides type-safe database access
- Excellent migration system
- Strong ecosystem and community support

**Alternatives Considered**:

- MongoDB with Mongoose
- MySQL with Sequelize
- Direct SQL with query builders

**Implementation Pattern**:

```typescript
// Database-first design with Prisma schema
model Booking {
  id              String         @id @default(cuid())
  status          BookingStatus  @default(PENDING)
  paymentStatus   PaymentStatus  @default(PENDING)

  // Relations with proper constraints
  tourPackage     TourPackage    @relation(fields: [tourPackageId], references: [id])
  user            User           @relation(fields: [userId], references: [id])

  // Strategic indexing for performance
  @@index([status, createdAt])
  @@index([tourPackageId])
}
```

### 3. TypeScript-First Development

**Decision**: Full TypeScript adoption throughout the codebase
**Rationale**:

- Compile-time error detection
- Better IDE support and autocomplete
- Self-documenting code through types
- Easier refactoring and maintenance
- Better team collaboration

**Implementation Pattern**:

```typescript
// Strict type definitions for all components
interface TourCardProps {
  tour: Pick<Tour, 'id' | 'title' | 'slug' | 'price' | 'coverImage'>;
  variant?: 'default' | 'compact';
  onClick?: (tourId: string) => void;
}

// Zod schemas for runtime validation
const bookingSchema = z.object({
  tourId: z.string().min(1),
  customerEmail: z.string().email(),
  participants: z.number().min(1).max(50),
});

type BookingInput = z.infer<typeof bookingSchema>;
```

### 4. Shadcn UI + Tailwind CSS

**Decision**: Shadcn UI components with Tailwind CSS for styling
**Rationale**:

- Consistent design system
- Accessible components by default
- Customizable and themeable
- Developer-friendly utility classes
- No runtime CSS-in-JS overhead

**Alternatives Considered**:

- Material-UI (MUI)
- Chakra UI
- Custom CSS modules
- Styled Components

**Implementation Pattern**:

```typescript
// Consistent component variants using cva
const buttonVariants = cva(
  'inline-flex items-center justify-center rounded-md font-medium transition-colors',
  {
    variants: {
      variant: {
        default: 'bg-primary text-primary-foreground hover:bg-primary/90',
        outline: 'border border-input hover:bg-accent',
      },
      size: {
        default: 'h-10 px-4 py-2',
        sm: 'h-9 px-3',
        lg: 'h-11 px-8',
      },
    },
  }
);
```

### 5. NextAuth.js for Authentication

**Decision**: NextAuth.js for authentication and session management
**Rationale**:

- Built-in security best practices
- Multiple provider support
- JWT and database session strategies
- Excellent Next.js integration
- Active maintenance and community

**Implementation Pattern**:

```typescript
// Centralized auth configuration
export const authOptions: AuthOptions = {
  adapter: PrismaAdapter(prisma),
  session: { strategy: 'jwt' },
  providers: [
    CredentialsProvider({
      async authorize(credentials) {
        // Custom authentication logic
        const user = await validateCredentials(credentials);
        return user;
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      // Extend JWT with custom claims
      if (user) token.role = user.role;
      return token;
    },
  },
};
```

## 🎨 Design Pattern Decisions

### 1. Server Components First

**Decision**: Prefer React Server Components over Client Components
**Rationale**:

- Better SEO and initial page load performance
- Reduced JavaScript bundle size
- Direct database access without API layer
- Better security (sensitive operations on server)

**Implementation Pattern**:

```typescript
// app/tours/page.tsx - Server Component
export default async function ToursPage() {
  const tours = await prisma.tourPackage.findMany();
  return (
    <div>
      {tours.map((tour) => (
        <TourCard key={tour.id} tour={tour} />
      ))}
    </div>
  );
}

// Only use 'use client' when necessary
('use client');
export function InteractiveTourCard({ tour }: TourCardProps) {
  const [liked, setLiked] = useState(false);
  // Interactive functionality here
}
```

### 2. Feature-Based Component Organization

**Decision**: Organize components by feature rather than type
**Rationale**:

- Better code locality and maintainability
- Easier to understand related functionality
- Simplified imports and dependencies
- Scalable architecture

**Structure**:

```
components/
├── auth/           # Authentication components
├── bookings/       # Booking-related components
├── tours/          # Tour display components
├── payment/        # Payment flow components
├── dashboard/      # Admin dashboard components
└── ui/             # Shared UI primitives
```

### 3. Form Handling with React Hook Form + Zod

**Decision**: React Hook Form for form state, Zod for validation
**Rationale**:

- Minimal re-renders and better performance
- Type-safe validation schemas
- Consistent error handling
- Great developer experience

**Implementation Pattern**:

```typescript
const bookingSchema = z.object({
  customerName: z.string().min(1, 'Name is required'),
  customerEmail: z.string().email('Valid email required'),
  participants: z.number().min(1, 'At least 1 participant'),
});

export function BookingForm() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<BookingFormData>({
    resolver: zodResolver(bookingSchema),
  });

  const onSubmit = async (data: BookingFormData) => {
    // Type-safe form submission
  };
}
```

## 🔧 Service Integration Decisions

### 1. IremboPay Payment Gateway

**Decision**: IremboPay for payment processing
**Rationale**:

- Strong presence in African markets
- Supports local payment methods
- XML-based API (though not ideal, it works)
- Established trust and regulatory compliance

**Implementation Pattern**:

```typescript
// Centralized payment service
export class IremboPaymentService {
  async createToken(paymentData: PaymentData) {
    const xmlRequest = this.buildXMLRequest(paymentData);
    const response = await this.sendRequest(xmlRequest);
    return this.parseResponse(response);
  }

  private buildXMLRequest(data: PaymentData): string {
    // XML construction with proper escaping
  }
}
```

### 2. Cloudinary for Media Management

**Decision**: Cloudinary for image upload and transformation
**Rationale**:

- Automatic image optimization
- On-the-fly transformations
- CDN distribution
- Developer-friendly API

**Implementation Pattern**:

```typescript
// Upload with automatic optimization
export async function uploadTourImage(file: File) {
  const result = await cloudinary.uploader.upload(file.path, {
    folder: 'tours',
    transformation: [
      { width: 800, height: 600, crop: 'fill' },
      { quality: 'auto' },
      { format: 'webp' },
    ],
  });
  return result.secure_url;
}
```

### 3. Resend for Email Services

**Decision**: Resend for transactional emails
**Rationale**:

- Modern API design
- React email template support
- Good deliverability rates
- Developer-friendly pricing

**Implementation Pattern**:

```typescript
// Email service with React templates
export async function sendBookingConfirmation(booking: Booking) {
  await resend.emails.send({
    from: 'Ingoma Tours <bookings@ingomatours.com>',
    to: booking.customerEmail,
    subject: 'Booking Confirmation',
    react: BookingConfirmationEmail({ booking }),
  });
}
```

## 🚀 Performance Optimization Decisions

### 1. Static Generation + ISR

**Decision**: Use Static Generation with Incremental Static Regeneration
**Rationale**:

- Optimal performance for tour listings
- SEO benefits
- Cost-effective hosting
- Automatic revalidation

**Implementation Pattern**:

```typescript
// Static generation with revalidation
export async function generateStaticParams() {
  const tours = await prisma.tourPackage.findMany({
    select: { slug: true },
  });
  return tours.map((tour) => ({ slug: tour.slug }));
}

export const revalidate = 3600; // Revalidate every hour
```

### 2. Database Query Optimization

**Decision**: Strategic database indexes and query optimization
**Rationale**:

- Faster page loads
- Better user experience
- Reduced server costs
- Improved scalability

**Implementation Pattern**:

```typescript
// Optimized queries with selective field inclusion
const tours = await prisma.tourPackage.findMany({
  select: {
    id: true,
    title: true,
    slug: true,
    price: true,
    coverImage: true,
    // Only select needed fields
  },
  where: {
    status: 'PUBLISHED',
  },
  orderBy: {
    createdAt: 'desc',
  },
  take: 12,
});
```

### 3. Image Optimization Strategy

**Decision**: WebP format with lazy loading and responsive sizing
**Rationale**:

- Reduced bandwidth usage
- Faster page loads
- Better mobile experience
- Automatic format selection

**Implementation Pattern**:

```typescript
// Next.js Image component with optimization
<Image
  src={tour.coverImage}
  alt={tour.title}
  width={400}
  height={300}
  className='object-cover'
  loading='lazy'
  placeholder='blur'
  blurDataURL={generateBlurDataURL(tour.coverImage)}
/>
```

## 🔒 Security Decision Patterns

### 1. Input Validation Strategy

**Decision**: Multi-layer validation (client, server, database)
**Rationale**:

- Defense in depth approach
- Prevent malicious inputs
- Data integrity assurance
- Better user experience

**Implementation Pattern**:

```typescript
// Client-side validation
const schema = z.object({
  email: z.string().email(),
});

// Server-side validation
export async function POST(request: Request) {
  const body = await request.json();
  const validatedData = schema.parse(body); // Throws if invalid

  // Database constraints as final layer
  const user = await prisma.user.create({
    data: {
      email: validatedData.email, // Already validated
    },
  });
}
```

### 2. Authentication & Authorization

**Decision**: JWT-based authentication with role-based access control
**Rationale**:

- Stateless authentication
- Easy to scale horizontally
- Clear permission model
- Integration with NextAuth.js

**Implementation Pattern**:

```typescript
// Protected API route
export async function GET(request: Request) {
  const session = await getServerSession(authOptions);

  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  if (session.user.role !== 'ADMIN') {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }

  // Admin-only functionality
}
```

## 📊 Monitoring & Analytics Decisions

### 1. Error Handling Strategy

**Decision**: Centralized error handling with logging
**Rationale**:

- Consistent error responses
- Better debugging experience
- User-friendly error messages
- Monitoring and alerting

**Implementation Pattern**:

```typescript
// Custom error classes
export class APIError extends Error {
  constructor(
    message: string,
    public statusCode: number = 500,
    public code?: string
  ) {
    super(message);
  }
}

// Centralized error handler
export function handleAPIError(error: unknown) {
  if (error instanceof APIError) {
    return NextResponse.json(
      { error: error.message, code: error.code },
      { status: error.statusCode }
    );
  }

  // Log unexpected errors
  console.error('Unexpected error:', error);
  return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
}
```

### 2. Real-time Updates

**Decision**: WebSocket integration for live booking updates
**Rationale**:

- Better admin experience
- Real-time booking notifications
- Improved customer service
- Competitive advantage

**Implementation Pattern**:

```typescript
// WebSocket server for real-time updates
export class BookingWebSocketServer {
  broadcast(event: BookingEvent) {
    this.clients.forEach((client) => {
      if (client.role === 'ADMIN') {
        client.send(JSON.stringify(event));
      }
    });
  }
}

// Payment webhook triggers real-time update
await updateBookingStatus(bookingId, 'CONFIRMED');
websocketServer.broadcast({
  type: 'BOOKING_CONFIRMED',
  bookingId,
  timestamp: new Date(),
});
```

## 🎯 Future-Proofing Decisions

### 1. Modular Architecture

**Decision**: Loosely coupled, modular component architecture
**Rationale**:

- Easier to maintain and update
- Individual feature development
- Reduced risk of breaking changes
- Better testing capabilities

### 2. API-First Design

**Decision**: Well-defined API contracts between frontend and backend
**Rationale**:

- Enables mobile app development
- Third-party integrations
- Microservices migration path
- Better team collaboration

### 3. Environment-Agnostic Configuration

**Decision**: Environment variable based configuration
**Rationale**:

- Easy deployment across environments
- Security best practices
- Configuration management
- Scalability considerations

---

These technical decisions form the foundation of a robust, scalable, and maintainable tour booking platform that can grow with business requirements while maintaining code quality and developer productivity.
