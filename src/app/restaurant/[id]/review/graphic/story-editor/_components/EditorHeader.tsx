import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

interface EditorHeaderProps {
  onImageUpload: () => void;
  onSave?: () => void;
}

const EditorHeader = ({ onImageUpload, onSave }: EditorHeaderProps) => {
  const router = useRouter();

  return (
    <header className="fixed left-0 top-0 z-[999] flex w-full justify-center border-b border-[#cecece] bg-white">
      <div className="hidden h-[82px] w-full px-5 md:flex md:items-center md:justify-between xl:w-[1200px]">
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
          <button
            onClick={onSave}
            className="h-[50px] rounded-[10px] border bg-[#FA4D09] px-[24px] py-[10px] text-[20px] font-semibold leading-[150%] text-white"
          >
            등록
          </button>
        </div>
      </div>

      <div className="flex h-[60px] w-full items-center justify-between p-4 md:hidden">
        <div className="flex items-center gap-x-4">
          <button onClick={() => router.back()}>
            <Image
              src="/assets/icons/arrow_left.svg"
              alt="뒤로가기 버튼"
              width={28}
              height={28}
            />
          </button>

          <span className="text-[20px] font-semibold leading-[130%]">
            사진 편집
          </span>
        </div>

        <Image
          src="/assets/icons/menu.svg"
          alt="메뉴 버튼"
          width={28}
          height={28}
        />
      </div>
    </header>
  );
};

export default EditorHeader;
