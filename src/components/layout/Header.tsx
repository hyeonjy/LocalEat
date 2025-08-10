'use client';
import { useSearchStore } from '@/store/overlayStore';
import Image from 'next/image';
import Link from 'next/link';
import AuthButtons from './AuthButtons';
import SearchOverlay from './SearchOverlay';

const Header = () => {
  const isSearchOpen = useSearchStore((state) => state.isOpen);

  return (
    <>
      <header className="fixed left-0 top-0 z-50 flex w-full justify-center border-b border-[#cecece] bg-white">
        <div className="flex h-16 w-full max-w-[1280px] items-center justify-between px-[40px] xl:w-[1280px]">
          <div className="flex items-center">
            <Link href="/">
              <Image
                src="/assets/logo.svg"
                alt="LocalEat 로고"
                width={100}
                height={32}
              />
            </Link>

            <nav className="ml-[40px] flex space-x-[32px] text-sm font-medium text-gray-800">
              <Link href="#">이벤트</Link>
              <Link href="/localeat">로컬잇</Link>
              <Link href="/community">커뮤니티</Link>
            </nav>
          </div>

          <AuthButtons />
        </div>
      </header>
      {isSearchOpen && <SearchOverlay />}
    </>
  );
};

export default Header;
