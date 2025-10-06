'use client';

import { useState, useEffect } from 'react';
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogAction,
} from '@/components/ui/alert-dialog';
import { Button } from '@/components/ui/button';
import { AniMovieLogo } from './icons';
import { ScrollArea } from './ui/scroll-area';

export default function DisclaimerModal() {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const hasAgreed = localStorage.getItem('hasAgreedToDisclaimer');
    if (hasAgreed !== 'true') {
      setIsOpen(true);
    }
  }, []);

  const handleAgree = () => {
    localStorage.setItem('hasAgreedToDisclaimer', 'true');
    setIsOpen(false);
  };

  return (
    <AlertDialog open={isOpen} onOpenChange={setIsOpen}>
      <AlertDialogContent className="p-0 w-[90vw] max-w-md rounded-lg">
        <div className="flex flex-col items-center justify-center p-6 text-center">
            <AniMovieLogo className="h-14 w-14 text-primary mb-4" />
            <AlertDialogHeader>
                <AlertDialogTitle className="text-2xl font-bold">AniMovie Disclaimer</AlertDialogTitle>
            </AlertDialogHeader>
        </div>
        
        <ScrollArea className="max-h-[50vh] px-6">
            <div className="space-y-4 text-sm text-muted-foreground text-left">
            <p className='font-semibold text-white/80'>
                By using AniMovie, you acknowledge and agree to these terms. AniMovie is strictly non-commercial and is intended only for personal exploration, research, and learning. The platform does not promote, encourage, or facilitate any form of copyright infringement.
            </p>
            <hr className="my-4 border-t border-b border-t-transparent" />
            <p>
                AniMovie is an open-source project developed solely for educational and personal learning purposes. It serves as a discovery and entertainment platform for anime, movies, TV shows, and manga. AniMovie does not claim ownership of any media content displayed on this site.
            </p>
            <p>
                All titles, images, posters, and metadata are fetched from publicly available third-party APIs such as The Movie Database (TMDB) and other open data providers. Any streaming links, embeds, or manga content accessible through this platform are provided by external sources. AniMovie does not host, store, or upload any media files on its own servers.
            </p>
            <p>
                All media streamed or viewed via AniMovie originates from third-party websites whose content availability and legality are beyond our control. If you believe that any content violates copyright laws, please contact the respective hosting or streaming provider directly. AniMovie has no ownership or administrative control over such external files.
            </p>
            
            </div>
        </ScrollArea>

        <AlertDialogFooter className="border-t p-4">
            <Button onClick={handleAgree} className="w-full">
                I Agree
            </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
