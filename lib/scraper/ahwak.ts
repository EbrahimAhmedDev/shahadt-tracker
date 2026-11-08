import * as cheerio from 'cheerio';
import { SearchResultItem } from '@/types/media';

const AHWAK_DOMAINS = [
  'https://ahwaktv.cam',
  'https://aahwaktv.beer',
  'https://ahwaktv.net',
];

const USER_AGENT =
  'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36';

export async function searchAhwak(query: string): Promise<SearchResultItem[]> {
  const cleanQuery = query.trim();
  if (!cleanQuery) return [];

  for (const domain of AHWAK_DOMAINS) {
    try {
      const searchUrl = `${domain}/search?q=${encodeURIComponent(cleanQuery)}`;
      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), 6000);

      const res = await fetch(searchUrl, {
        headers: {
          'User-Agent': USER_AGENT,
          Accept: 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
          'Accept-Language': 'ar,en-US;q=0.9,en;q=0.8',
        },
        signal: controller.signal,
      });
      clearTimeout(timeout);

      if (!res.ok) continue;

      const html = await res.text();
      const $ = cheerio.load(html);
      const results: SearchResultItem[] = [];
      const seenTitles = new Set<string>();

      // Ahwak specific structure: .br-card, article
      $('article.br-card, .br-card').each((_, el) => {
        const card = $(el);
        const link = card.find('a.br-card-link').first() || card.find('a').first();
        const href = link.attr('href') || '';
        const img = card.find('img').first();
        if (!img.length) return;

        const rawImgSrc =
          img.attr('data-src') ||
          img.attr('data-lazy-src') ||
          img.attr('src') ||
          '';

        const rawTitle =
          card.find('.br-card-title').text().trim() ||
          img.attr('alt') ||
          link.attr('title') ||
          '';

        if (!rawTitle || rawTitle.includes('أهواك') || rawTitle.includes('Ahwak')) {
          return;
        }

        const isSeries =
          rawTitle.includes('مسلسل') ||
          rawTitle.includes('الموسم') ||
          rawTitle.includes('الحلقة');

        // Clean episode numbers from title to have a unified show title
        const cleanTitle = rawTitle
          .replace(/الحلقة\s+\d+.*$/i, '')
          .replace(/الموسم\s+\d+.*$/i, '')
          .replace(/مترجم.*$/i, '')
          .replace(/اونلاين.*$/i, '')
          .trim();

        const titleKey = cleanTitle.toLowerCase();
        if (seenTitles.has(titleKey)) return;
        seenTitles.add(titleKey);

        const yearMatch = rawTitle.match(/\b(19\d{2}|20\d{2})\b/);
        const year = yearMatch ? yearMatch[1] : undefined;

        results.push({
          id: Buffer.from(href || cleanTitle).toString('base64').substring(0, 16),
          title: cleanTitle || rawTitle,
          type: isSeries ? 'series' : 'movie',
          posterUrl: rawImgSrc.startsWith('http') ? rawImgSrc : `${domain}${rawImgSrc}`,
          year,
          source: 'ahwak',
          sourceUrl: href.startsWith('http') ? href : `${domain}${href}`,
        });
      });

      if (results.length > 0) {
        return results.slice(0, 15);
      }
    } catch {
      continue;
    }
  }

  return [];
}

export async function getAhwakDetails(url: string) {
  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 6000);

    const res = await fetch(url, {
      headers: { 'User-Agent': USER_AGENT },
      signal: controller.signal,
    });
    clearTimeout(timeout);

    if (!res.ok) return null;
    const html = await res.text();
    const $ = cheerio.load(html);

    const title =
      $('meta[property="og:title"]').attr('content') ||
      $('title').text().trim();
    const poster =
      $('meta[property="og:image"]').attr('content') ||
      $('.br-thumb img, .poster img').attr('src');
    const overview =
      $('.br-story, .story, .overview, .br-single-content').text().trim() ||
      $('meta[name="description"]').attr('content') ||
      $('meta[property="og:description"]').attr('content');

    return {
      title,
      poster,
      overview,
    };
  } catch {
    return null;
  }
}
