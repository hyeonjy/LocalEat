import { cn } from '@/lib/utils';
import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useRef } from 'react';

type SinglePhotoUploadProps = {
  image: string | null;
  onImageAdd: (file: File | string | null) => void;
  type?: 'receipt' | 'story';
  page?: 'standard' | 'graphic';
  onStoryDataChange?: (data: any) => void;
};

const SinglePhotoUpload = ({
  image,
  onImageAdd,
  type = 'receipt',
  page = 'standard',
  onStoryDataChange,
}: SinglePhotoUploadProps) => {
  const inputRef = useRef<HTMLInputElement>(null);

  // localStorage에서 스토리 데이터 로드
  useEffect(() => {
    if (type === 'story') {
      const savedStoryImage = localStorage.getItem('storyImage');
      const savedStoryData = localStorage.getItem('storyData');

      if (savedStoryImage) {
        onImageAdd(savedStoryImage);
      }

      if (savedStoryData) {
        try {
          const parsedData = JSON.parse(savedStoryData);
          onStoryDataChange?.(parsedData);
        } catch (error) {
          console.error('스토리 데이터 파싱 실패:', error);
        }
      }
    }
  }, [type]);

  const handleImageDelete = () => {
    if (type === 'story') {
      localStorage.removeItem('storyData');
      localStorage.removeItem('storyImage');
      if (onStoryDataChange) {
        onStoryDataChange(null);
      }
    }

    onImageAdd(null);
    if (inputRef.current) {
      inputRef.current.value = '';
    }
  };

  return (
    <div
      className={cn(
        'rounded-[30px] bg-[#FDF8F6] px-[30px] pb-[49px] pt-[40px]',
        page === 'standard' ? 'w-[330px]' : 'w-full',
      )}
    >
      <p className="text-[20px] font-semibold leading-[130%] text-[#171719]">
        {type === 'receipt' ? '영수증 인증 [선택]' : '스토리 리뷰 [필수]'}
      </p>
      <p className="mb-[24px] mt-[6px] text-[16px] font-normal leading-[130%] text-[#787882]">
        {type === 'receipt' ? (
          <>
            인증 시 <span className="text-[#0826E9]">500P</span> 즉시 지급!
          </>
        ) : (
          <>
            작성 시 <span className="text-[#0826E9]">300P</span> 즉시 지급!
          </>
        )}
      </p>

      <div className="flex items-center gap-[12px]">
        <label className="flex h-[220px] w-[140px] cursor-pointer flex-col items-center justify-center gap-[6px] rounded-[20px] border border-[#C7C7CC] bg-[#E2E2E4] text-[14px] font-semibold leading-[140%] text-[#787882]">
          {type === 'receipt' ? (
            <>
              <Image
                src="/assets/icons/photo.svg"
                alt="사진 추가"
                width={24}
                height={24}
              />
              <span>사진 추가</span>
              <input
                ref={inputRef}
                name="receipt"
                type="file"
                accept="image/*"
                onChange={(e) => {
                  onImageAdd(e.target.files?.[0] || null);
                }}
                className="hidden"
              />
            </>
          ) : (
            <Link
              href="./graphic/story-editor"
              className="flex flex-col items-center gap-[6px]"
            >
              <Image
                src="/assets/icons/photo.svg"
                alt="스토리 업로드"
                width={24}
                height={24}
              />
              <span>{image ? '스토리 수정' : '스토리 업로드'}</span>
            </Link>
          )}
        </label>

        <div className="relative h-[178px] w-[120px] overflow-hidden rounded-[20px] border">
          <div
            className={cn(
              'absolute inset-0 bg-cover bg-center bg-no-repeat',
              image ? '' : 'bg-gray-200',
            )}
            style={{
              backgroundImage: image
                ? `linear-gradient(0deg, rgba(56, 56, 56, 0.5), rgba(56, 56, 56, 0.5)), url(${image})`
                : undefined,
            }}
          />
          {type === 'story' && image ? (
            <Link
              href="./graphic/story-editor"
              className="absolute inset-0 z-10 flex items-center justify-center text-[14px] font-semibold leading-[100%] text-white"
            >
              예시 확인하기
            </Link>
          ) : (
            <span className="absolute inset-0 z-10 flex items-center justify-center text-[14px] font-semibold leading-[100%] text-white">
              예시 확인하기
            </span>
          )}
          {image && (
            <button
              type="button"
              onClick={handleImageDelete}
              className="absolute right-2 top-2 z-20 cursor-pointer rounded bg-black/50 px-2 py-0.5 text-xs text-white"
            >
              삭제
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default SinglePhotoUpload;
