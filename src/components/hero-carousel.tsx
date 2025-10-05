'use client';

import Image from 'next/image';
import Link from 'next/link';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '@/components/ui/carousel';
import Autoplay from 'embla-carousel-autoplay';

import { type Media } from '@/lib/types';
import { slugify } from '@/lib/utils';
import { Button } from './ui/button';
import { PlayCircle } from 'lucide-react';

interface HeroCarouselProps {
  items: Media[];
}

export default function HeroCarousel({ items }: HeroCarouselProps) {
  if (!items || items.length === 0) {
    return null;
  }
  
  return (
    <div className="w-full relative -mb-12 sm:-mb-16 md:-mb-24">
    <Carousel
      className="w-full"
      opts={{ loop: true }}
      plugins={[
        Autoplay({
          delay: 5000,
          stopOnInteraction: true,
          stopOnMouseEnter: true,
        }),
      ]}
    >
      <CarouselContent>
        {items.map((item) => (
          <CarouselItem key={item.id}>
            <HeroSlide item={item} />
          </CarouselItem>
        ))}
      </CarouselContent>
      <CarouselPrevious className="absolute left-4 top-1/2 -translate-y-1/2 z-10 hidden md:flex" />
      <CarouselNext className="absolute right-4 top-1/2 -translate-y-1/2 z-10 hidden md:flex" />
    </Carousel>
    </div>
  );
}

interface HeroSlideProps {
  item: Media;
}

function HeroSlide({ item }: HeroSlideProps) {
  const title = item.title.english || item.title.romaji;
  const description = item.description
    ?.replace(/<br>/g, ' ')
    .replace(/<i>/g, '')
    .replace(/<\/i>/g, '');
  const mediaUrl = `/media/${item.type.toLowerCase()}/${item.id}-${slugify(title)}`;
  const isAnime = item.type === 'ANIME';

  return (
    <div className="relative h-[60vh] w-full text-white md:h-[75vh]">
      {item.bannerImage && (
        <Image
          src={item.bannerImage}
          alt={`Backdrop for ${title}`}
          fill
          className="object-cover"
          priority
          data-ai-hint="anime landscape"
        />
      )}
      <div className="absolute inset-0 z-10 bg-gradient-to-t from-background via-background/80 to-transparent" />
      <div className="absolute inset-0 z-10 bg-gradient-to-r from-background via-background/50 to-transparent" />
      
      <div className="container relative z-20 mx-auto flex h-full items-end px-4 pb-12 sm:px-6 md:pb-24 lg:px-8">
        <div className="flex w-full items-end gap-8">
          <div className="hidden md:block w-full max-w-[180px] shrink-0 lg:max-w-[220px] shadow-2xl rounded-lg overflow-hidden">
            {item.coverImage.extraLarge && (
              <Image
                src={item.coverImage.extraLarge}
                alt={`Poster for ${title}`}
                width={220}
                height={330}
                className="rounded-lg"
              />
            )}
          </div>
          <div className="max-w-xl py-4">
            <h1 className="text-3xl font-extrabold tracking-tight text-foreground sm:text-4xl md:text-5xl line-clamp-2">
              {title}
            </h1>
            <p className="mt-3 max-w-md text-base text-muted-foreground sm:text-lg md:mt-5 md:max-w-3xl line-clamp-3">
              {description}
            </p>
            <div className="mt-5 flex w-full flex-col sm:flex-row gap-4 max-w-xs sm:mt-8">
              <Button asChild size="lg" className="w-full sm:w-auto">
                <Link href={mediaUrl}>
                  <PlayCircle />{isAnime ? 'Watch Now' : 'Read Now'}
                </Link>
              </Button>
              <Button asChild size="lg" variant="secondary" className="w-full sm:w-auto">
                <Link href={mediaUrl}>
                  More Info
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
