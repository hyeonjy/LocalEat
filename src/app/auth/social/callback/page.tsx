'use client';

import { useAuthStore } from '@/store/authStore';
import { useRouter, useSearchParams } from 'next/navigation';
import { Suspense, useEffect, useRef } from 'react';

function CallbackInner() {
  const router = useRouter();
  const searchParams = useSearchParams(); // ✅ 이제 Suspense 내부에서 호출됨
  const code = searchParams.get('code');
  const hasFetched = useRef(false);
  const setUser = useAuthStore((s) => s.setUser);

  useEffect(() => {
    if (!code || hasFetched.current) return;
    hasFetched.current = true;

    (async () => {
      try {
        const res = await fetch('/api/auth/social', {
          method: 'POST',
          credentials: 'include',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ code }),
        });
        const data = await res.json();

        if (!res.ok) {
          alert(data.message || '소셜 로그인 실패');
          router.push('/signin');
          return;
        }
        setUser(data.user);
        router.push('/');
      } catch (err) {
        console.error('소셜 로그인 에러:', err);
        alert('서버 오류');
        router.push('/signin');
      }
    })();
  }, [code, router, setUser]);

  return (
    <div className="flex h-screen items-center justify-center text-sm text-gray-500">
      로그인 처리 중입니다...
    </div>
  );
}

// ❗ 이 페이지는 정적으로 빌드하지 않도록(프리렌더 에러 방지)
export const dynamic = 'force-dynamic';

export default function SocialCallbackPage() {
  return (
    <Suspense>
      <CallbackInner />
    </Suspense>
  );
}
