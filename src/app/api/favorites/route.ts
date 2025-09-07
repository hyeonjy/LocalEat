// app/api/favorites/route.ts
import { NextRequest, NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

const API_BASE = process.env.NEXT_PUBLIC_API_BASE!; // ex) http://localhost:4000
const DEV_USER_ID = process.env.DEV_USER_ID;        // ex) 1  (users.id 실제 값)

export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => ({}));
  // ❗ 클라이언트에서 올라온 x-user-id 우선 사용, 없으면 DEV_USER_ID 폴백
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
