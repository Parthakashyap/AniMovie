'use client';

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import type { Media } from '@/lib/types';
import { ItemSelectionTrigger } from './item-selection-trigger';

interface SeasonEpisodeSelectorProps {
  media: Media;
}

function getSeasons(media: Media): Media[] {
  if (!media.relations) return [media];
  
  const relatedMedia = media.relations.edges
    .filter(edge => (edge.relationType === 'PREQUEL' || edge.relationType === 'SEQUEL') && edge.node.type === media.type)
    .map(edge => edge.node);

  if (relatedMedia.length === 0) return [media];

  // This logic is simplified; a full implementation would trace the entire lineage.
  // For now, we'll just include the main media and its direct sequels/prequels.
  const seasons = [media, ...relatedMedia];

  // Deduplicate and sort by start date
  const uniqueSeasons = Array.from(new Map(seasons.map(s => [s.id, s])).values());
  uniqueSeasons.sort((a, b) => {
    const yearA = a.startDate?.year || 0;
    const yearB = b.startDate?.year || 0;
    return yearA - yearB;
  });

  return uniqueSeasons;
}

export function SeasonEpisodeSelector({ media }: SeasonEpisodeSelectorProps) {
  const seasons = getSeasons(media);
  const isAnime = media.type === 'ANIME';
  const hasSeasons = seasons.length > 1;

  if (hasSeasons) {
    return (
      <Accordion type="single" collapsible defaultValue="item-0" className="w-full rounded-lg border">
        {seasons.map((season, index) => {
          const title = season.title.english || season.title.romaji;
          const totalItems = isAnime ? season.episodes : season.chapters;
          return (
            <AccordionItem value={`item-${index}`} key={season.id}>
              <AccordionTrigger className="px-4 text-left hover:no-underline">
                {title}
              </AccordionTrigger>
              <AccordionContent className="px-4">
                {totalItems ? (
                  <p className="text-sm text-muted-foreground">
                    {totalItems} {isAnime ? 'Episodes' : 'Chapters'}
                  </p>
                ) : (
                  <p className="text-sm text-muted-foreground">Count not available.</p>
                )}
                <ItemSelectionTrigger
                  media={season}
                  buttonText={`Select ${isAnime ? 'Episode' : 'Chapter'}`}
                  buttonProps={{
                    variant: 'outline',
                    size: 'sm',
                    className: 'mt-2 w-full',
                  }}
                />
              </AccordionContent>
            </AccordionItem>
          );
        })}
      </Accordion>
    );
  }

  // Fallback for single-season media or media with no listed items
  return (
    <ItemSelectionTrigger
      media={media}
      buttonText={isAnime ? 'Watch Now' : 'Read Now'}
      buttonProps={{ className: 'w-full' }}
    />
  );
}
