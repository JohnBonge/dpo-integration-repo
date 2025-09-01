import { Suspense } from 'react';
import { FeaturedToursSection } from '@/components/home/featured-tours-section';
import { PaymentToast } from '@/components/payment/payment-toast';
import Hero from '@/components/home/Hero';
import About from '@/components/home/About';
import CtaSection from '@/components/home/CtaSection';
import { TrustBadges } from '@/components/home/TrustBadges';
import { HotelPartners } from '@/components/home/HotelPartners';
import { HomePageSkeleton } from '@/components/skeletons/home-page-skeleton';

export default function HomePage() {
  return (
    <Suspense fallback={<HomePageSkeleton />}>
      <PaymentToast />
      <Hero />
      <HotelPartners />
      <FeaturedToursSection />
      <About />
      <TrustBadges />
      <CtaSection />
    </Suspense>
  );
}
