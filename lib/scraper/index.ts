import { SearchResultItem } from '@/types/media';
import { searchTopCinema, getTopCinemaDetails } from './topcinema';
import { searchAhwak, getAhwakDetails } from './ahwak';

/**
 * توحيد العنوان: يشيل البادئات (فيلم/مسلسل/انمي...) وكل ما يأتي بعد
 * "الموسم/الحلقة/Season" — حتى تصبح كل مواسم نفس المسلسل مفتاحاً واحداً.
 */
function normalizeTitleKey(raw: string): string {
  return raw
    .replace(/^(مشاهدة|تحميل|شاهد)?\s*(وتحميل)?\s*/, '')
    .replace(/^(فيلم|مسلسل|انمي|أنمي|برنامج|أفلام|افلام)\s+/, '')
    .replace(/\s*(الموسم|موسم)\s+\S+.*$/i, '')
    .replace(/\s*الحلقة\s+\S+.*$/i, '')
    .replace(/\s*Season\s+\S+.*$/i, '')
    .replace(/\s*(مترجم|اون لاين|أون لاين|كامل|بالجودة).*$/i, '')
    .replace(/[«»"'()]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
    .toLowerCase();
}

const SEASON_RE = /(الموسم|موسم)\s+\S+/i;

/** دمج نتائج المواسم المتعددة لنفس المسلسل في نتيجة واحدة (المسلسل كله) */
function mergeSeasonResults(list: SearchResultItem[]): SearchResultItem[] {
  const groups = new Map<string, SearchResultItem[]>();
  for (const item of list) {
    const key = `${item.type}::${normalizeTitleKey(item.title) || item.title}`;
    const bucket = groups.get(key);
    if (bucket) bucket.push(item);
    else groups.set(key, [item]);
  }

  const merged: SearchResultItem[] = [];
  groups.forEach((bucket) => {
    if (bucket.length === 1) {
      merged.push(bucket[0]);
      return;
    }
    // نفضّل الصفحة الأم (بدون "الموسم" في اسمها الأصلي) — هي صفحة المسلسل كله
    const umbrella = bucket.find((i) => !SEASON_RE.test(i.title)) || bucket[0];
    const others = bucket.filter((i) => i !== umbrella);

    // نأخذ سنة من أي نتيجة لو الصفحة الأم بدون سنة
    const year = umbrella.year || others.find((i) => i.year)?.year;

    merged.push({
      ...umbrella,
      title:
        umbrella.title
          .replace(/(الموسم|موسم)\s+\S+.*$/i, '')
          .replace(/\s*الحلقة\s+\S+.*$/i, '')
          .replace(/\s*(مترجم[ةم]*|اون لاين|أون لاين|كامل).*$/i, '')
          .replace(/\s+/g, ' ')
          .trim() || umbrella.title,
      // نفضّل بوستر أوسع من أي نتيجة
      posterUrl: umbrella.posterUrl.length > others[0]?.posterUrl?.length ? umbrella.posterUrl : (others[0]?.posterUrl || umbrella.posterUrl),
      year,
    });
  });

  return merged;
}

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
    const topCinemaResults = mergeSeasonResults(await searchTopCinema(trimmed));
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
    const ahwakResults = mergeSeasonResults(await searchAhwak(trimmed));
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
