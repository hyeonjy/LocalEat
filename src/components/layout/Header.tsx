'use client';
import { useAuthStore } from '@/store/authStore';
import { useSearchStore } from '@/store/overlayStore';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
import AuthButtons from './AuthButtons';
import SearchOverlay from './SearchOverlay';

const Header = () => {
  const user = useAuthStore((state) => state.user);

  useEffect(() => {
    console.log('✅ Zustand에 저장된 유저:', user);
  }, [user]);
  const pathname = usePathname();
  const isHidden = pathname.includes('/review/graphic/story-editor');

  const isSearchOpen = useSearchStore((s) => s.isOpen);
  const openSearch = useSearchStore((s) => s.open);
  const [menuOpen, setMenuOpen] = useState(false);

  if (isHidden) return null;

  return (
    <>
      <header className="fixed left-0 top-0 z-50 w-full border-b border-[#cecece] bg-white">
        <div
          className={`mx-auto flex h-16 w-full max-w-full items-center justify-between px-4 max-[721px]:max-w-[720px] lg:max-w-[1024px] lg:px-8 xl:max-w-[1280px]`}
        >
          {/* 좌측: 로고 + (lg↑) 내비 */}
          <div className="flex items-center gap-6 max-[721px]:gap-4">
            <Link href="/">
              <Image
                src="/assets/logo.svg"
                alt="LocalEat 로고"
                width={100}
                height={32}
                priority
                className="max-[721px]:h-auto max-[721px]:w-[88px]"
              />
            </Link>

            <nav className="hidden space-x-[32px] text-sm font-medium text-gray-800 lg:flex">
              <Link href="/mission" className="hover:text-black">
                이벤트
              </Link>
              <Link href="/localeat" className="hover:text-black">
                로컬잇
              </Link>
              <Link href="/community" className="hover:text-black">
                커뮤니티
              </Link>
            </nav>
          </div>

          {/* 우측: 1280px 미만에서만 검색 아이콘, 햄버거는 lg 미만에서만 */}
          <div className="flex items-center gap-2 max-[721px]:gap-1">
            {/* ✅ 1280px 이상(xl↑)에서는 숨김 */}
            <button
              type="button"
              aria-label="검색 열기"
              onClick={() => openSearch?.()}
              className="rounded-full p-2 hover:bg-gray-100 max-[721px]:p-1.5 lg:hidden"
            >
              <Image
                src="/assets/icons/search.svg"
                alt="검색"
                width={24}
                height={24}
                className="max-[721px]:h-5 max-[721px]:w-5"
              />
            </button>

            {/* 데스크탑 인증 버튼 */}
            <div className="hidden lg:block">
              <AuthButtons />
            </div>

            {/* 모바일 햄버거: lg 미만에서만 보이게 */}
            <button
              type="button"
              aria-label="메뉴 열기"
              className="rounded-full p-2 hover:bg-gray-100 max-[721px]:p-1.5 lg:hidden"
              onClick={() => setMenuOpen(true)}
            >
              <Image
                src="/assets/icons/menu.svg"
                alt="메뉴 버튼"
                width={28}
                height={28}
                className="max-[721px]:h-6 max-[721px]:w-6"
              />
            </button>
          </div>
        </div>
      </header>

      {/* 모바일 드로어: ▶️ 오른쪽에서 왼쪽으로 슬라이드 */}
      <div
        className={`fixed inset-0 z-[60] lg:hidden ${menuOpen ? '' : 'pointer-events-none'}`}
      >
        {/* 배경 */}
        <div
          className={`absolute inset-0 bg-black/40 transition-opacity ${menuOpen ? 'opacity-100' : 'opacity-0'}`}
          onClick={() => setMenuOpen(false)}
        />
        {/* 패널(우측 고정) */}
        <aside
          role="dialog"
          aria-modal="true"
          className={`absolute right-0 top-0 h-full w-[80%] max-w-[320px] bg-white shadow-xl transition-transform duration-300 max-[721px]:w-[88%] max-[721px]:max-w-[280px] ${menuOpen ? 'translate-x-0' : 'translate-x-full'} `}
        >
          {/* ✅ 상단 바: X(이미지) + LocalEat 로고 / 링크와 같은 좌우 패딩(px-4)로 정렬 */}
          <div className="flex items-center gap-3 px-4 py-3 max-[721px]:px-3 max-[721px]:py-[16px]">
            <button
              aria-label="메뉴 닫기"
              className="rounded p-1 hover:bg-gray-100"
              onClick={() => setMenuOpen(false)}
            >
              <Image
                src="/assets/icons/exit.svg" // 닫기 아이콘
                alt="닫기"
                width={28}
                height={28}
                className="max-[721px]:h-6 max-[721px]:w-6"
              />
            </button>
            {/* LocalEat 로고 재활용 */}
            <Link
              href="/"
              onClick={() => setMenuOpen(false)}
              className="inline-flex items-center"
            >
              <Image
                src="/assets/logo.svg"
                alt="LocalEat"
                width={96}
                height={30}
                className="h-[30px] w-[96px] max-[721px]:h-[26px] max-[721px]:w-[84px]"
              />
            </Link>
          </div>

          {/* 텍스트 링크 4개 (아이콘 없음) */}
          <nav className="flex flex-col px-2 py-2 text-[15px] max-[721px]:text-[14px]">
            <Link
              href="/mission"
              onClick={() => setMenuOpen(false)}
              className="rounded px-4 py-3 hover:bg-gray-100"
            >
              이번 주 미션
            </Link>
            <Link
              href="/localeat"
              onClick={() => setMenuOpen(false)}
              className="rounded px-4 py-3 hover:bg-gray-100"
            >
              로컬잇
            </Link>
            <Link
              href="/community"
              onClick={() => setMenuOpen(false)}
              className="rounded px-4 py-3 hover:bg-gray-100"
            >
              커뮤니티
            </Link>
            {/* ✅ 로그인 여부에 따라 링크 분기 */}
            {user ? (
              <Link
                href="/mypage"
                onClick={() => setMenuOpen(false)}
                className="rounded px-4 py-3 hover:bg-gray-100"
              >
                마이페이지
              </Link>
            ) : (
              <Link
                href="/signin"
                onClick={() => setMenuOpen(false)}
                className="rounded px-4 py-3 hover:bg-gray-100"
              >
                로그인
              </Link>
            )}
          </nav>
        </aside>
      </div>

      {isSearchOpen && <SearchOverlay />}
    </>
  );
};

export default Header;
