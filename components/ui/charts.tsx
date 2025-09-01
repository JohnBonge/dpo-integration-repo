'use client';

import {
  LineChart as RechartsLineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart as RechartsBarChart,
  Bar,
} from 'recharts';
import type { ChartData } from '@/types/analytics';

interface ChartProps {
  data: ChartData[];
  height?: number;
}

export function LineChart({ data, height = 300 }: ChartProps) {
  return (
    <ResponsiveContainer width='100%' height={height}>
      <RechartsLineChart data={data}>
        <CartesianGrid strokeDasharray='3 3' />
        <XAxis dataKey='name' />
        <YAxis />
        <Tooltip />
        <Line
          type='monotone'
          dataKey='value'
          stroke='hsl(var(--primary))'
          strokeWidth={2}
        />
      </RechartsLineChart>
    </ResponsiveContainer>
  );
}

export function BarChart({ data, height = 300 }: ChartProps) {
  return (
    <ResponsiveContainer width='100%' height={height}>
      <RechartsBarChart data={data}>
        <CartesianGrid strokeDasharray='3 3' />
        <XAxis dataKey='name' />
        <YAxis />
        <Tooltip />
        <Bar dataKey='value' fill='hsl(var(--primary))' />
      </RechartsBarChart>
    </ResponsiveContainer>
  );
}
