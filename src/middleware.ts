// middleware.ts
import { jwtVerify } from 'jose';
import { NextRequest, NextResponse } from 'next/server';

const secret = new TextEncoder().encode(process.env.JWT_SECRET);

export const middleware = async (req: NextRequest) => {
  const token = req.cookies.get('accessToken')?.value;
  if (!token) {
    return NextResponse.redirect(new URL('/signin', req.url));
  }

  try {
    const { payload } = await jwtVerify(token, secret);

    if (!payload.isAdmin) {
      return NextResponse.redirect(new URL('/', req.url));
    }

    return NextResponse.next();
  } catch (err) {
    console.error('JWT verify failed:', err);
    return NextResponse.redirect(new URL('/signin', req.url));
  }
};

export const config = {
  matcher: ['/admin/:path*'],
};
