import { z } from 'zod';

interface ItineraryItem {
  day: number;
  title: string;
  description: string;
}

export function validatePrice(
  price: number | string | { toString: () => string } | undefined
): number {
  if (price === undefined) {
    throw new Error('Price is required');
  }

  const numPrice = typeof price === 'number' ? price : Number(price.toString());

  if (isNaN(numPrice)) {
    throw new Error('Invalid price format');
  }

  if (numPrice < 0) {
    throw new Error('Price cannot be negative');
  }

  return numPrice;
}

export function validateDates(dates: Date[] | undefined): Date[] {
  if (!dates || !Array.isArray(dates)) {
    return [];
  }

  return dates.map((date) => {
    const validDate = new Date(date);
    if (isNaN(validDate.getTime())) {
      throw new Error('Invalid date format');
    }
    return validDate;
  });
}

export function validateItineraryOrder(
  itinerary: ItineraryItem[] | undefined
): boolean {
  if (!itinerary || !Array.isArray(itinerary)) {
    return true;
  }

  if (itinerary.length === 0) {
    return true;
  }

  const days = itinerary.map((item) => item.day);
  const sortedDays = [...days].sort((a, b) => a - b);

  return days.every((day, index) => day === sortedDays[index]);
}

export function validateRequiredFields<T extends Record<string, unknown>>(
  data: T,
  requiredFields: (keyof T)[]
): void {
  for (const field of requiredFields) {
    if (data[field] === undefined || data[field] === null) {
      throw new Error(`${String(field)} is required`);
    }
  }
}

// Enhanced input sanitization and validation utilities

/**
 * Sanitize HTML content to prevent XSS attacks
 */
export function sanitizeHtml(content: string): string {
  // Basic HTML sanitization without external dependency
  return content
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
    .replace(/<[^>]*>/g, '')
    .trim();
}

/**
 * Sanitize and validate email addresses
 */
export function sanitizeEmail(email: string): string {
  return email
    .trim()
    .toLowerCase()
    .replace(/[^\w@.-]/g, '');
}

/**
 * Sanitize phone numbers (keep only digits and + symbol)
 */
export function sanitizePhone(phone: string): string {
  return phone.replace(/[^\d+\s-()]/g, '');
}

/**
 * Sanitize names (remove special characters but keep spaces, hyphens, apostrophes)
 */
export function sanitizeName(name: string): string {
  return name.trim().replace(/[^a-zA-Z\s'-]/g, '');
}

/**
 * Sanitize monetary amounts
 */
export function sanitizeAmount(amount: string | number): number {
  const num = typeof amount === 'string' ? parseFloat(amount) : amount;
  if (isNaN(num) || num < 0) {
    throw new Error('Invalid amount');
  }
  return Math.round(num * 100) / 100; // Round to 2 decimal places
}

/**
 * Validate and sanitize booking data
 */
export const bookingValidationSchema = z.object({
  tourPackageId: z.string().uuid('Invalid tour package ID'),
  customerName: z
    .string()
    .min(1, 'Name is required')
    .max(100, 'Name too long')
    .transform(sanitizeName),
  customerEmail: z
    .string()
    .email('Invalid email format')
    .transform(sanitizeEmail),
  participants: z
    .number()
    .int('Participants must be a whole number')
    .min(1, 'At least 1 participant required')
    .max(50, 'Maximum 50 participants'),
  startDate: z
    .string()
    .min(1, 'Date is required')
    .refine((date) => {
      const parsedDate = new Date(date);
      return !isNaN(parsedDate.getTime()) && parsedDate > new Date();
    }, 'Invalid or past date'),
  phone: z
    .string()
    .optional()
    .transform((phone) => (phone ? sanitizePhone(phone) : undefined)),
  country: z
    .string()
    .optional()
    .transform((country) => country?.trim()),
});

/**
 * Validate and sanitize contact form data
 */
export const contactValidationSchema = z.object({
  firstName: z
    .string()
    .min(1, 'First name is required')
    .max(50, 'First name too long')
    .transform(sanitizeName),
  lastName: z
    .string()
    .min(1, 'Last name is required')
    .max(50, 'Last name too long')
    .transform(sanitizeName),
  email: z.string().email('Invalid email format').transform(sanitizeEmail),
  message: z
    .string()
    .min(10, 'Message must be at least 10 characters')
    .max(2000, 'Message too long')
    .transform(sanitizeHtml),
  company: z
    .string()
    .optional()
    .transform((company) => company?.trim()),
  position: z
    .string()
    .optional()
    .transform((position) => position?.trim()),
  groupSize: z
    .number()
    .optional()
    .refine(
      (size) => !size || (size > 0 && size <= 1000),
      'Invalid group size'
    ),
});

/**
 * Validate payment amounts securely
 */
export const paymentValidationSchema = z.object({
  amount: z
    .number()
    .positive('Amount must be positive')
    .max(100000, 'Amount too large')
    .transform(sanitizeAmount),
  currency: z.enum(['USD', 'RWF'], { message: 'Invalid currency' }),
  bookingId: z.string().uuid('Invalid booking ID'),
});

/**
 * Rate limiting validation
 */
export function validateRateLimit(identifier: string): boolean {
  // Basic identifier validation (IP address or user ID)
  const ipRegex = /^(?:[0-9]{1,3}\.){3}[0-9]{1,3}$/;
  const uuidRegex =
    /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

  return (
    ipRegex.test(identifier) ||
    uuidRegex.test(identifier) ||
    identifier === 'anonymous'
  );
}

/**
 * Validate file uploads (if implemented)
 */
export const fileValidationSchema = z.object({
  filename: z
    .string()
    .min(1, 'Filename required')
    .max(255, 'Filename too long')
    .refine((name) => /^[a-zA-Z0-9._-]+$/.test(name), 'Invalid filename'),
  size: z.number().max(5 * 1024 * 1024, 'File too large (max 5MB)'), // 5MB limit
  type: z.enum(['image/jpeg', 'image/png', 'image/webp', 'application/pdf'], {
    message: 'Invalid file type',
  }),
});

/**
 * Secure password validation
 */
export const passwordValidationSchema = z
  .string()
  .min(8, 'Password must be at least 8 characters')
  .max(128, 'Password too long')
  .refine(
    (password) => /[a-z]/.test(password),
    'Password must contain lowercase letter'
  )
  .refine(
    (password) => /[A-Z]/.test(password),
    'Password must contain uppercase letter'
  )
  .refine((password) => /[0-9]/.test(password), 'Password must contain number')
  .refine(
    (password) => /[^a-zA-Z0-9]/.test(password),
    'Password must contain special character'
  );

/**
 * Generic API response sanitizer
 */
export function sanitizeApiResponse<T>(data: T): T {
  if (typeof data === 'object' && data !== null) {
    const sanitized = { ...data } as Record<string, unknown>;

    // Remove sensitive fields from any response
    delete sanitized.password;
    delete sanitized.passwordHash;
    delete sanitized.secret;
    delete sanitized.secretKey;
    delete sanitized.token;
    delete sanitized.refreshToken;

    return sanitized as T;
  }

  return data;
}
