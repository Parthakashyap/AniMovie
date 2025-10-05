
import { type Movie, type TMDBResponse, type TVShow } from './types';

const TMDB_API_URL = 'https://api.themoviedb.org/3';
const TMDB_API_KEY = process.env.NEXT_PUBLIC_TMDB_API_KEY;
const TMDB_IMAGE_BASE_URL = 'https://image.tmdb.org/t/p/';

if (!TMDB_API_KEY) {
  console.error('Missing NEXT_PUBLIC_TMDB_API_KEY environment variable. Please add it to your .env file.');
}

export function getTMDBImageUrl(path: string | null, size: 'w500' | 'original' = 'w500') {
  if (!path) return null;
  return `${TMDB_IMAGE_BASE_URL}${size}${path}`;
}

async function tmdbFetch(endpoint: string, params: Record<string, string> = {}) {
    if (!TMDB_API_KEY) {
        console.error('TMDB API key is not configured.');
        return [];
    }
    const url = new URL(`${TMDB_API_URL}${endpoint}`);
    url.searchParams.append('api_key', TMDB_API_KEY);
    Object.entries(params).forEach(([key, value]) => url.searchParams.append(key, value));

    try {
        const response = await fetch(url.toString());
        if (!response.ok) {
        console.error(`TMDB API Error: ${response.statusText}`);
        return { results: [] };
        }
        return await response.json();
    } catch (error) {
        console.error('Failed to fetch from TMDB:', error);
        return { results: [] };
    }
}

export async function fetchFromTMDB(endpoint: string, params: Record<string, string> = {}): Promise<any[]> {
  const data: TMDBResponse<any> = await tmdbFetch(endpoint, params);
  return data.results || [];
}

export async function fetchMovieById(id: number): Promise<Movie | null> {
    if (!TMDB_API_KEY) {
        console.error('TMDB API key is not configured for fetching movie by ID.');
        return null;
    }
    const url = new URL(`${TMDB_API_URL}/movie/${id}`);
    url.searchParams.append('api_key', TMDB_API_KEY);

    try {
        const response = await fetch(url.toString());
        if (!response.ok) {
            console.error(`TMDB API Error fetching movie by id: ${response.statusText}`);
            return null;
        }
        const movie: Movie = await response.json();
        return movie;
    } catch (error) {
        console.error('Failed to fetch movie by id from TMDB:', error);
        return null;
    }
}

export async function fetchTVShowById(id: number): Promise<TVShow | null> {
    if (!TMDB_API_KEY) {
        console.error('TMDB API key is not configured for fetching TV show by ID.');
        return null;
    }
    const url = new URL(`${TMDB_API_URL}/tv/${id}`);
    url.searchParams.append('api_key', TMDB_API_KEY);

    try {
        const response = await fetch(url.toString());
        if (!response.ok) {
            console.error(`TMDB API Error fetching TV show by id: ${response.statusText}`);
            return null;
        }
        const show: TVShow = await response.json();
        return show;
    } catch (error) {
        console.error('Failed to fetch TV show by id from TMDB:', error);
        return null;
    }
}
