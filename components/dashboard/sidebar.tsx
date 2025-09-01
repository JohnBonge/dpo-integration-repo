'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { signOut } from 'next-auth/react';
import { cn } from '@/lib/utils';
import {
  LayoutDashboard,
  CalendarRange,
  Users,
  Settings,
  LogOut,
  Package,
} from 'lucide-react';

const menuItems = [
  {
    title: 'Dashboard',
    href: '/dashboard',
    icon: LayoutDashboard,
  },
  {
    title: 'Tour Packages',
    href: '/dashboard/tours',
    icon: Package,
  },
  {
    title: 'Bookings',
    href: '/dashboard/bookings',
    icon: CalendarRange,
  },
  {
    title: 'Customers',
    href: '/dashboard/customers',
    icon: Users,
  },
  {
    title: 'Settings',
    href: '/dashboard/settings',
    icon: Settings,
  },
];

export function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();

  const handleSignOut = async () => {
    try {
      await signOut({
        callbackUrl: '/',
        redirect: true,
      });
    } catch (error) {
      console.error('Sign out error:', error);
      router.push('/');
    }
  };

  return (
    <div className='flex flex-col w-64 bg-white border-r min-h-screen'>
      <div className='p-6'>
        <h2 className='text-xl font-bold'>Admin Dashboard</h2>
      </div>

      <nav className='flex-1 px-4 space-y-1'>
        {menuItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                'flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium transition-colors',
                isActive
                  ? 'bg-primary text-primary-foreground'
                  : 'hover:bg-muted'
              )}
            >
              <item.icon className='h-4 w-4' />
              {item.title}
            </Link>
          );
        })}
      </nav>

      <div className='p-4 mt-auto border-t'>
        <button
          onClick={handleSignOut}
          className='flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium text-red-600 hover:bg-red-50 w-full'
        >
          <LogOut className='h-4 w-4' />
          Sign Out
        </button>
      </div>
    </div>
  );
}
