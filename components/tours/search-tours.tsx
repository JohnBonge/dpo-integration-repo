'use client';

import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Input } from '@/components/ui/input';
import { useDebounce } from '@/hooks/use-debounce';
// import { Search, SlidersHorizontal } from 'lucide-react';
// import { Button } from '@/components/ui/button';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';
import { Label } from '@/components/ui/label';
import { Search } from 'lucide-react';

export function SearchTours() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [search, setSearch] = useState(searchParams.get('q') || '');
  const [minPrice, setMinPrice] = useState(searchParams.get('minPrice') || '0');
  const [maxPrice, setMaxPrice] = useState(
    searchParams.get('maxPrice') || '10000'
  );
  const [duration, setDuration] = useState(searchParams.get('duration') || '');
  const debouncedSearch = useDebounce(search);
  const debouncedMinPrice = useDebounce(minPrice);
  const debouncedMaxPrice = useDebounce(maxPrice);
  const debouncedDuration = useDebounce(duration);

  useEffect(() => {
    const params = new URLSearchParams(searchParams.toString());

    if (debouncedSearch) {
      params.set('q', debouncedSearch);
    } else {
      params.delete('q');
    }

    if (debouncedMinPrice !== '0') {
      params.set('minPrice', debouncedMinPrice);
    } else {
      params.delete('minPrice');
    }

    if (debouncedMaxPrice !== '10000') {
      params.set('maxPrice', debouncedMaxPrice);
    } else {
      params.delete('maxPrice');
    }

    if (debouncedDuration) {
      params.set('duration', debouncedDuration);
    } else {
      params.delete('duration');
    }

    router.push(`/packages?${params.toString()}`);
  }, [
    debouncedSearch,
    debouncedMinPrice,
    debouncedMaxPrice,
    debouncedDuration,
    router,
    searchParams,
  ]);

  return (
    <div className='flex gap-2 max-w-2xl mx-auto'>
      <div className='relative flex-1'>
        <Search className='absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground' />
        <Input
          type='search'
          placeholder='Search tours...'
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className='pl-9'
        />
      </div>
      <Sheet>
        <SheetTrigger asChild>
          {/* <Button variant='outline' size='icon'>
            <SlidersHorizontal className='h-4 w-4' />
          </Button> */}
        </SheetTrigger>
        <SheetContent className='w-[400px]' side='right'>
          <SheetHeader>
            <SheetTitle>Filter Tours</SheetTitle>
          </SheetHeader>
          <div className='grid gap-4 py-4'>
            <div className='space-y-2'>
              <Label>Price Range</Label>
              <div className='flex items-center space-x-2'>
                <Input
                  type='number'
                  value={minPrice}
                  onChange={(e) => setMinPrice(e.target.value)}
                  placeholder='Min'
                />
                <span>-</span>
                <Input
                  type='number'
                  value={maxPrice}
                  onChange={(e) => setMaxPrice(e.target.value)}
                  placeholder='Max'
                />
              </div>
            </div>
            <div className='space-y-2'>
              <Label>Duration (days)</Label>
              <Input
                type='number'
                value={duration}
                onChange={(e) => setDuration(e.target.value)}
                placeholder='Duration'
                min='1'
              />
            </div>
          </div>
        </SheetContent>
      </Sheet>
    </div>
  );
}
