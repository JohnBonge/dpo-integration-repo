interface PaymentEvent {
  type: 'PAYMENT_STATUS';
  data: {
    type: string;
    bookingId: string;
    customerName: string;
    amount: number;
    timestamp: string;
    metadata?: Record<string, string | number | boolean>;
  };
}

export function broadcastPaymentEvent(event: PaymentEvent): void {
  try {
    // If you're using Server-Sent Events (SSE)
    const eventData = JSON.stringify(event);
    console.log('Broadcasting payment event:', eventData);

    // If you have a WebSocket server
    // webSocketServer.broadcast(eventData);

    // If you're using a service like Pusher
    // pusherClient.trigger('payments', event.type, event.data);
  } catch (error) {
    console.error('Failed to broadcast payment event:', error);
  }
}
