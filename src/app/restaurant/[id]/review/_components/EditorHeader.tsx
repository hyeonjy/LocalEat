import Image from 'next/image';
import Link from 'next/link';

const EditorHeader = () => {
  return (
    <header className="fixed left-0 top-0 z-[999] flex w-full justify-center border-b border-[#cecece] bg-white">
      <div className="flex h-16 w-full items-center justify-between px-5 xl:w-[1200px]">
        <Link href="/">
          <Image
            src="/assets/logo.svg"
            alt="LocalEat 로고"
            width={100}
            height={32}
          />
        </Link>

        <div>
          <button className="rounded-[8px] border px-3 py-1 text-sm font-medium">
            이미지 업로드
          </button>
          <button className="rounded-[8px] border px-3 py-1 text-sm font-medium">
            등록
          </button>
        </div>
      </div>
    </header>
  );
};

export default EditorHeader;
