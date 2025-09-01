import { MainNav } from '@/components/dashboard/main-nav';
import { DashboardNav } from '@/components/dashboard/dashboard-nav';
import { UserNav } from '@/components/dashboard/user-nav';

const navItems = [
  {
    title: 'Overview',
    href: '/dashboard',
    icon: 'dashboard',
  },
  {
    title: 'Bookings',
    href: '/dashboard/bookings',
    icon: 'bookings',
  },
  {
    title: 'Tours',
    href: '/dashboard/tours',
    icon: 'tours',
  },
  {
    title: 'Stories',
    href: '/dashboard/stories',
    icon: 'stories',
  },
  {
    title: 'FAQs',
    href: '/dashboard/faqs',
    icon: 'faqs',
  },
  {
    title: 'Settings',
    href: '/dashboard/settings',
    icon: 'settings',
  },
];

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className='flex min-h-screen flex-col space-y-6'>
      <header className='sticky top-0 z-40 border-b bg-background'>
        <div className='container flex h-16 items-center justify-between py-4'>
          <MainNav />
          <UserNav />
        </div>
      </header>
      <div className='container grid flex-1 gap-12 md:grid-cols-[200px_1fr]'>
        <aside className='hidden w-[200px] flex-col md:flex'>
          <DashboardNav items={navItems} />
        </aside>
        <main className='flex w-full flex-1 flex-col overflow-hidden'>
          {children}
        </main>
      </div>
    </div>
  );
}
