import { type AniListResponse, type AniListMediaResponse, type Media } from './types';

const ANILIST_API_URL = 'https://graphql.anilist.co';

const MEDIA_FRAGMENT = `
  fragment MediaFragment on Media {
    id
    type
    format
    status
    title {
      romaji
      english
    }
    coverImage {
      extraLarge
      large
    }
    bannerImage
    episodes
    chapters
    description(asHtml: false)
    startDate {
      year
      month
      day
    }
    genres
  }
`;

const MEDIA_QUERY = `
  query ($id: Int, $page: Int, $perPage: Int, $search: String, $sort: [MediaSort], $type: MediaType, $genre_in: [String]) {
    Page(page: $page, perPage: $perPage) {
      media(id: $id, search: $search, sort: $sort, type: $type, genre_in: $genre_in) {
        ...MediaFragment
      }
    }
  }
  ${MEDIA_FRAGMENT}
`;

const SINGLE_MEDIA_QUERY = `
  query ($id: Int) {
    Media(id: $id) {
      ...MediaFragment
      relations {
        edges {
          relationType(version: 2)
          node {
            ...MediaFragment
          }
        }
      }
    }
  }
  ${MEDIA_FRAGMENT}
`;

interface FetchOptions {
  search?: string;
  page?: number;
  perPage?: number;
  sort?: string[];
  type?: 'ANIME' | 'MANGA';
  genre_in?: string[];
}

async function anilistFetch(query: string, variables: object) {
  const options = {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
    },
    body: JSON.stringify({
      query,
      variables,
    }),
  };

  const response = await fetch(ANILIST_API_URL, options);

  if (!response.ok) {
    throw new Error(`AniList API responded with status: ${response.status}`);
  }

  return response.json();
}

export async function fetchFromAniList(options: FetchOptions = {}): Promise<Media[]> {
  const { search, page = 1, perPage = 20, sort, type, genre_in } = options;
  const variables = { search, page, perPage, sort, type, genre_in };

  const json: AniListResponse = await anilistFetch(MEDIA_QUERY, variables);
  
  if (json.data && json.data.Page && json.data.Page.media) {
    // Filter out items with null description as they are often not useful
    return json.data.Page.media.filter(item => item.description);
  }
  
  return [];
}

export async function fetchMediaById(id: number): Promise<Media | null> {
    const variables = { id };
    const json: AniListMediaResponse = await anilistFetch(SINGLE_MEDIA_QUERY, variables);

    if (json.data && json.data.Media) {
        return json.data.Media;
    }

    return null;
}
