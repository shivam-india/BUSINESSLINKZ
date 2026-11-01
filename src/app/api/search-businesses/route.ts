import { NextRequest, NextResponse } from 'next/server';
import { searchBusinessesService } from '@/services/serpapiService';
import { SerpApiSearchParams } from '@/types';

export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest) {
  try {
    const body = (await req.json()) as SerpApiSearchParams;

    const query = body.query || '';
    const location = body.location || 'Worldwide';
    const radiusKm = body.radiusKm ? Number(body.radiusKm) : 50;
    const industry = body.industry;
    const subIndustry = body.subIndustry;
    const businessModel = body.businessModel;
    const offeringType = body.offeringType;
    const country = body.country;
    const forceMock = body.forceMock === true;

    const result = await searchBusinessesService({
      query,
      location,
      radiusKm,
      industry,
      subIndustry,
      businessModel,
      offeringType,
      country,
      forceMock,
    });

    return NextResponse.json(result, { status: 200 });
  } catch (error) {
    console.error('[API /api/search-businesses POST Error]', error);
    return NextResponse.json(
      {
        error: 'Failed to process business search',
        message: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}

export async function GET(req: NextRequest) {
  try {
    const searchParams = req.nextUrl.searchParams;
    const query = searchParams.get('q') || searchParams.get('query') || '';
    const location = searchParams.get('loc') || searchParams.get('location') || 'Worldwide';
    const radiusKm = searchParams.get('radius') ? Number(searchParams.get('radius')) : 50;
    const industry = searchParams.get('industry') || undefined;
    const forceMock = searchParams.get('mock') === 'true';

    const result = await searchBusinessesService({
      query,
      location,
      radiusKm,
      industry,
      forceMock,
    });

    return NextResponse.json(result, { status: 200 });
  } catch (error) {
    console.error('[API /api/search-businesses GET Error]', error);
    return NextResponse.json(
      {
        error: 'Failed to process business search',
        message: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}
