import Image from 'next/image';
import Link from 'next/link';
import AuthButtons from './AuthButtons';

const Header = () => {
  return (
    <header className="fixed left-0 top-0 flex w-full justify-center border-b border-[#cecece] bg-white">
      <div className="flex h-16 w-full items-center justify-between px-5 xl:w-[1200px]">
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
  );
};

export default Header;
