import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { verify } from 'jsonwebtoken';
import { compare } from 'bcryptjs';
import { cookies } from 'next/headers';
import { z } from 'zod';
import { sendEmail } from '@/lib/email';

const prisma = new PrismaClient();

interface JWTPayload {
  userId: string;
}

interface UserData {
  id: string;
  email: string | null;
  password: string | null;
  bookings: { id: string }[];
  reviews: { id: string }[];
}

const deleteAccountSchema = z.object({
  password: z.string().min(1, 'Password is required'),
});

export async function POST(request: Request) {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get('auth-token')?.value;

    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const decoded = verify(token, process.env.JWT_SECRET!) as JWTPayload;

    const body = await request.json();
    const { password } = deleteAccountSchema.parse(body);

    // Get user with relations
    const user = (await prisma.user.findUnique({
      where: { id: decoded.userId },
      select: {
        id: true,
        email: true,
        password: true,
        bookings: {
          select: { id: true },
        },
        reviews: {
          select: { id: true },
        },
      },
    })) as UserData | null;

    if (!user || !user.password) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // Verify password
    const isValidPassword = await compare(
      password as string,
      user.password as string
    );

    if (!isValidPassword) {
      return NextResponse.json({ error: 'Invalid password' }, { status: 400 });
    }

    // Delete user's data in a transaction
    await prisma.$transaction([
      prisma.booking.deleteMany({
        where: { id: { in: user.bookings.map((b) => b.id) } },
      }),
      prisma.review.deleteMany({
        where: { id: { in: user.reviews.map((r) => r.id) } },
      }),
      prisma.user.delete({
        where: { id: user.id },
      }),
    ]);

    // Send account deletion confirmation
    if (user.email) {
      await sendEmail({
        to: user.email,
        subject: 'Account Deleted',
        html: 'Your account has been successfully deleted.',
      });
    }

    // Clear auth cookie
    cookieStore.delete('auth-token');

    return NextResponse.json({
      message: 'Account deleted successfully',
    });
  } catch (error) {
    console.error('Account deletion error:', error);
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Invalid data', details: error.errors },
        { status: 400 }
      );
    }
    return NextResponse.json(
      { error: 'Failed to delete account' },
      { status: 500 }
    );
  }
}
