export const runtime = 'nodejs';

import { NextRequest } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    const { lat, lng } = await req.json();

    if (
      typeof lat !== 'number' ||
      typeof lng !== 'number' ||
      Number.isNaN(lat) ||
      Number.isNaN(lng)
    ) {
      return new Response(
        JSON.stringify({ message: 'lat/lng required (number)' }),
        { status: 400 },
      );
    }

    const key = process.env.NEXT_PUBLIC_KAKAO_REST_API_KEY;
    if (!key) {
      return new Response(
        JSON.stringify({ message: 'KAKAO_REST_KEY not set' }),
        { status: 500 },
      );
    }

    const url = `https://dapi.kakao.com/v2/local/geo/coord2regioncode.json?x=${lng}&y=${lat}`;
    const upstream = await fetch(url, {
      headers: { Authorization: `KakaoAK ${key}` },
    });

    const text = await upstream.text();
    if (!upstream.ok) {
      // 카카오 에러 원문(디버깅용)
      return new Response(
        JSON.stringify({
          message: 'kakao error',
          status: upstream.status,
          body: text,
        }),
        { status: upstream.status },
      );
    }

    const data = JSON.parse(text);
    const doc =
      data.documents?.find((d: any) => d.region_type === 'H') ??
      data.documents?.[0];

    const sido = doc?.region_1depth_name as string | undefined; // 시도
    const sgg = doc?.region_2depth_name as string | undefined; // 시군구

    return new Response(JSON.stringify({ sido, sgg, raw: data }), {
      status: 200,
    });
  } catch (e: any) {
    return new Response(
      JSON.stringify({ message: 'server error', detail: e?.message }),
      { status: 500 },
    );
  }
}
