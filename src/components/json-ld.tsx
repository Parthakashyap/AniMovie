import { type Media } from '@/lib/types';
import { slugify } from '@/lib/utils';

interface JsonLdProps {
  media: Media;
  type: 'anime' | 'manga';
  itemNumber: number;
}

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://animovie.parthakashyap.com';

function JsonLd({ media, type, itemNumber }: JsonLdProps) {
  const title = media.title.english || media.title.romaji;
  const slug = slugify(title);
  const canonicalUrl = `${siteUrl}/view/${type}/${media.id}-${slug}?item=${itemNumber}`;

  let schema: object;

  if (type === 'anime') {
    schema = {
      '@context': 'https://schema.org',
      '@type': 'VideoObject',
      name: `Watch ${title} Episode ${itemNumber}`,
      description: media.description,
      thumbnailUrl: media.coverImage.extraLarge,
      uploadDate: media.startDate
        ? `${media.startDate.year}-${String(media.startDate.month).padStart(2, '0')}-${String(media.startDate.day).padStart(2, '0')}`
        : new Date().toISOString(),
      embedUrl: `https://vidsrc.icu/embed/anime/${media.id}/${itemNumber}`,
      partOfSeries: {
        '@type': 'TVSeries',
        name: title,
      },
    };
  } else {
    // Using ComicStory as it's more specific than Book for manga
    schema = {
      '@context': 'https://schema.org',
      '@type': 'ComicStory',
      name: `Read ${title} Chapter ${itemNumber}`,
      url: canonicalUrl,
      image: media.coverImage.extraLarge,
      partOfSeries: {
        '@type': 'ComicSeries',
        name: title,
      },
    };
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}

export default JsonLd;
