import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/auth';

export async function DELETE() {
  try {
    // Check if user is authenticated and is admin
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }

    // Get user role (assuming you have a role field in your user model)
    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: { role: true },
    });

    if (user?.role !== 'ADMIN') {
      return NextResponse.json(
        { error: 'Admin access required' },
        { status: 403 }
      );
    }

    // Delete all bookings and related records in a transaction
    const result = await prisma.$transaction(async (tx) => {
      // First, delete all payment events related to bookings
      const paymentEventsDeleted = await tx.paymentEvent.deleteMany({});

      // Then, delete all audit logs related to bookings
      const auditLogsDeleted = await tx.auditLog.deleteMany({
        where: {
          bookingId: {
            not: null,
          },
        },
      });

      // Finally, delete all bookings
      const bookingsDeleted = await tx.booking.deleteMany({});

      return {
        bookingsDeleted: bookingsDeleted.count,
        paymentEventsDeleted: paymentEventsDeleted.count,
        auditLogsDeleted: auditLogsDeleted.count,
      };
    });

    return NextResponse.json({
      success: true,
      message: `Successfully deleted ${result.bookingsDeleted} bookings, ${result.paymentEventsDeleted} payment events, and ${result.auditLogsDeleted} audit logs`,
      deletedCounts: result,
    });
  } catch (error) {
    console.error('Failed to delete all bookings:', error);
    return NextResponse.json(
      { error: 'Failed to delete all bookings' },
      { status: 500 }
    );
  }
}
