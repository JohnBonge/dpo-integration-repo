import { prisma } from '@/lib/prisma';
import { Prisma } from '@prisma/client';

interface AuditLogData {
  action: string;
  tourId?: string;
  bookingId?: string;
  metadata: Record<string, unknown>;
}

export async function createAuditLog(data: AuditLogData) {
  try {
    return await prisma.auditLog.create({
      data: {
        action: data.action,
        bookingId: data.bookingId,
        metadata: data.metadata
          ? (data.metadata as Prisma.InputJsonValue)
          : Prisma.JsonNull,
      },
    });
  } catch (error) {
    console.error('Failed to create audit log:', error);
  }
}

export const AuditLogActions = {
  TOUR_CREATED: 'TOUR_CREATED',
  TOUR_UPDATED: 'TOUR_UPDATED',
  TOUR_DELETED: 'TOUR_DELETED',
  BOOKING_CREATED: 'BOOKING_CREATED',
  BOOKING_UPDATED: 'BOOKING_UPDATED',
  BOOKING_CANCELLED: 'BOOKING_CANCELLED',
  PAYMENT_INITIATED: 'PAYMENT_INITIATED',
  PAYMENT_COMPLETED: 'PAYMENT_COMPLETED',
  PAYMENT_FAILED: 'PAYMENT_FAILED',
} as const;

export type AuditLogAction =
  (typeof AuditLogActions)[keyof typeof AuditLogActions];
