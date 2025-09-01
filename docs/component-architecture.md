# 🧩 Component Architecture

## Overview

The component architecture follows a **feature-based organization** with reusable UI components built on **Shadcn UI** and **Radix UI** primitives. Components are designed with TypeScript for type safety, React Hook Form for form handling, and Framer Motion for animations.

## 🗂️ Component Organization

```
components/
├── auth/                    # Authentication Components
│   ├── email-verification.tsx
│   └── protected-route.tsx
├── bookings/               # Booking Management
│   ├── booking-status.tsx
│   └── payment-status.tsx
├── community/              # Community Features
│   ├── ShareStoryForm.tsx
│   └── StoryCard.tsx
├── dashboard/              # Admin Dashboard
│   ├── dashboard-nav.tsx
│   ├── main-nav.tsx
│   ├── sidebar.tsx
│   └── user-nav.tsx
├── email/                  # Email Templates
│   └── booking-confirmation.tsx
├── faq/                    # FAQ Components
│   └── faq-section.tsx
├── forms/                  # Form Components
│   ├── booking-form.tsx
│   ├── contact-form.tsx
│   ├── corporate-contact-form.tsx
│   ├── delete-account-form.tsx
│   ├── password-change-form.tsx
│   └── tour-package-form.tsx
├── home/                   # Landing Page
│   ├── About.tsx
│   ├── CtaSection.tsx
│   ├── featured-tours-section.tsx
│   ├── FeaturedTours.tsx
│   ├── Hero.tsx
│   └── TrustBadges.tsx
├── layout/                 # Layout Components
│   ├── Footer.tsx
│   └── Navbar.tsx
├── motion/                 # Animation Components
│   ├── animated-card.tsx
│   ├── animated-heading.tsx
│   ├── animated-list.tsx
│   ├── animated-section.tsx
│   ├── animated-text.tsx
│   └── page-transition.tsx
├── payment/                # Payment Components
│   ├── error-boundary.tsx
│   ├── loading.tsx
│   ├── payment-button.tsx
│   ├── payment-confirmation.tsx
│   └── payment-toast.tsx
├── providers/              # Context Providers
│   ├── auth-provider.tsx
│   └── toast-provider.tsx
├── tours/                  # Tour Components
│   ├── CorporatePackageCard.tsx
│   ├── featured-tours.tsx
│   ├── related-tours.tsx
│   ├── ReviewSection.tsx
│   ├── search-tours.tsx
│   ├── TourCard.tsx
│   ├── TourCardCompact.tsx
│   └── TourItinerary.tsx
└── ui/                     # Reusable UI Components
    ├── accordion.tsx
    ├── alert.tsx
    ├── button.tsx
    ├── card.tsx
    ├── dialog.tsx
    ├── form.tsx
    ├── input.tsx
    ├── skeleton.tsx
    └── ... (Shadcn UI components)
```

## 🎨 Design Patterns

### Component Pattern

```typescript
// Standard component structure
interface ComponentProps {
  // Props interface with strict typing
  title: string;
  variant?: 'default' | 'compact';
  onAction?: () => void;
}

export function Component({
  title,
  variant = 'default',
  onAction,
}: ComponentProps) {
  const [state, setState] = useState<StateType>();

  // Hooks and side effects
  useEffect(() => {
    // Side effect logic
  }, []);

  // Event handlers
  const handleAction = () => {
    onAction?.();
  };

  // Conditional rendering
  if (variant === 'compact') {
    return <CompactView />;
  }

  return <div className='component-container'>{/* Component JSX */}</div>;
}
```

### Form Component Pattern

```typescript
// React Hook Form + Zod validation pattern
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

const formSchema = z.object({
  field: z.string().min(1, 'Field is required'),
});

type FormData = z.infer<typeof formSchema>;

export function FormComponent() {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormData>({
    resolver: zodResolver(formSchema),
  });

  const onSubmit = async (data: FormData) => {
    // Form submission logic
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Input {...register('field')} error={errors.field?.message} />
      <Button type='submit' disabled={isSubmitting}>
        Submit
      </Button>
    </form>
  );
}
```

## 🧱 Core Components

### TourCard

Reusable tour display component with multiple variants.

