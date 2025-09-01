import { Prisma } from '@prisma/client';

export interface TourWithItinerary
  extends Prisma.TourPackageGetPayload<{
    include: { itinerary: true };
  }> {}

export interface Tour {
  id: string;
  title: string;
  slug: string;
  description: string;
  duration: number;
  price: number;
  location: string;
  coverImage: string;
  dates: string[];
  included: string[];
  excluded: string[];
  createdAt: string;
  updatedAt: string;
  itinerary: {
    id: string;
    day: number;
    title: string;
    description: string;
  }[];
}

export interface TourCardProps {
  tour: {
    id: string;
    title: string;
    slug?: string;
    description: string;
    duration: number;
    price: number;
    location: string;
    coverImage: string;
  };
}

export type TourCreateInput = Prisma.TourPackageCreateInput;
export type TourUpdateInput = Prisma.TourPackageUpdateInput;
