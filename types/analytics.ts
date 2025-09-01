export interface ChartData {
  name: string;
  value: number;
}

export interface AnalyticsMessage {
  bookings: number;
  revenue: number;
  customers: number;
  chartData: ChartData[];
}
