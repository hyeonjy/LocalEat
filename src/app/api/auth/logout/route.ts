import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  const backend =
    process.env.NEXT_PUBLIC_BACKEND_URL ?? 'http://localhost:4000';

  const cookieHeader = req.headers.get('cookie') ?? '';
  try {
    await fetch(`${backend}/users/logout`, {
      method: 'POST',
      headers: { Cookie: cookieHeader },
    });
  } catch (e) {
    console.error('backend logout error:', e);
  }

  // 쿠키 삭제
  const res = NextResponse.json({ ok: true });

  const common = {
    httpOnly: true,
    sameSite: 'lax' as const,
    secure: process.env.NODE_ENV === 'production',
    path: '/',
    maxAge: 0, // 즉시 만료
  };

  res.cookies.set('accessToken', '', common);
  res.cookies.set('refreshToken', '', common);

  return res;
}
