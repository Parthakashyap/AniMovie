'use client';

import {
  Dialog,
  DialogContent,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Button, type ButtonProps } from '@/components/ui/button';
import { ItemSelectionModal } from './item-selection-modal';
import type { Media } from '@/lib/types';
import { useState } from 'react';

interface ItemSelectionTriggerProps {
  media: Media;
  buttonText: string;
  buttonProps?: ButtonProps;
}

export function ItemSelectionTrigger({
  media,
  buttonText,
  buttonProps,
}: ItemSelectionTriggerProps) {
  const [open, setOpen] = useState(false);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button {...buttonProps}>{buttonText}</Button>
      </DialogTrigger>
      <DialogContent className="max-h-[80vh] overflow-y-auto">
        <ItemSelectionModal media={media} setOpen={setOpen} />
      </DialogContent>
    </Dialog>
  );
}
