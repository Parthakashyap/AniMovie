'use client';

import { useRouter } from 'next/navigation';
import {
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import type { Media } from '@/lib/types';
import { slugify } from '@/lib/utils';
import { useState } from 'react';

interface ItemSelectionModalProps {
  media: Media;
  setOpen: (open: boolean) => void;
}

export function ItemSelectionModal({ media, setOpen }: ItemSelectionModalProps) {
  const router = useRouter();
  const [manualItem, setManualItem] = useState('');
  const isAnime = media.type === 'ANIME';
  const totalItems = isAnime ? media.episodes : media.chapters;
  const itemType = isAnime ? 'Episode' : 'Chapter';
  const title = media.title.english || media.title.romaji;

  const handleItemSelect = (itemNumber: number) => {
    const slug = slugify(title);
    const url = `/view/${media.type.toLowerCase()}/${media.id}-${slug}?item=${itemNumber}`;
    router.push(url);
    setOpen(false);
  };

  const handleManualSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const itemNumber = parseInt(manualItem);
    if (!isNaN(itemNumber) && itemNumber > 0) {
      handleItemSelect(itemNumber);
    }
  };

  return (
    <>
      <DialogHeader>
        <DialogTitle>Select {itemType}</DialogTitle>
        <DialogDescription>
          Choose a {itemType.toLowerCase()} to start watching for "{title}".
        </DialogDescription>
      </DialogHeader>
      <div className="py-4">
        {totalItems && totalItems > 0 ? (
          <div className="grid grid-cols-5 gap-2 sm:grid-cols-6 md:grid-cols-8">
            {Array.from({ length: totalItems }, (_, i) => i + 1).map((ep) => (
              <Button
                key={ep}
                variant="outline"
                onClick={() => handleItemSelect(ep)}
              >
                {ep}
              </Button>
            ))}
          </div>
        ) : (
          <form onSubmit={handleManualSubmit} className="space-y-4">
            <p className="text-sm text-muted-foreground">
              The {itemType.toLowerCase()} count for this series is not available. Please enter a number below.
            </p>
            <Input
              type="number"
              placeholder={`${itemType} number`}
              value={manualItem}
              onChange={(e) => setManualItem(e.target.value)}
              min="1"
            />
            <Button type="submit" className="w-full">
              Go to {itemType}
            </Button>
          </form>
        )}
      </div>
    </>
  );
}
