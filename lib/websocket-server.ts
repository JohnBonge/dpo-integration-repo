import { Server as HTTPServer } from 'http';
import WebSocket from 'ws';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

interface AnalyticsMessage {
  type: 'analytics';
  data: {
    activeUsers: number;
    recentBookings: number;
    revenue: number;
    timestamp: string;
  };
}

export function setupWebSocketServer(httpServer: HTTPServer) {
  const wss = new WebSocket.Server({ server: httpServer });

  wss.on('connection', (ws: WebSocket) => {
    console.log('Client connected');

    const sendAnalytics = async () => {
      try {
        const [activeUsers, recentBookings, todayRevenue] = await Promise.all([
          prisma.$queryRaw<[{ count: bigint }]>`
            SELECT COUNT(DISTINCT "userId") as count 
            FROM "UserActivity" 
            WHERE "createdAt" >= ${new Date(Date.now() - 15 * 60 * 1000)}
          `.then((result) => Number(result[0].count)),
          prisma.booking.count({
            where: {
              createdAt: {
                gte: new Date(Date.now() - 24 * 60 * 60 * 1000),
              },
            },
          }),
          prisma.booking.findMany({
            where: {
              createdAt: {
                gte: new Date(new Date().setHours(0, 0, 0, 0)),
              },
            },
            include: {
              tourPackage: true,
            },
          }),
        ]);

        const revenue = todayRevenue.reduce(
          (acc, booking) =>
            acc + Number(booking.tourPackage.price) * booking.participants,
          0
        );

        const message: AnalyticsMessage = {
          type: 'analytics',
          data: {
            activeUsers,
            recentBookings,
            revenue,
            timestamp: new Date().toISOString(),
          },
        };

        ws.send(JSON.stringify(message));
      } catch (error) {
        console.error('Analytics error:', error);
      }
    };

    // Send initial analytics
    sendAnalytics();

    // Update analytics every 30 seconds
    const interval = setInterval(sendAnalytics, 30000);

    ws.on('close', () => {
      console.log('Client disconnected');
      clearInterval(interval);
    });
  });

  return wss;
}
