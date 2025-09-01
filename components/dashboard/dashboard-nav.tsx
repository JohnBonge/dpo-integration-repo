'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import {
  LayoutDashboard,
  BookOpen,
  Map,
  MessageSquare,
  HelpCircle,
  Settings,
} from 'lucide-react';

interface DashboardNavProps {
  items: {
    title: string;
    href: string;
    icon: string;
  }[];
}

const iconMap = {
  dashboard: LayoutDashboard,
  bookings: BookOpen,
  tours: Map,
  stories: MessageSquare,
  faqs: HelpCircle,
  settings: Settings,
};

export function DashboardNav({ items }: DashboardNavProps) {
  const path = usePathname();

  if (!items?.length) {
    return null;
  }

  return (
    <nav className='grid items-start gap-2'>
      {items.map((item) => {
        const Icon = iconMap[item.icon as keyof typeof iconMap];
        return (
          <Link key={item.href} href={item.href}>
            <span
              className={cn(
                'group flex items-center rounded-md px-3 py-2 text-sm font-medium hover:bg-accent hover:text-accent-foreground',
                path === item.href ? 'bg-accent' : 'transparent'
              )}
            >
              <Icon className='mr-2 h-4 w-4' />
              <span>{item.title}</span>
            </span>
          </Link>
        );
      })}
    </nav>
  );
}
