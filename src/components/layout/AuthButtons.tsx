'use client';

import { useAuthStore } from '@/store/authStore';
import { useSearchStore } from '@/store/overlayStore';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

const AuthButtons = () => {
  const user = useAuthStore((state) => state.user);
  const toggleSearch = useSearchStore((state) => state.toggle);

  const router = useRouter();

  const handleLogout = async () => {
    try {
      await fetch('http://localhost:4000/auth/logout', {
        method: 'POST',
        credentials: 'include',
      });

      // Zustand에 저장된 유저 정보 제거
      useAuthStore.getState().clearUser();

      // 로그인 페이지로 이동
      router.push('/signin');
    } catch (err) {
      console.error('로그아웃 실패:', err);
    }
  };

  return (
    <div className="flex items-center space-x-4">
      {user ? (
        <button
          onClick={handleLogout}
          className="rounded-[8px] border px-3 py-1 text-sm font-medium"
        >
          로그아웃
        </button>
      ) : (
        <Link
          href="/signin"
          className="rounded-[8px] border px-3 py-1 text-sm font-medium"
        >
          로그인
        </Link>
      )}
      <button onClick={toggleSearch} aria-label="검색 열기">
        <Image
          src="/assets/icons/search.svg"
          alt="검색 아이콘"
          width={20}
          height={20}
        />
      </button>
      <Link href="/mypage">
        <Image
          src="/assets/icons/account.svg"
          alt="마이페이지 아이콘"
          width={20}
          height={20}
        />
      </Link>
    </div>
  );
};

export default AuthButtons;
