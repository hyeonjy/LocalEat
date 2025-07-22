'use client';

import { useAuthStore } from '@/store/authStore';
import { useSearchStore } from '@/store/overlayStore';
import Image from 'next/image';
import Link from 'next/link';

const AuthButtons = () => {
  const user = useAuthStore((state) => state.user);
  const toggleSearch = useSearchStore((state) => state.toggle);

  return (
    <div className="flex items-center space-x-4">
      {user ? (
        <button className="rounded-[8px] border px-3 py-1 text-sm font-medium">
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
    </div>
  );
};

export default AuthButtons;
