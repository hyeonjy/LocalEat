import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  const body = await req.json();
  const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL;

  try {
    const res = await fetch(`${backendUrl}/users/signup`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });

    if (!res.ok) {
      const errorText = await res.text();
      console.error('백엔드 응답 실패:', res.status, errorText);

      return NextResponse.json(
        { message: '백엔드 오류', detail: errorText },
        { status: 500 },
      );
    }

    const result = await res.json();
    return NextResponse.json(result, { status: 201 });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ message: '회원가입 실패' }, { status: 500 });
  }
}