```typescript
interface TourCardProps {
  tour: Pick<
    Tour,
    'id' | 'title' | 'slug' | 'price' | 'location' | 'coverImage'
  >;
  variant?: 'default' | 'compact';
}

export function TourCard({ tour, variant = 'default' }: TourCardProps) {
  const price = Number(tour.price);

  if (variant === 'compact') {
    return (
      <Link href={`/tours/${tour.slug}`}>
        <div className='flex gap-4 hover:bg-gray-50 p-2 rounded-lg'>
          <Image src={tour.coverImage} alt={tour.title} />
          <div className='flex-1'>
            <h4 className='font-medium'>{tour.title}</h4>
            <span>${price.toLocaleString()}</span>
          </div>
        </div>
      </Link>
    );
  }

  return (
    <Link href={`/tours/${tour.slug}`}>
      <Card className='hover:shadow-lg transition-shadow'>
        <div className='relative h-48'>
          <Image
            src={tour.coverImage}
            alt={tour.title}
            fill
            className='object-cover'
          />
        </div>
        <CardContent className='p-4'>
          <h3 className='font-semibold text-lg'>{tour.title}</h3>
          <p className='text-gray-600'>{tour.location}</p>
          <div className='flex justify-between items-center mt-4'>
            <span className='text-lg font-bold'>${price.toLocaleString()}</span>
            <span className='text-primary'>View Details →</span>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}
```

### BookingForm

Comprehensive booking form with country selection and validation.

```typescript
const bookingSchema = z.object({
  customerName: z.string().min(1, 'Name is required'),
  customerEmail: z.string().email('Valid email required'),
  phone: z.string().min(1, 'Phone number required'),
  country: z.string().min(1, 'Country required'),
  participants: z.number().min(1, 'At least 1 participant required'),
  startDate: z.date({ required_error: 'Please select a date' }),
});

interface BookingFormProps {
  tourId: string;
  tourPrice: number;
}

export function BookingForm({ tourId, tourPrice }: BookingFormProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [countryOptions, setCountryOptions] = useState<CountryOption[]>([]);
  const router = useRouter();

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<BookingFormData>({
    resolver: zodResolver(bookingSchema),
  });

  const participants = watch('participants', 1);
  const totalPrice = tourPrice * participants;

  // Country data fetching
  useEffect(() => {
    async function fetchCountries() {
      const response = await fetch('https://restcountries.com/v3.1/all');
      const data = await response.json();
      setCountryOptions(
        data.map((country) => ({
          value: country.name.common,
          label: country.name.common,
        }))
      );
    }
    fetchCountries();
  }, []);

  const onSubmit = async (data: BookingFormData) => {
    setIsLoading(true);
    try {
      const response = await fetch('/api/bookings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...data,
          tourId,
          startDate: data.startDate.toISOString(),
        }),
      });

      const booking = await response.json();
      router.push(`/bookings/confirm?bookingId=${booking.id}`);
    } catch (error) {
      toast.error('Failed to submit booking');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className='space-y-4'>
      <div>
        <Label htmlFor='name'>Name</Label>
        <Input
          {...register('customerName')}
          className={cn(errors.customerName && 'border-red-500')}
        />
        {errors.customerName && (
          <p className='text-red-500 text-sm'>{errors.customerName.message}</p>
        )}
      </div>

      <div>
        <Label htmlFor='email'>Email</Label>
        <Input
          type='email'
          {...register('customerEmail')}
          className={cn(errors.customerEmail && 'border-red-500')}
        />
      </div>

      <div>
        <Label>Country</Label>
        <Select
          options={countryOptions}
          onChange={(value) => setValue('country', value?.value || '')}
        />
      </div>

      <div className='flex justify-between items-center'>
        <span>Total: ${totalPrice.toLocaleString()}</span>
        <Button type='submit' disabled={isLoading}>
          {isLoading ? <Spinner /> : 'Book Now'}
        </Button>
      </div>
    </form>
  );
}
```

## 🎭 Animation Components

### AnimatedCard

Framer Motion enhanced card component.

```typescript
interface AnimatedCardProps {
  children: React.ReactNode;
  className?: string;
  delay?: number;
}

export function AnimatedCard({
  children,
  className,
  delay = 0,
}: AnimatedCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay }}
      className={cn('card', className)}
    >
      {children}
    </motion.div>
  );
}
```

### PageTransition

Page-level animation wrapper.

```typescript
export function PageTransition({ children }: { children: React.ReactNode }) {
  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      transition={{ duration: 0.3 }}
    >
      {children}
    </motion.div>
  );
}
```

## 🔐 Authentication Components

### ProtectedRoute

Route protection wrapper component.

```typescript
interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredRole?: 'ADMIN' | 'USER';
  fallback?: React.ReactNode;
}

export function ProtectedRoute({
  children,
  requiredRole = 'USER',
  fallback,
}: ProtectedRouteProps) {
  const { data: session, status } = useSession();

  if (status === 'loading') {
    return <LoadingSpinner />;
  }

  if (!session) {
    return fallback || <SignInPrompt />;
  }

  if (requiredRole === 'ADMIN' && session.user.role !== 'ADMIN') {
    return <UnauthorizedMessage />;
  }

  return <>{children}</>;
}
```

