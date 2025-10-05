
'use client';

import { useState, useEffect, Suspense, useRef, useCallback } from 'react';
import { useRouter, useSearchParams, usePathname } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { Input } from './ui/input';
import { Button } from './ui/button';
import { Search, X, Loader2, Tv, Clapperboard, Book, Film } from 'lucide-react';
import { Popover, PopoverContent, PopoverTrigger, PopoverAnchor } from '@/components/ui/popover';
import { useDebounce } from '@/hooks/use-debounce';
import { fetchFromAniList } from '@/lib/anilist';
import { fetchFromTMDB } from '@/lib/tmdb';
import { getTMDBImageUrl } from '@/lib/tmdb';
import { type Media, type Movie, type TVShow } from '@/lib/types';
import { slugify, cn } from '@/lib/utils';

type Suggestion = Media | Movie | TVShow;

const getSuggestionUrl = (item: Suggestion, type: string): string => {
    if ('title' in item && typeof item.title === 'object') { // AniList Media
        const title = item.title.english || item.title.romaji;
        return `/media/${item.type.toLowerCase()}/${item.id}-${slugify(title)}`;
    }
    if ('title' in item && typeof item.title === 'string') { // TMDB Movie
        return `/media/movie/${item.id}-${slugify(item.title)}`;
    }
    if ('name' in item) { // TMDB TVShow
        return `/media/tv/${item.id}-${slugify(item.name)}`;
    }
    return '/';
}

const getSuggestionTitle = (item: Suggestion): string => {
    if ('title' in item && typeof item.title === 'object') return item.title.english || item.title.romaji;
    if ('title' in item && typeof item.title === 'string') return item.title;
    if ('name' in item) return item.name;
    return 'Unknown';
}

const getSuggestionImage = (item: Suggestion): string | null => {
    if ('coverImage' in item) return item.coverImage.large; // AniList
    if ('poster_path' in item) return getTMDBImageUrl(item.poster_path); // TMDB
    return null;
}

const getSuggestionIcon = (type: string) => {
    switch (type) {
        case 'anime': return <Film className="h-4 w-4 text-muted-foreground" />;
        case 'manga': return <Book className="h-4 w-4 text-muted-foreground" />;
        case 'movies': return <Clapperboard className="h-4 w-4 text-muted-foreground" />;
        case 'tv': return <Tv className="h-4 w-4 text-muted-foreground" />;
        default: return null;
    }
}


