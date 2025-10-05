
'use client';

import { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams, usePathname } from 'next/navigation';
import { Input } from './ui/input';
import { Button } from './ui/button';
import { Search, X } from 'lucide-react';

function SearchBarInternal() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const currentQuery = searchParams.get('query') || '';
  
  const getActiveTab = () => {
    if (pathname.startsWith('/media/anime') || pathname.startsWith('/view/anime')) {
      return 'anime';
    }
    if (pathname.startsWith('/media/manga') || pathname.startsWith('/view/manga')) {
      return 'manga';
    }
    if (pathname.startsWith('/media/movie') || pathname.startsWith('/view/movie')) {
      return 'movies';
    }
    if (pathname.startsWith('/media/tv') || pathname.startsWith('/view/tv')) {
      return 'tv';
    }
    return searchParams.get('tab') || 'anime';
  };
  
  const currentTab = getActiveTab();
  const [query, setQuery] = useState(currentQuery);

  useEffect(() => {
    // Sync query state if URL changes (e.g. browser back/forward or clearing search)
    if (currentQuery !== query) {
      setQuery(currentQuery);
    }
  }, [currentQuery]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const params = new URLSearchParams();
    params.set('tab', currentTab);
    if (query.trim()) {
      params.set('query', query.trim());
    }
    router.push(`/?${params.toString()}`);
  };

  const clearSearch = () => {
    setQuery('');
    const params = new URLSearchParams();
    params.set('tab', currentTab);
    router.push(`/?${params.toString()}`);
  };

  const getPlaceholder = () => {
    switch (currentTab) {
      case 'anime':
        return 'Search Anime...';
      case 'manga':
        return 'Search Manga...';
      case 'movies':
        return 'Search Movies...';
      case 'tv':
        return 'Search TV Shows...';
      default:
        return 'Search...';
    }
  };

  return (
    <form onSubmit={handleSearch} className="relative w-full max-w-sm">
      <Input
        type="search"
        placeholder={getPlaceholder()}
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        className="h-9 pr-16"
      />
      {query && (
        <Button
          type="button"
          size="icon"
          variant="ghost"
          onClick={clearSearch}
          className="absolute right-8 top-0 h-9 w-10 text-muted-foreground"
        >
          <X className="h-4 w-4" />
          <span className="sr-only">Clear search</span>
        </Button>
      )}
      <Button
        type="submit"
        size="icon"
        variant="ghost"
        className="absolute right-0 top-0 h-9 w-10 text-muted-foreground"
      >
        <Search className="h-4 w-4" />
        <span className="sr-only">Search</span>
      </Button>
    </form>
  );
}

// Wrap in Suspense because useSearchParams() can suspend
export function SearchBar() {
    return (
        <Suspense fallback={<div className="h-9 w-full max-w-sm bg-input rounded-md" />}>
            <SearchBarInternal />
        </Suspense>
    )
}
