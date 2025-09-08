// app/api/favorites/route.ts
import { NextRequest, NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

const API_BASE = process.env.NEXT_PUBLIC_API_BASE!; // ex) http://localhost:4000
const DEV_USER_ID = process.env.DEV_USER_ID; // ex) 1

export async function GET(req: NextRequest) {
  try {
    const url = new URL(req.url);
    const qs = url.searchParams.toString(); // limit 등 모든 쿼리 그대로 전달
    const upstreamUrl = `${API_BASE}/api/favorites${qs ? `?${qs}` : ''}`;

    // 클라이언트에서 온 x-user-id 우선, 없으면 DEV_USER_ID
    const fromClient = req.headers.get('x-user-id') || undefined;
    const forwardUserId = fromClient ?? DEV_USER_ID;

    const res = await fetch(upstreamUrl, {
      method: 'GET',
      headers: {
        ...(forwardUserId ? { 'x-user-id': String(forwardUserId) } : {}),
        // SSR 프록시라 쿠키도 넘겨줌(세션 쓰는 경우)
        cookie: req.headers.get('cookie') || '',
      },
      cache: 'no-store', // 즐겨찾기 목록은 실시간성이 좋아서 캐시 끔(원하면 제거)
    });

    const contentType = res.headers.get('content-type') || 'application/json';
    const body = await res.text();

    // 필요시 Set-Cookie 전달(백엔드에서 쿠키 갱신하는 경우)
    const headers = new Headers({ 'content-type': contentType });
    const setCookie = res.headers.get('set-cookie');
    if (setCookie) headers.append('set-cookie', setCookie);

    return new NextResponse(body, { status: res.status, headers });
  } catch (e) {
    console.error('[favorites GET proxy error]', e);
    return NextResponse.json({ error: 'upstream_error' }, { status: 502 });
  }
}

// 이미 있는 POST는 그대로 두면 됩니다.
export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => ({}));
  const fromClient = req.headers.get('x-user-id') || undefined;
  const forwardUserId = fromClient ?? DEV_USER_ID;

  const res = await fetch(`${API_BASE}/api/favorites`, {
    method: 'POST',
    credentials: 'include',
    headers: {
      'content-type': 'application/json',
      ...(forwardUserId ? { 'x-user-id': String(forwardUserId) } : {}),
      cookie: req.headers.get('cookie') || '',
    },
    body: JSON.stringify(body),
  });

  const text = await res.text();
  return new NextResponse(text, {
    status: res.status,
    headers: {
      'content-type': res.headers.get('content-type') || 'application/json',
    },
  });
}
