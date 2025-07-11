import Image from 'next/image';
import Link from 'next/link';

interface EditorHeaderProps {
  onImageUpload: () => void;
}

const EditorHeader = ({ onImageUpload }: EditorHeaderProps) => {
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
          <button
            onClick={onImageUpload}
            className="flex h-[50px] gap-2 rounded-[10px] border border-[#FA4D09] px-[24px] py-[10px] text-[20px] font-semibold leading-[150%] text-[#FA4D09]"
          >
            <Image
              src="/assets/icons/image.svg"
              alt="이미지 업로드 버튼"
              width={24}
              height={24}
            />
            <p>이미지 업로드</p>
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
