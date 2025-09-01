import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { z } from 'zod';
import { Prisma, BookingStatus, PaymentStatus } from '@prisma/client';
import type { BookingWithTour } from '@/types/booking';

const createBookingRequestSchema = z.object({
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

export async function GET() {
  try {
    const bookings = await prisma.booking.findMany({
      include: {
        tourPackage: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    return NextResponse.json(bookings);
  } catch (error) {
    console.error('Failed to fetch bookings:', error);
    return NextResponse.json(
      { error: 'Failed to fetch bookings' },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const validatedData = createBookingRequestSchema.parse(body);

    // Get tour details to calculate total amount
    const tour = await prisma.tourPackage.findUnique({
      where: { id: validatedData.tourId },
    });

    if (!tour) {
      return NextResponse.json({ error: 'Tour not found' }, { status: 404 });
    }

    const totalAmount = Number(tour.price) * validatedData.participants;

    // Get or create guest user
    let guestUser = await prisma.user.findUnique({
      where: { email: validatedData.customerEmail },
    });

    if (!guestUser) {
      guestUser = await prisma.user.create({
        data: {
          email: validatedData.customerEmail,
          name: validatedData.customerName,
          role: 'GUEST',
        },
      });
    }

    // Create the booking
    const booking = (await prisma.booking.create({
      data: {
        tourPackageId: tour.id,
        customerName: validatedData.customerName,
        customerEmail: validatedData.customerEmail,
        participants: validatedData.participants,
        startDate: new Date(validatedData.startDate),
        totalAmount: new Prisma.Decimal(totalAmount),
        status: BookingStatus.PENDING,
        paymentStatus: PaymentStatus.PENDING,
        userId: guestUser.id,
        phone: validatedData.phone ?? null,
        country: validatedData.country ?? null,
      },
      include: {
        tourPackage: true,
      },
    })) as BookingWithTour;

    const serializedBooking = {
      ...booking,
      startDate: booking.startDate.toISOString(),
      createdAt: booking.createdAt.toISOString(),
      updatedAt: booking.updatedAt.toISOString(),
      totalAmount: Number(booking.totalAmount),
      tourPackage: {
        ...booking.tourPackage,
        price: Number(booking.tourPackage.price),
        createdAt: booking.tourPackage.createdAt.toISOString(),
        updatedAt: booking.tourPackage.updatedAt.toISOString(),
      },
    };

    return NextResponse.json(serializedBooking);
  } catch (error) {
    console.error('Booking creation error:', error);
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Validation failed', details: error.errors },
        { status: 400 }
      );
    }
    return NextResponse.json(
      { error: 'Failed to create booking' },
      { status: 500 }
    );
  }
}
