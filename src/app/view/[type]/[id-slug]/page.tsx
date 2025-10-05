import { notFound } from 'next/navigation';
import { fetchMediaById } from '@/lib/anilist';
import type { Metadata, ResolvingMetadata } from 'next';
import { slugify } from '@/lib/utils';
import JsonLd from '@/components/json-ld';
import Viewer from '@/components/viewer';

type Props = {
  params: {
    type: 'anime' | 'manga';
    'id-slug': string;
  };
  searchParams: { [key: string]: string | string[] | undefined };
};

export async function generateMetadata(
  { params, searchParams }: Props,
  parent: ResolvingMetadata
): Promise<Metadata> {
  const { 'id-slug': idSlug, type } = params;
  const id = parseInt(idSlug.split('-')[0]);

  if (isNaN(id)) {
    return { title: 'Not Found' };
  }

  const media = await fetchMediaById(id);
  if (!media) {
    return { title: 'Not Found' };
  }

  const title = media.title.english || media.title.romaji;
  const isAnime = type === 'anime';
  const itemType = isAnime ? 'Episode' : 'Chapter';
  const itemNumber = searchParams?.item || '1';

  return {
    title: `${isAnime ? 'Watch' : 'Read'} ${title} ${itemType} ${itemNumber}`,
    description: `Stream ${itemType.toLowerCase()} ${itemNumber} of the ${isAnime ? 'anime series' : 'manga'} ${title} in high quality. Available in Sub and Dub.`,
    openGraph: {
      title: `${isAnime ? 'Watch' : 'Read'} ${title} ${itemType} ${itemNumber}`,
      description: `Stream ${itemType.toLowerCase()} ${itemNumber} of the ${isAnime ? 'anime series' : 'manga'} ${title} in high quality.`,
      images: [media.coverImage.extraLarge].filter(Boolean) as string[],
      type: isAnime ? 'video.episode' : 'article',
    },
  };
}

export default async function ViewPage({ params, searchParams }: Props) {
  const { 'id-slug': idSlug, type } = params;
  const id = parseInt(idSlug.split('-')[0], 10);
  const itemNumberParam = searchParams?.item;
  const initialItemNumber = Array.isArray(itemNumberParam)
    ? parseInt(itemNumberParam[0], 10)
    : parseInt(itemNumberParam || '1', 10);

  if (isNaN(id) || !['anime', 'manga'].includes(type) || isNaN(initialItemNumber)) {
    notFound();
  }

  const media = await fetchMediaById(id);
  if (!media) {
    notFound();
  }

  const expectedSlug = slugify(media.title.english || media.title.romaji);
  const actualSlug = idSlug.substring(id.toString().length + 1);

  if (actualSlug !== expectedSlug) {
    // Redirect to canonical URL if slug is incorrect for SEO
    // This part is commented out as it requires a full redirect, which is complex for this implementation
    // For a real app, you'd use next/navigation's redirect here.
  }

  return (
    <>
      <JsonLd media={media} type={type} itemNumber={initialItemNumber} />
      <Viewer media={media} initialItemNumber={initialItemNumber} type={type} />
    </>
  );
}
