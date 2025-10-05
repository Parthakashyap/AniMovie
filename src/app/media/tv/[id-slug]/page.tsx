import { notFound } from 'next/navigation';
import Image from 'next/image';
import { fetchTVShowById, getTMDBImageUrl } from '@/lib/tmdb';
import { type Metadata } from 'next';
import { slugify } from '@/lib/utils';
import Header from '@/components/header';
import { Badge } from '@/components/ui/badge';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { PlayCircle } from 'lucide-react';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import { type TVShow } from '@/lib/types';
import RecommendedTv from '@/components/recommended-tv';


type Props = {
  params: {
    'id-slug': string;
  };
};

export async function generateMetadata(
  { params }: Props
): Promise<Metadata> {
  const { 'id-slug': idSlug } = params;
  const id = parseInt(idSlug.split('-')[0]);

  if (isNaN(id)) {
    return { title: 'Not Found' };
  }

  const show = await fetchTVShowById(id);
  if (!show) {
    return { title: 'Not Found' };
  }

  const title = show.name;
  const description = show.overview || 'No description available.';
  const imageUrl = getTMDBImageUrl(show.backdrop_path || show.poster_path, 'original');

  return {
    title: title,
    description: description,
    openGraph: {
      title: title,
      description: description,
      images: imageUrl ? [imageUrl] : [],
      type: 'video.tv_show',
    },
  };
}


function EpisodeSelector({ show }: { show: TVShow }) {
  const title = show.name;
  if (!show.seasons || show.seasons.length === 0) {
    return (
      <Button asChild className="w-full">
        <Link href={`/view/tv/${show.id}-${slugify(title)}`}>
          <PlayCircle className="mr-2 h-4 w-4" />
          Watch Now
        </Link>
      </Button>
    )
  }

  // Filter out seasons with 0 episodes or "Specials" season
  const seasonsWithEpisodes = show.seasons.filter(s => s.season_number > 0 && s.episode_count > 0);

  return (
     <Accordion type="single" collapsible className="w-full" defaultValue='item-0'>
      {seasonsWithEpisodes.map((season, index) => (
        <AccordionItem value={`item-${index}`} key={season.id}>
          <AccordionTrigger>Season {season.season_number}</AccordionTrigger>
          <AccordionContent>
            <div className="flex flex-col gap-2">
              <p className="text-sm text-muted-foreground">{season.episode_count} Episodes</p>
              <Button asChild size="sm">
                 <Link href={`/view/tv/${show.id}-${slugify(title)}?season=${season.season_number}&episode=1`}>
                    <PlayCircle className="mr-2 h-4 w-4" />
                    Watch Season {season.season_number}
                  </Link>
              </Button>
            </div>
          </AccordionContent>
        </AccordionItem>
      ))}
    </Accordion>
  )
}


export default async function TVShowDetailsPage({ params }: Props) {
  const { 'id-slug': idSlug } = params;
  const id = parseInt(idSlug.split('-')[0], 10);

  if (isNaN(id)) {
    notFound();
  }

  const show = await fetchTVShowById(id);
  if (!show) {
    notFound();
  }

  const expectedSlug = slugify(show.name);
  const actualSlug = idSlug.substring(id.toString().length + 1);

  if (actualSlug !== expectedSlug) {
    // Optional: Redirect to canonical URL
  }

  const title = show.name;
  const description = show.overview || 'No description available.';
  const backdropUrl = getTMDBImageUrl(show.backdrop_path, 'original');
  const posterUrl = getTMDBImageUrl(show.poster_path, 'w500');
  
  return (
    <div className="flex min-h-screen flex-col bg-background">
      <Header />
      <main className="flex-1">
        <div className="relative h-[30vh] w-full sm:h-[40vh] md:h-[50vh]">
          {backdropUrl && (
            <Image
              src={backdropUrl}
              alt={`Backdrop for ${title}`}
              fill
              className="object-cover"
              priority
            />
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-background to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-b from-background/50 via-transparent to-background" />
        </div>

        <div className="container mx-auto max-w-5xl -mt-16 px-4 pb-8 sm:px-6 lg:-mt-24 lg:px-8">
          <div className="relative z-10 flex flex-col gap-8 md:flex-row md:items-end">
            <div className="w-full max-w-[150px] shrink-0 md:max-w-[200px]">
              {posterUrl && (
                <Image
                  src={posterUrl}
                  alt={`Poster for ${title}`}
                  width={200}
                  height={300}
                  className="rounded-lg shadow-xl"
                />
              )}
            </div>
            <div className="flex flex-col gap-2 py-4">
              <h1 className="text-2xl font-bold text-foreground md:text-4xl">{title}</h1>
              <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-muted-foreground">
                <Badge>TV Show</Badge>
                {show.first_air_date && <Badge variant="outline">{new Date(show.first_air_date).getFullYear()}</Badge>}
                {show.number_of_seasons && <Badge variant="outline">{show.number_of_seasons} Season(s)</Badge>}
                {show.vote_average > 0 && <Badge variant="outline">{show.vote_average.toFixed(1)} ★</Badge>}
              </div>
            </div>
          </div>

          <div className="mt-8 grid grid-cols-1 gap-8 md:grid-cols-3">
            <div className="md:col-span-2 space-y-4">
              <h2 className="text-2xl font-bold">Synopsis</h2>
              <p className="whitespace-pre-line text-foreground/80">{description}</p>
            </div>
            <div>
              <h2 className="text-2xl font-bold mb-4">
                Seasons & Episodes
              </h2>
              <EpisodeSelector show={show} />
            </div>
          </div>
          <div className="mt-12">
            <RecommendedTv show={show} />
          </div>
        </div>
      </main>
    </div>
  );
}
