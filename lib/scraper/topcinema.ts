import * as cheerio from 'cheerio';
import { SearchResultItem } from '@/types/media';

const TOPCINEMA_DOMAINS = [
  'https://topcinemaa.vip',
  'https://topcinema.bond',
  'https://topcinema.io',
];

const USER_AGENT =
  'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36';

export async function searchTopCinema(query: string): Promise<SearchResultItem[]> {
  const cleanQuery = query.trim();
  if (!cleanQuery) return [];

  for (const domain of TOPCINEMA_DOMAINS) {
    try {
      const searchUrl = `${domain}/?s=${encodeURIComponent(cleanQuery)}`;
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
      const seenUrls = new Set<string>();

      // Select cards / posts
      $('a').each((_, el) => {
        const link = $(el);
        const href = link.attr('href') || '';
        const img = link.find('img');
        if (!img.length || !href) return;

        // Skip logo and internal nav
        if (
          href === domain ||
          href === `${domain}/` ||
          href.includes('/wp-content/') ||
          seenUrls.has(href)
        ) {
          return;
        }

        const rawImgSrc =
          img.attr('data-src') ||
          img.attr('data-lazy-src') ||
          img.attr('src') ||
          '';

        const titleText =
          img.attr('alt') ||
          link.find('h2, h3, .title, span').text().trim() ||
          link.attr('title') ||
          '';

        if (!titleText || titleText.length < 3 || titleText.includes('توب سينما')) {
          return;
        }

        seenUrls.add(href);

        const isSeries =
          titleText.includes('مسلسل') ||
          titleText.includes('الموسم') ||
          href.includes('مسلسل') ||
          href.includes('season');

        // Extract year if available
        const yearMatch = titleText.match(/\b(19\d{2}|20\d{2})\b/);
        const year = yearMatch ? yearMatch[1] : undefined;

        // Clean title
        const cleanTitle = titleText
          .replace(/مترجم اون لاين.*$/i, '')
          .replace(/كامل بجودة.*$/i, '')
          .replace(/اون لاين.*$/i, '')
          .replace(/مشاهدة وتحميل/g, '')
          .trim();

        results.push({
          id: Buffer.from(href).toString('base64').substring(0, 16),
          title: cleanTitle || titleText,
          type: isSeries ? 'series' : 'movie',
          posterUrl: rawImgSrc.startsWith('http') ? rawImgSrc : `${domain}${rawImgSrc}`,
          year,
          source: 'topcinema',
          sourceUrl: href,
        });
      });

      if (results.length > 0) {
        return results.slice(0, 15);
      }
    } catch {
      // Continue to next domain if current fails
      continue;
    }
  }

  return [];
}

export async function getTopCinemaDetails(url: string) {
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
      $('.MainSingle img, .poster img').attr('src');
    const overview =
      $('.Story, .story, .StoryContent, .Single--Content').text().trim() ||
      $('meta[name="description"]').attr('content') ||
      $('meta[property="og:description"]').attr('content');

    return {
      title,
      poster,
      overview: overview?.replace(/^مشاهدة وتحميل[^:]*:\s*/, '').trim(),
    };
  } catch {
    return null;
  }
}
