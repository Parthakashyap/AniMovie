import { notFound } from 'next/navigation';
import { fetchMovieById } from '@/lib/tmdb';
import type { Metadata, ResolvingMetadata } from 'next';
import { slugify } from '@/lib/utils';
import Viewer from '@/components/viewer';

type Props = {
  params: {
    type: 'movie';
    'id-slug': string;
  };
  searchParams: { [key: string]: string | string[] | undefined };
};

export async function generateMetadata(
  { params }: Props,
  parent: ResolvingMetadata
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
  
  return {
    title: `Watch ${title}`,
    description: `Stream the movie ${title} in high quality.`,
    openGraph: {
        ...((await parent).openGraph || {}),
        title: `Watch ${title}`,
        description: `Stream the movie ${title} in high quality.`,
        type: 'video.movie',
    },
  };
}

export default async function ViewPage({ params }: Props) {
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
    // Optional: Redirect if slug is incorrect
  }
  
  // The Viewer component needs a `media` object that matches its expected props.
  // We'll adapt the `movie` object to fit the `Viewer`'s `media` prop.
  const viewerMedia = {
      id: movie.id,
      imdb_id: movie.imdb_id,
      title: { english: movie.title, romaji: movie.original_title },
      // The viewer doesn't use all these fields for movies, so we can stub them
      type: 'ANIME',
      episodes: 1, 
      chapters: null,
      description: movie.overview,
      coverImage: { extraLarge: movie.poster_path || '', large: movie.poster_path || '' },
      bannerImage: movie.backdrop_path || null,
      startDate: { year: new Date(movie.release_date).getFullYear(), month: new Date(movie.release_date).getMonth() + 1, day: new Date(movie.release_date).getDate() },
  }

  return (
    <>
      <Viewer media={viewerMedia as any} initialItemNumber={1} type={'movie'} />
    </>
  );
}
