import { SearchResultItem } from '@/types/media';
import { searchTopCinema, getTopCinemaDetails } from './topcinema';
import { searchAhwak, getAhwakDetails } from './ahwak';

export async function searchMediaWithFallback(query: string): Promise<{
  results: SearchResultItem[];
  primarySource: 'topcinema' | 'ahwak' | 'none';
}> {
  const trimmed = query.trim();
  if (!trimmed) {
    return { results: [], primarySource: 'none' };
  }

  // 1. Try Top Cinema first (Primary)
  try {
    const topCinemaResults = await searchTopCinema(trimmed);
    if (topCinemaResults.length > 0) {
      return {
        results: topCinemaResults,
        primarySource: 'topcinema',
      };
    }
  } catch (err) {
    console.error('TopCinema search error:', err);
  }

  // 2. Fallback to Ahwak TV if Top Cinema has no results or failed
  try {
    const ahwakResults = await searchAhwak(trimmed);
    if (ahwakResults.length > 0) {
      return {
        results: ahwakResults,
        primarySource: 'ahwak',
      };
    }
  } catch (err) {
    console.error('Ahwak search error:', err);
  }

  return { results: [], primarySource: 'none' };
}

export async function getMediaDetails(url: string, source: 'topcinema' | 'ahwak') {
  if (source === 'topcinema') {
    return await getTopCinemaDetails(url);
  } else {
    return await getAhwakDetails(url);
  }
}
