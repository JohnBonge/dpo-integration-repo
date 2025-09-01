import { Server as HTTPServer } from 'http';
import WebSocket from 'ws';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

interface BookingDetailsMessage {
  type: 'bookingDetails';
  data: {
    bookings: Array<{
      bookingDate: string;
      totalAmount: number;
      depositAmount: number;
      clientName: string;
      clientEmail: string;
      participants: number;
    }>;
  };
}

export function setupWebSocketServer(httpServer: HTTPServer) {
  const wss = new WebSocket.Server({ server: httpServer });

  wss.on('connection', (ws: WebSocket) => {
    console.log('Client connected');

    const sendBookingDetails = async () => {
      try {
        const bookings = await prisma.booking
          .findMany({
            select: {
              createdAt: true,
              totalAmount: true,
              customerName: true,
              customerEmail: true,
              participants: true,
            },
          } as const)
          .then((bookings) => {
            return bookings.map((booking) => ({
              bookingDate: (booking.createdAt as Date).toISOString(),
              totalAmount: Number(booking.totalAmount),
              depositAmount: Number(booking.totalAmount) * 0.5,
              clientName: booking.customerName as string,
              clientEmail: booking.customerEmail as string,
              participants: Number(booking.participants),
            }));
          });

        const message: BookingDetailsMessage = {
          type: 'bookingDetails',
          data: {
            bookings: bookings,
          },
        };

        ws.send(JSON.stringify(message));
      } catch (error) {
        console.error('Error sending booking details:', error);
      }
    };

    // Send initial booking details
    sendBookingDetails();

    // Update booking details every 30 seconds
    const interval = setInterval(sendBookingDetails, 30000);

    ws.on('close', () => {
      console.log('Client disconnected');
      clearInterval(interval);
    });
  });

  return wss;
}
