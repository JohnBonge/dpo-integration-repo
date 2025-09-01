import { Inter } from 'next/font/google';
import './globals.css';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { ThemeProvider } from '@/components/theme-provider';
import { ToastProvider } from '@/components/providers/toast-provider';
import { AuthProvider } from '@/components/providers/auth-provider';
import { Providers } from './providers';

const inter = Inter({
  subsets: ['latin'],
  display: 'swap', // Improves font loading performance
  preload: true, // Explicitly enable preloading
  fallback: ['system-ui', '-apple-system', 'sans-serif'], // Better fallbacks
});

export const metadata = {
  title: 'Ingoma Tours - Discover Amazing Adventures',
  description: 'Experience unforgettable tours with Ingoma Tours',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang='en' suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider
          attribute='class'
          defaultTheme='system'
          enableSystem
          disableTransitionOnChange
        >
          <AuthProvider>
            <ToastProvider />
            <Providers>
              <div className='flex min-h-screen flex-col'>
                <Navbar />
                <main className='flex-1'>{children}</main>
                <Footer />
              </div>
            </Providers>
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