function SearchBarInternal() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const pathname = usePathname();
  
  const initialQuery = searchParams.get('query') || '';
  const [query, setQuery] = useState(initialQuery);
  const debouncedQuery = useDebounce(query, 300);

  const [suggestions, setSuggestions] = useState<Suggestion[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isPopoverOpen, setPopoverOpen] = useState(false);

  const formRef = useRef<HTMLFormElement>(null);

  const getActiveTab = useCallback(() => {
    if (pathname.startsWith('/media/anime') || pathname.startsWith('/view/anime')) return 'anime';
    if (pathname.startsWith('/media/manga') || pathname.startsWith('/view/manga')) return 'manga';
    if (pathname.startsWith('/media/movie') || pathname.startsWith('/view/movie')) return 'movies';
    if (pathname.startsWith('/media/tv') || pathname.startsWith('/view/tv')) return 'tv';
    return searchParams.get('tab') || 'anime';
  }, [pathname, searchParams]);

  const currentTab = getActiveTab();

  useEffect(() => {
    if (initialQuery !== query) {
      setQuery(initialQuery);
    }
  }, [initialQuery]);

  useEffect(() => {
    if (debouncedQuery.length > 2) {
      setIsLoading(true);
      setPopoverOpen(true);
      const fetchSuggestions = async () => {
        try {
          let results: Suggestion[] = [];
          if (currentTab === 'anime') {
            results = await fetchFromAniList({ search: debouncedQuery, type: 'ANIME', sort: ['SEARCH_MATCH'], perPage: 5 });
          } else if (currentTab === 'manga') {
            results = await fetchFromAniList({ search: debouncedQuery, type: 'MANGA', sort: ['SEARCH_MATCH'], perPage: 5 });
          } else if (currentTab === 'movies') {
            results = await fetchFromTMDB('/search/movie', { query: debouncedQuery, page: '1' });
          } else if (currentTab === 'tv') {
            results = await fetchFromTMDB('/search/tv', { query: debouncedQuery, page: '1' });
          }
          setSuggestions(results.slice(0, 7)); // Limit to 7 suggestions
        } catch (error) {
          console.error("Failed to fetch suggestions:", error);
          setSuggestions([]);
        } finally {
          setIsLoading(false);
        }
      };
      fetchSuggestions();
    } else {
      setSuggestions([]);
      setPopoverOpen(false);
    }
  }, [debouncedQuery, currentTab]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setPopoverOpen(false);
    const params = new URLSearchParams(searchParams);
    params.set('tab', currentTab);
    if (query.trim()) {
      params.set('query', query.trim());
    } else {
      params.delete('query');
    }
    router.push(`/?${params.toString()}`);
  };

  const clearSearch = () => {
    setQuery('');
    setSuggestions([]);
    setPopoverOpen(false);
    const params = new URLSearchParams(searchParams);
    params.delete('query');
    router.push(`/?${params.toString()}`);
  };
  
  const getPlaceholder = () => `Search ${currentTab.charAt(0).toUpperCase() + currentTab.slice(1)}...`;

  return (
    <Popover open={isPopoverOpen} onOpenChange={setPopoverOpen}>
      <form ref={formRef} onSubmit={handleSearch} className="relative w-full max-w-sm">
        <PopoverAnchor asChild>
            <Input
              type="search"
              placeholder={getPlaceholder()}
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onClick={() => query.length > 2 && setPopoverOpen(true)}
              className="h-9 pr-16"
              autoComplete="off"
            />
        </PopoverAnchor>
        
        <div className="absolute right-0 top-0 h-9 flex items-center">
            {isLoading ? (
                <Loader2 className="h-4 w-10 animate-spin text-muted-foreground" />
            ) : query ? (
                <Button type="button" size="icon" variant="ghost" onClick={clearSearch} className="h-9 w-10 text-muted-foreground">
                    <X className="h-4 w-4" />
                    <span className="sr-only">Clear search</span>
                </Button>
            ) : null}
            <Button type="submit" size="icon" variant="ghost" className="h-9 w-10 text-muted-foreground">
                <Search className="h-4 w-4" />
                <span className="sr-only">Search</span>
            </Button>
        </div>

        {suggestions.length > 0 && (
          <PopoverContent 
            className="w-[var(--radix-popover-trigger-width)] p-0" 
            align="start"
            onOpenAutoFocus={(e) => e.preventDefault()} // Prevents focus stealing
          >
            <div className="flex flex-col">
              {suggestions.map((item) => {
                const title = getSuggestionTitle(item);
                const imageUrl = getSuggestionImage(item);
                const itemUrl = getSuggestionUrl(item, currentTab);

                return (
                  <Link
                    key={item.id}
                    href={itemUrl}
                    onClick={() => setPopoverOpen(false)}
                    className="flex items-center gap-3 p-2 hover:bg-accent transition-colors"
                  >
                    <div className="relative h-14 w-10 shrink-0 rounded-sm overflow-hidden bg-muted">
                        {imageUrl ? (
                            <Image src={imageUrl} alt={title} fill className="object-cover" sizes="40px" />
                        ) : (
                           <div className="w-full h-full flex items-center justify-center">
                            {getSuggestionIcon(currentTab)}
                           </div>
                        )}
                    </div>
                    <span className="text-sm font-medium line-clamp-2">{title}</span>
                  </Link>
                );
              })}
               <Button variant="ghost" onMouseDown={handleSearch} className="rounded-t-none">
                 See all results for "{debouncedQuery}"
               </Button>
            </div>
          </PopoverContent>
        )}
      </form>
    </Popover>
  );
}

export function SearchBar() {
    return (
        <Suspense fallback={<div className="h-9 w-full max-w-sm bg-input rounded-md" />}>
            <SearchBarInternal />
        </Suspense>
    )
}
