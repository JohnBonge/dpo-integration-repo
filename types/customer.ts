export interface Customer {
  name: string;
  email: string;
  bookings: {
    tourName: string;
    date: Date;
  }[];
  totalBookings: number;
  lastBookingDate: Date;
}
