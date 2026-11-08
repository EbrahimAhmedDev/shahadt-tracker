import { NextRequest, NextResponse } from 'next/server';
import { searchMediaWithFallback } from '@/lib/scraper';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const q = searchParams.get('q');

  if (!q || !q.trim()) {
    return NextResponse.json({ results: [], primarySource: 'none' });
  }

  try {
    const data = await searchMediaWithFallback(q);
    return NextResponse.json(data);
  } catch (error) {
    console.error('API media search error:', error);
    return NextResponse.json(
      { error: 'Failed to search media sources', results: [], primarySource: 'none' },
      { status: 500 }
    );
  }
}
