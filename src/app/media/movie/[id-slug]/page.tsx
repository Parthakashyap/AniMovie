import { notFound } from 'next/navigation';
import Image from 'next/image';
import { fetchMovieById, getTMDBImageUrl } from '@/lib/tmdb';
import { type Metadata } from 'next';
import { slugify } from '@/lib/utils';
import Header from '@/components/header';
import { Badge } from '@/components/ui/badge';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { PlayCircle } from 'lucide-react';
import RecommendedMovies from '@/components/recommended-movies';

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

  const movie = await fetchMovieById(id);
  if (!movie) {
    return { title: 'Not Found' };
  }

  const title = movie.title;
  const description = movie.overview || 'No description available.';
  const imageUrl = getTMDBImageUrl(movie.backdrop_path || movie.poster_path, 'original');

  return {
    title: title,
    description: description,
    openGraph: {
      title: title,
      description: description,
      images: imageUrl ? [imageUrl] : [],
      type: 'video.movie',
    },
  };
}

export default async function MovieDetailsPage({ params }: Props) {
  const { 'id-slug': idSlug } = params;
  const id = parseInt(idSlug.split('-')[0], 10);

  if (isNaN(id)) {
    notFound();
  }

  const movie = await fetchMovieById(id);
  if (!movie) {
    notFound();
  }

  const expectedSlug = slugify(movie.title);
  const actualSlug = idSlug.substring(id.toString().length + 1);

  if (actualSlug !== expectedSlug) {
    // Optional: Redirect to canonical URL
  }

  const title = movie.title;
  const description = movie.overview || 'No description available.';
  const backdropUrl = getTMDBImageUrl(movie.backdrop_path, 'original');
  const posterUrl = getTMDBImageUrl(movie.poster_path, 'w500');
  const watchUrl = `/view/movie/${movie.id}-${slugify(title)}`;
  
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
                <Badge>Movie</Badge>
                {movie.release_date && <Badge variant="outline">{new Date(movie.release_date).getFullYear()}</Badge>}
                {movie.vote_average > 0 && <Badge variant="outline">{movie.vote_average.toFixed(1)} ★</Badge>}
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
                Watch Now
              </h2>
               <Button asChild className="w-full">
                  <Link href={watchUrl}>
                    <PlayCircle className="mr-2" />
                    Play Movie
                  </Link>
                </Button>
            </div>
          </div>
          <div className="mt-12">
            <RecommendedMovies movie={movie} />
          </div>
        </div>
      </main>
    </div>
  );
}
