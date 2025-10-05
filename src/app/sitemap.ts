import { type MetadataRoute } from 'next';
import { fetchFromAniList } from '@/lib/anilist';
import { slugify } from '@/lib/utils';
import { type Media } from '@/lib/types';

export const revalidate = 86400; // 24 hours

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://animovie.com';

  const staticRoutes = [
    {
      url: siteUrl,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 1,
    },
  ] as MetadataRoute.Sitemap;

  let mediaItems: Media[] = [];
  try {
    mediaItems = await fetchFromAniList({
      sort: ['POPULARITY_DESC'],
      perPage: 100, // Fetch 100 most popular items for the sitemap
    });
  } catch (error) {
    console.error('Failed to fetch media for sitemap:', error);
    return staticRoutes;
  }

  const mediaRoutes = mediaItems.map((item) => ({
    url: `${siteUrl}/view/${item.type.toLowerCase()}/${item.id}-${slugify(
      item.title.english || item.title.romaji
    )}`,
    lastModified: new Date(),
    changeFrequency: 'weekly',
    priority: 0.8,
  })) as MetadataRoute.Sitemap;

  return [...staticRoutes, ...mediaRoutes];
}
