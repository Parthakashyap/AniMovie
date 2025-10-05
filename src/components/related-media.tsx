import Link from 'next/link';
import Image from 'next/image';
import { type Media } from '@/lib/types';
import { slugify } from '@/lib/utils';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '@/components/ui/carousel';
import { Card, CardContent } from './ui/card';
import { Badge } from './ui/badge';

interface RelatedMediaProps {
  relations: {
    edges: {
      relationType: string;
      node: Media;
    }[];
  };
}

// We only want to show certain types of relations
const VALID_RELATION_TYPES = ['PREQUEL', 'SEQUEL', 'PARENT', 'SIDE_STORY', 'SPIN_OFF'];

function formatRelationType(relationType: string) {
  return relationType.replace(/_/g, ' ').replace(/\w\S*/g, (txt) => txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase());
}

export default function RelatedMedia({ relations }: RelatedMediaProps) {
  const relatedItems = relations.edges
    .filter(edge => VALID_RELATION_TYPES.includes(edge.relationType) && edge.node.coverImage.large)
    .map(edge => ({
      ...edge.node,
      relationType: formatRelationType(edge.relationType),
    }));

  if (relatedItems.length === 0) {
    return null;
  }

  return (
    <section>
      <h2 className="mb-4 text-2xl font-bold tracking-tight text-foreground">
        Related Media
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
            {relatedItems.map((item) => (
              <CarouselItem
                key={item.id}
                className="basis-1/2 pl-2 sm:basis-1/3 md:basis-1/4 lg:basis-1/5"
              >
                <RelatedMediaCard item={item} />
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

function RelatedMediaCard({ item }: { item: Media & { relationType: string } }) {
  const title = item.title.english || item.title.romaji;
  const mediaUrl = `/media/${item.type.toLowerCase()}/${item.id}-${slugify(title)}`;

  return (
    <Card className="group w-full overflow-hidden transition-all hover:shadow-xl hover:shadow-primary/10 hover:-translate-y-1 border-transparent hover:border-primary/50 h-full flex flex-col">
      <CardContent className="relative p-0 flex-grow flex flex-col">
        <Link href={mediaUrl} className="block aspect-[2/3] w-full">
          <div className="relative h-full w-full">
            <Image
              src={item.coverImage.large}
              alt={`Cover for ${title}`}
              fill
              className="rounded-t-lg object-cover"
              sizes="(max-width: 768px) 50vw, (max-width: 1200px) 25vw, 20vw"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
            <Badge variant="secondary" className="absolute left-2 top-2">{item.relationType}</Badge>
            <Badge className="absolute right-2 top-2">{item.type}</Badge>
          </div>
        </Link>
        <div className="p-3 space-y-1 mt-auto bg-card rounded-b-lg">
          <Link href={mediaUrl}>
            <h3 className="truncate text-sm font-semibold text-foreground hover:text-primary transition-colors">{title}</h3>
          </Link>
          <div className="text-xs text-muted-foreground flex items-center gap-2">
            {item.format && <span>{item.format}</span>}
            {item.startDate?.year && <><span>&bull;</span><span>{item.startDate.year}</span></>}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
