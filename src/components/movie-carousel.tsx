import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '@/components/ui/carousel';
import MovieCard from './movie-card';
import { type Movie } from '@/lib/types';

interface MovieCarouselProps {
  title: string;
  items: Movie[];
}

export default function MovieCarousel({ title, items }: MovieCarouselProps) {
  return (
    <section>
      <h2 className="mb-4 text-2xl font-bold tracking-tight text-foreground mt-14 md:mt-20">
        {title}
      </h2>
      <div className="relative">
        <Carousel
          opts={{
            align: 'start',
            dragFree: true,
          }}
          className="w-full"
        >
          <CarouselContent className="-ml-2">
            {items.map((item, index) => (
              <CarouselItem
                key={item.id + '-' + index}
                className="basis-1/2 pl-2 sm:basis-1/3 md:basis-1/4 lg:basis-1/5 xl:basis-1/6"
              >
                <MovieCard item={item} />
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious className="absolute -left-4 top-1/2 -translate-y-1/2 z-10 hidden md:flex" />
          <CarouselNext className="absolute -right-4 top-1/2 -translate-y-1/2 z-10 hidden md:flex" />
        </Carousel>
      </div>
    </section>
  );
}
