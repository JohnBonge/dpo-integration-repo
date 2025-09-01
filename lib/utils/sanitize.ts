import { Decimal } from '@prisma/client/runtime/library';

type TourInputData = Partial<{
  id: string;
  title: string;
  description: string;
  duration: number;
  price: number | Decimal;
  location: string;
  coverImage: string;
  dates: Date[];
  slug: string;
  createdAt: Date;
  updatedAt: Date;
  itinerary?: Array<{
    day: number;
    title: string;
    description: string;
  }>;
}>;

export function sanitizeString(value: string): string {
  return value.trim().replace(/\s+/g, ' ');
}

export function sanitizeSlug(value: string): string {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-');
}

export function sanitizeAmount(amount: number | string): number {
  const num = typeof amount === 'string' ? parseFloat(amount) : amount;
  return Math.round(num * 100) / 100;
}

export function sanitizeEmail(email: string): string {
  return email.trim().toLowerCase();
}

export function sanitizeReference(value: string): string {
  return value
    .trim()
    .replace(/[^a-zA-Z0-9-_]/g, '')
    .toUpperCase();
}

export function sanitizeTourData(data: TourInputData) {
  return {
    ...data,
    createdAt: data.createdAt ? new Date(data.createdAt) : undefined,
    updatedAt: data.updatedAt ? new Date(data.updatedAt) : undefined,
    dates: (data.dates || []).map((date) => new Date(date)),
    price: data.price ? Number(data.price) : undefined,
  };
}
