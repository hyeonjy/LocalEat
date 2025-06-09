'use client';

import { useAuthStore } from '@/store/authStore';
import Image from 'next/image';
import Link from 'next/link';

const AuthButtons = () => {
  const user = useAuthStore((state) => state.user);

  return (
    <div className="flex items-center space-x-4">
      {user ? (
        <button className="rounded-full border px-3 py-1 text-sm font-medium">
          로그아웃
        </button>
      ) : (
        <Link
          href="/signin"
          className="rounded-full border px-3 py-1 text-sm font-medium"
        >
          로그인
        </Link>
      )}
      <Link href="/search">
        <Image
          src="/assets/icons/search.svg"
          alt="검색 아이콘"
          width={20}
          height={20}
        />
      </Link>
    </div>
  );
};

export default AuthButtons;
