
import { notFound } from 'next/navigation';
import { fetchTVShowById } from '@/lib/tmdb';
import type { Metadata, ResolvingMetadata } from 'next';
import { slugify } from '@/lib/utils';
import Viewer from '@/components/viewer';

type Props = {
  params: {
    type: 'tv';
    'id-slug': string;
  };
  searchParams: { [key: string]: string | string[] | undefined };
};

export async function generateMetadata(
  { params, searchParams }: Props,
  parent: ResolvingMetadata
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
  const season = searchParams?.season || '1';
  const episode = searchParams?.episode || '1';
  
  return {
    title: `Watch ${title} S${season} E${episode}`,
    description: `Stream season ${season} episode ${episode} of the series ${title} in high quality.`,
    openGraph: {
        ...((await parent).openGraph || {}),
        title: `Watch ${title} S${season} E${episode}`,
        description: `Stream season ${season} episode ${episode} of the series ${title} in high quality.`,
        type: 'video.episode',
    },
  };
}

export default async function ViewPage({ params, searchParams }: Props) {
  const { 'id-slug': idSlug } = params;
  const id = parseInt(idSlug.split('-')[0], 10);
  const season = searchParams?.season || '1';
  const episode = searchParams?.episode || '1';
  
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
    // Optional: Redirect if slug is incorrect
  }
  
  const viewerMedia = {
      id: show.id,
      imdb_id: show.imdb_id,
      title: { english: show.name, romaji: show.original_name },
      type: 'ANIME', // Viewer expects ANIME or MANGA. We can adapt.
      episodes: show.number_of_episodes || 1, 
      chapters: null,
      description: show.overview,
      coverImage: { extraLarge: show.poster_path || '', large: show.poster_path || '' },
      bannerImage: show.backdrop_path || null,
      startDate: { year: show.first_air_date ? new Date(show.first_air_date).getFullYear() : 0, month: show.first_air_date ? new Date(show.first_air_date).getMonth() + 1 : 0, day: show.first_air_date ? new Date(show.first_air_date).getDate() : 0 },
      seasons: show.seasons
  }

  return (
    <>
      <Viewer 
        media={viewerMedia as any} 
        initialItemNumber={parseInt(Array.isArray(episode) ? episode[0] : episode, 10)} 
        initialSeasonNumber={parseInt(Array.isArray(season) ? season[0] : season, 10)}
        type={'tv'} 
      />
    </>
  );
}
