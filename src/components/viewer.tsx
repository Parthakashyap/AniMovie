
'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { ArrowLeft, ChevronLeft, ChevronRight, Loader2 } from 'lucide-react';
import Link from 'next/link';

import { type Media } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { cn, slugify } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"


interface ViewerProps {
  media: Media;
  initialItemNumber: number;
  initialSeasonNumber?: number;
  type: 'anime' | 'manga' | 'movie' | 'tv';
}

const getIframeSrc = (type: 'anime' | 'manga' | 'movie' | 'tv', mediaId: number | string, itemNumber: number, seasonNumber: number, isDub: boolean) => {
  if (type === 'anime') {
    return `https://vidsrc.icu/embed/anime/${mediaId}/${itemNumber}/${isDub ? '1' : '0'}`;
  }
  if (type === 'manga') {
    return `https://vidsrc.icu/embed/manga/${mediaId}/${itemNumber}`;
  }
  if (type === 'movie') {
    return `https://vidsrc.icu/embed/movie/${mediaId}`;
  }
  if (type === 'tv') {
    return `https://vidsrc.icu/embed/tv/${mediaId}/${seasonNumber}/${itemNumber}`;
  }
  return '';
};


export default function Viewer({
  media,
  initialItemNumber,
  initialSeasonNumber = 1,
  type,
}: ViewerProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { toast } = useToast();

  const [itemNumber, setItemNumber] = useState(initialItemNumber);
  const [seasonNumber, setSeasonNumber] = useState(initialSeasonNumber);
  const [isDub, setIsDub] = useState(searchParams.get('dub') === '1');
  
  const mediaId = media.imdb_id || media.id;
  const [iframeSrc, setIframeSrc] = useState(() => getIframeSrc(type, mediaId, initialItemNumber, initialSeasonNumber, isDub));
  const [isLoading, setIsLoading] = useState(true);

  const title = media.title.english || media.title.romaji;
  const isAnime = type === 'anime';
  const isManga = type === 'manga';
  const isMovie = type === 'movie';
  const isTv = type === 'tv';
  
  const totalItems = isAnime ? media.episodes : (isTv ? (media.seasons?.find(s => s.season_number === seasonNumber)?.episode_count) : media.chapters);

  useEffect(() => {
    setIsLoading(true);
    const newSrc = getIframeSrc(type, mediaId, itemNumber, seasonNumber, isDub);
    setIframeSrc(newSrc);

    const slug = slugify(title);
    let newUrl = `/view/${type}/${media.id}-${slug}`;
    const params = new URLSearchParams();
    
    if (isTv) {
      params.set('season', seasonNumber.toString());
      params.set('episode', itemNumber.toString());
    } else if (isAnime) {
        params.set('item', itemNumber.toString());
    } else if (isManga) {
      params.set('item', itemNumber.toString());
    }

    if (isAnime && isDub) {
      params.set('dub', '1');
    }
    
    const paramsString = params.toString();
    if(paramsString) {
      newUrl += `?${paramsString}`;
    }

    window.history.pushState(null, '', newUrl);

  }, [itemNumber, seasonNumber, isDub, media.id, mediaId, type, title, isAnime, isManga, isTv]);
  

  const handleNavigation = (newItemNumber: number) => {
    if (newItemNumber < 1) {
      toast({
        title: "You're at the beginning!",
        description: "This is the first item.",
      });
      return;
    }
    if (totalItems && newItemNumber > totalItems) {
      toast({
        title: "You've reached the end!",
        description: "This is the last available item.",
      });
      return;
    }
    setItemNumber(newItemNumber);
  };
  
  const handleSeasonChange = (season: number) => {
    setSeasonNumber(season);
    setItemNumber(1); // Reset to first episode of new season
  }

  const backLink = isMovie ? `/media/movie/${media.id}-${slugify(title)}` : isTv ? `/media/tv/${media.id}-${slugify(title)}` : `/media/${type}/${media.id}-${slugify(title)}`;
  
  const itemLabel = isAnime || isTv ? 'Episode' : 'Chapter';

  return (
    <div className={cn("flex h-screen flex-col text-foreground", isManga ? 'bg-stone-100 dark:bg-stone-900' : 'bg-background')}>
       <header className="container mx-auto flex items-center justify-between gap-4 px-4 py-3 sm:px-6 lg:px-8">
        <div className="flex items-center gap-4 overflow-hidden">
          <Link href={backLink} passHref>
            <Button 
              variant={isManga ? 'outline' : 'outline'} 
              size="icon" 
              aria-label="Go back to details"
              className={isManga ? 'bg-white dark:bg-stone-800' : ''}
            >
              <ArrowLeft />
            </Button>
          </Link>
          <div className="flex flex-col overflow-hidden">
            <h1 className="truncate text-lg font-semibold">{title}</h1>
            {!isMovie && (
              <span className="text-sm text-muted-foreground">
                {isTv && `Season ${seasonNumber} • `}{itemLabel} {itemNumber}
              </span>
            )}
          </div>
        </div>
        <div className='flex items-center gap-2'>
        {(isTv && media.seasons && media.seasons.length > 1) && (
            <Select onValueChange={(value) => handleSeasonChange(parseInt(value))} defaultValue={seasonNumber.toString()}>
              <SelectTrigger className={cn("w-[150px]", isManga ? 'bg-white dark:bg-stone-800' : '')}>
                <SelectValue placeholder="Select a season" />
              </SelectTrigger>
              <SelectContent>
                {media.seasons.filter(s => s.season_number > 0).map((season) => (
                  <SelectItem key={season.id} value={season.season_number.toString()}>
                    Season {season.season_number}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
        )}
        {isAnime && (
          <div className="flex items-center space-x-2">
            <Label htmlFor="dub-toggle" className={isManga ? 'text-foreground' : ''}>Dub</Label>
            <Switch
              id="dub-toggle"
              checked={isDub}
              onCheckedChange={setIsDub}
            />
          </div>
        )}
        </div>
      </header>

      <main className={cn('flex flex-1 items-center justify-center overflow-hidden', isManga ? '' : 'bg-black')}>
        {isLoading && (
           <div className="flex h-full w-full items-center justify-center">
             <Loader2 className="h-8 w-8 animate-spin text-primary" />
           </div>
        )}
        {iframeSrc && (
          <iframe
            key={iframeSrc}
            src={iframeSrc}
            onLoad={() => setIsLoading(false)}
            allowFullScreen
            className={cn(
              'h-full w-full border-0',
              isLoading ? 'hidden' : 'block',
              isManga ? 'max-w-4xl' : ''
            )}
            title={`Viewer for ${title}`}
          ></iframe>
        )}
      </main>

      {(!isMovie) && (
        <footer className="container mx-auto flex items-center justify-between p-4">
          <Button
            onClick={() => handleNavigation(itemNumber - 1)}
            disabled={itemNumber <= 1}
            variant="secondary"
             className={isManga ? 'bg-white dark:bg-stone-800' : ''}
          >
            <ChevronLeft className="mr-2" />
            Previous
          </Button>
          <Button
            onClick={() => handleNavigation(itemNumber + 1)}
            disabled={!!(totalItems && itemNumber >= totalItems)}
            variant="secondary"
             className={isManga ? 'bg-white dark:bg-stone-800' : ''}
          >
            Next
            <ChevronRight className="ml-2" />
          </Button>
        </footer>
      )}
    </div>
  );
}
