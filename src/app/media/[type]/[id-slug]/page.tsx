import { notFound } from 'next/navigation';
import Image from 'next/image';
import { fetchMediaById } from '@/lib/anilist';
import { type Metadata } from 'next';
import { slugify } from '@/lib/utils';
import Header from '@/components/header';
import { SeasonEpisodeSelector } from '@/components/season-episode-selector';
import { Badge } from '@/components/ui/badge';
import RelatedMedia from '@/components/related-media';
import RecommendedMedia from '@/components/recommended-media';

type Props = {
  params: {
    type: 'anime' | 'manga';
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

  const media = await fetchMediaById(id);
  if (!media) {
    return { title: 'Not Found' };
  }

  const title = media.title.english || media.title.romaji;
  const description = media.description?.replace(/<br>/g, '\n').replace(/<i>/g, '').replace(/<\/i>/g, '') || 'No description available.';

  return {
    title: title,
    description: description,
    openGraph: {
      title: title,
      description: description,
      images: [media.coverImage.extraLarge].filter(Boolean) as string[],
      type: 'video.tv_show',
    },
  };
}

export default async function MediaDetailsPage({ params }: Props) {
  const { 'id-slug': idSlug, type } = params;
  const id = parseInt(idSlug.split('-')[0], 10);

  if (isNaN(id) || !['anime', 'manga'].includes(type)) {
    notFound();
  }

  const media = await fetchMediaById(id);
  if (!media) {
    notFound();
  }

  const expectedSlug = slugify(media.title.english || media.title.romaji);
  const actualSlug = idSlug.substring(id.toString().length + 1);

  if (actualSlug !== expectedSlug) {
    // Optional: Redirect to canonical URL if slug is incorrect for SEO
  }

  const title = media.title.english || media.title.romaji;
  const description = media.description?.replace(/<br>/g, '\n').replace(/<i>/g, '').replace(/<\/i>/g, '') || 'No description available.';
  const isAnime = media.type === 'ANIME';

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <Header />
      <main className="flex-1">
        <div className="relative h-[30vh] w-full sm:h-[40vh] md:h-[50vh]">
          {media.bannerImage && (
            <Image
              src={media.bannerImage}
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
              {media.coverImage.extraLarge && (
                <Image
                  src={media.coverImage.extraLarge}
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
                <Badge>{media.type}</Badge>
                {media.startDate?.year && <Badge variant="outline">{media.startDate.year}</Badge>}
                {media.format && <Badge variant="outline">{media.format}</Badge>}
                {media.status && <Badge variant="outline">{media.status}</Badge>}
                {media.episodes && <Badge variant="outline">{media.episodes} Episodes</Badge>}
                {media.chapters && <Badge variant="outline">{media.chapters} Chapters</Badge>}
              </div>
            </div>
          </div>
          
          <div className="mt-8 space-y-12">
            <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
              <div className="md:col-span-2 space-y-4">
                <h2 className="text-2xl font-bold">Synopsis</h2>
                <p className="whitespace-pre-line text-foreground/80">{description}</p>
              </div>
              <div>
                <h2 className="text-2xl font-bold mb-4">
                  {isAnime ? 'Watch Now' : 'Read Now'}
                </h2>
                <SeasonEpisodeSelector media={media} />
              </div>
            </div>

            {media.relations && <RelatedMedia relations={media.relations} />}
            <RecommendedMedia media={media} />
          </div>

        </div>
      </main>
    </div>
  );
}
