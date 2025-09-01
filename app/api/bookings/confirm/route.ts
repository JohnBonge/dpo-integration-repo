import { prisma } from '@/lib/prisma';
import { NextResponse } from 'next/server';
import { z } from 'zod';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/auth';

// Define the expected shape of the booking data
const bookingSchema = z.object({
  tourPackageId: z.string(),
  startDate: z.string().transform((str) => new Date(str)),
  participants: z.number().min(1),
  customerName: z.string().min(1),
  customerEmail: z.string().email(),
  phone: z.string().optional(),
  country: z.string().optional(),
});

export const dynamic = 'force-dynamic';

export async function POST(request: Request) {
  try {
    // Check if request body exists
    if (!request.body) {
      return NextResponse.json(
        { error: 'Request body is required' },
        { status: 400 }
      );
    }

    // Get the current session
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }

    // Parse and validate the request body
    const data = await request.json();
    const validationResult = bookingSchema.safeParse(data);

    if (!validationResult.success) {
      return NextResponse.json(
        { error: 'Invalid data', details: validationResult.error.errors },
        { status: 400 }
      );
    }

    // Get the tour package to calculate total amount
    const tourPackage = await prisma.tourPackage.findUnique({
      where: { id: validationResult.data.tourPackageId },
    });

    if (!tourPackage) {
      return NextResponse.json(
        { error: 'Tour package not found' },
        { status: 404 }
      );
    }

    const totalAmount =
      Number(tourPackage.price) * validationResult.data.participants;

    // Create the booking
    const booking = await prisma.booking.create({
      data: {
        ...validationResult.data,
        status: 'PENDING',
        paymentStatus: 'PENDING',
        totalAmount,
        userId: session.user.id,
      },
      include: {
        tourPackage: true,
      },
    });

    // Serialize the response
    const serializedBooking = {
      ...booking,
      totalAmount: Number(booking.totalAmount),
      startDate: booking.startDate.toISOString(),
      createdAt: booking.createdAt.toISOString(),
      tourPackage: {
        ...booking.tourPackage,
        price: Number(booking.tourPackage.price),
        dates: booking.tourPackage.dates.map((date: Date) =>
          date.toISOString()
        ),
        createdAt: booking.tourPackage.createdAt.toISOString(),
        updatedAt: booking.tourPackage.updatedAt.toISOString(),
      },
    };

    return NextResponse.json(serializedBooking);
  } catch (error) {
    console.error('Failed to create booking:', error);
    return NextResponse.json(
      { error: 'Failed to create booking' },
      { status: 500 }
    );
  }
}
