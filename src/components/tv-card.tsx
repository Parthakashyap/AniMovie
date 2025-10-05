
import Image from 'next/image';
import Link from 'next/link';
import { type TVShow } from '@/lib/types';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { slugify } from '@/lib/utils';
import { PlayCircle } from 'lucide-react';
import { Button } from './ui/button';
import { getTMDBImageUrl } from '@/lib/tmdb';

interface TvCardProps {
  item: TVShow;
}

export default function TvCard({ item }: TvCardProps) {
  const title = item.name;
  const posterUrl = getTMDBImageUrl(item.poster_path);
  const tvUrl = `/media/tv/${item.id}-${slugify(title)}`;
  const year = item.first_air_date ? new Date(item.first_air_date).getFullYear() : 'N/A';

  return (
      <Card className="group w-full overflow-hidden transition-all hover:shadow-xl hover:shadow-primary/10 hover:-translate-y-1 border-transparent hover:border-primary/50">
        <CardContent className="relative p-0">
          <Link href={tvUrl} className="block aspect-[2/3] w-full">
            <div className="relative h-full w-full">
              {posterUrl ? (
                <Image
                  src={posterUrl}
                  alt={`Cover for ${title}`}
                  fill
                  className="rounded-t-lg object-cover"
                  sizes="(max-width: 768px) 50vw, (max-width: 1200px) 25vw, 20vw"
                />
              ) : (
                <div className="w-full h-full bg-muted rounded-t-lg flex items-center justify-center">
                  <span className="text-xs text-muted-foreground">No Image</span>
                </div>
              )}
               <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 transition-opacity group-hover:opacity-100" />
              <Badge
                className="absolute right-2 top-2"
              >
                TV
              </Badge>
            </div>
          </Link>
          <div className="p-3 space-y-2">
            <Link href={tvUrl}>
              <h3 className="truncate font-semibold text-foreground hover:text-primary transition-colors">{title}</h3>
            </Link>
            <div className="text-xs text-muted-foreground flex items-center gap-2">
              <span>{year}</span>
              {item.vote_average > 0 && <><span>&bull;</span><span>{item.vote_average.toFixed(1)} ★</span></>}
            </div>
             <div className="pt-1">
               <Button asChild size="sm" className="w-full">
                  <Link href={tvUrl}>
                    <PlayCircle className="mr-2 h-4 w-4" />
                    Watch Now
                  </Link>
               </Button>
            </div>
          </div>
        </CardContent>
      </Card>
  );
}
