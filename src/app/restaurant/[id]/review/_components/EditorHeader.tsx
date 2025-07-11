import Image from 'next/image';
import Link from 'next/link';

const EditorHeader = () => {
  return (
    <header className="fixed left-0 top-0 z-[999] flex w-full justify-center border-b border-[#cecece] bg-white">
      <div className="flex h-[82px] w-full items-center justify-between px-5 xl:w-[1200px]">
        <Link href="/">
          <Image
            src="/assets/logo.svg"
            alt="LocalEat 로고"
            width={100}
            height={32}
          />
        </Link>

        <div className="flex gap-x-3">
          <button className="h-[50px] rounded-[10px] border border-[#FA4D09] px-[24px] py-[10px] text-[20px] font-semibold leading-[150%] text-[#FA4D09]">
            이미지 업로드
          </button>
          <button className="h-[50px] rounded-[10px] border bg-[#FA4D09] px-[24px] py-[10px] text-[20px] font-semibold leading-[150%] text-white">
            등록
          </button>
        </div>
      </div>
    </header>
  );
};

export default EditorHeader;
