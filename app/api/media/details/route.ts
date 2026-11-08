import { NextRequest, NextResponse } from 'next/server';
import { getMediaDetails } from '@/lib/scraper';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const url = searchParams.get('url');
  const source = (searchParams.get('source') as 'topcinema' | 'ahwak') || 'topcinema';

  if (!url) {
    return NextResponse.json({ error: 'Missing url parameter' }, { status: 400 });
  }

  try {
    const details = await getMediaDetails(url, source);
    return NextResponse.json({ details });
  } catch (error) {
    console.error('API media details error:', error);
    return NextResponse.json({ error: 'Failed to fetch details' }, { status: 500 });
  }
}