## 🏗️ Layout Components

### Navbar

Main navigation with authentication state.

```typescript
export function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const { data: session } = useSession();

  return (
    <nav className='bg-white shadow-sm'>
      <div className='container mx-auto px-4'>
        <div className='flex justify-between items-center h-16'>
          <Link href='/' className='flex items-center'>
            <Image src='/logo.png' alt='Ingoma Tours' width={40} height={40} />
          </Link>

          {/* Desktop Navigation */}
          <div className='hidden md:flex space-x-8'>
            <NavLink href='/packages'>Tours</NavLink>
            <NavLink href='/community'>Community</NavLink>
            <NavLink href='/contact'>Contact</NavLink>
          </div>

          {/* User Menu */}
          <div className='flex items-center space-x-4'>
            {session ? (
              <UserNav user={session.user} />
            ) : (
              <div className='flex space-x-2'>
                <Button variant='ghost' asChild>
                  <Link href='/auth/signin'>Sign In</Link>
                </Button>
                <Button asChild>
                  <Link href='/register'>Register</Link>
                </Button>
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button className='md:hidden' onClick={() => setIsOpen(!isOpen)}>
            {isOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isOpen && (
          <div className='md:hidden py-4 border-t'>
            <MobileNavLinks />
          </div>
        )}
      </div>
    </nav>
  );
}
```

## 🎨 UI Component Library

### Button Component

Customizable button with variants.

```typescript
const buttonVariants = cva(
  'inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors',
  {
    variants: {
      variant: {
        default: 'bg-primary text-primary-foreground hover:bg-primary/90',
        destructive:
          'bg-destructive text-destructive-foreground hover:bg-destructive/90',
        outline:
          'border border-input hover:bg-accent hover:text-accent-foreground',
        secondary:
          'bg-secondary text-secondary-foreground hover:bg-secondary/80',
        ghost: 'hover:bg-accent hover:text-accent-foreground',
        link: 'underline-offset-4 hover:underline text-primary',
      },
      size: {
        default: 'h-10 py-2 px-4',
        sm: 'h-9 px-3 rounded-md',
        lg: 'h-11 px-8 rounded-md',
        icon: 'h-10 w-10',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : 'button';
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    );
  }
);
```

## 🎯 Best Practices

### Component Composition

```typescript
// Prefer composition over complex props
export function TourSection({ children }: { children: React.ReactNode }) {
  return (
    <section className='py-12'>
      <div className='container mx-auto'>{children}</div>
    </section>
  );
}

// Usage
<TourSection>
  <TourSection.Header>
    <h2>Featured Tours</h2>
  </TourSection.Header>
  <TourSection.Grid>
    {tours.map((tour) => (
      <TourCard key={tour.id} tour={tour} />
    ))}
  </TourSection.Grid>
</TourSection>;
```

### Error Boundaries

```typescript
export class ErrorBoundary extends React.Component<
  { children: React.ReactNode; fallback?: React.ReactNode },
  { hasError: boolean }
> {
  constructor(props: any) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error) {
    return { hasError: true };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('Component error:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return this.props.fallback || <ErrorMessage />;
    }

    return this.props.children;
  }
}
```

### Loading States

```typescript
export function LoadingTourCard() {
  return (
    <Card>
      <Skeleton className='h-48 w-full' />
      <CardContent className='p-4'>
        <Skeleton className='h-4 w-3/4 mb-2' />
        <Skeleton className='h-4 w-1/2 mb-4' />
        <div className='flex justify-between'>
          <Skeleton className='h-4 w-1/4' />
          <Skeleton className='h-4 w-1/3' />
        </div>
      </CardContent>
    </Card>
  );
}
```

## 🚀 Performance Optimizations

### Lazy Loading

```typescript
// Lazy load heavy components
const DashboardChart = lazy(() => import('./DashboardChart'));

export function Dashboard() {
  return (
    <div>
      <Suspense fallback={<ChartSkeleton />}>
        <DashboardChart />
      </Suspense>
    </div>
  );
}
```

### Memoization

```typescript
// Memoize expensive components
export const TourList = memo(function TourList({ tours }: { tours: Tour[] }) {
  return (
    <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
      {tours.map((tour) => (
        <TourCard key={tour.id} tour={tour} />
      ))}
    </div>
  );
});
```

---

This component architecture provides a scalable, maintainable foundation with clear separation of concerns, reusable patterns, and consistent design principles throughout the application.
