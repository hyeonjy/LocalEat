import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  const body = await req.json();
  const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL;

  try {
    const res = await fetch(`${backendUrl}/auth/kakao/callback`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });

    const data = await res.json();
    if (!res.ok) {
      return NextResponse.json(data, { status: res.status });
    }

    return NextResponse.json({ message: '로그인 성공', user: data.user });
  } catch (err) {
    console.error('로그인 중계 에러:', err);
    return NextResponse.json(
      { message: '서버 오류. 관리자에게 문의하세요.' },
      { status: 500 },
    );
  }
}
