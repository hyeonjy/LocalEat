import { cn } from '@/lib/utils';
import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useRef, useState } from 'react';
import StoryPreview from './StoryPreview';

type SinglePhotoUploadProps = {
  image: File | string | null;
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
  const [storyData, setStoryData] = useState<any>(null);
  const [storyBgImage, setStoryBgImage] = useState<string>('');

  // localStorage에서 스토리 데이터 로드
  useEffect(() => {
    if (type === 'story') {
      const savedStoryData = localStorage.getItem('storyData');
      const savedStoryBgImage = localStorage.getItem('storyBgImage');

      if (savedStoryData) {
        try {
          const parsedData = JSON.parse(savedStoryData);
          setStoryData(parsedData);
          onStoryDataChange?.(parsedData);
        } catch (error) {
          console.error('스토리 데이터 파싱 실패:', error);
        }
      }

      if (savedStoryBgImage) {
        setStoryBgImage(savedStoryBgImage);
      }
    }
  }, [type]);

  const handleImageDelete = () => {
    if (type === 'story') {
      localStorage.removeItem('storyData');
      localStorage.removeItem('storyBgImage');
      setStoryData(null);
      setStoryBgImage('');
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
        'flex h-[371px] flex-col items-center rounded-[28px] bg-[#FDF8F6] px-[30px] py-[40px] md:items-start md:rounded-[50px] lg:h-[377px]',
        page === 'standard' ? 'md:w-[257px] lg:w-[330px]' : 'w-full',
      )}
    >
      <p className="text-[20px] font-semibold leading-[130%] text-[#171719]">
        {type === 'receipt' ? '영수증 인증 [선택]' : '스토리 리뷰 [필수]'}
      </p>
      <p className="mb-[30px] mt-[6px] text-[16px] font-normal leading-[130%] text-[#787882] lg:mb-[24px]">
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
        <label className="flex h-[220px] w-[140px] cursor-pointer flex-col items-center justify-center gap-[6px] rounded-[20px] border border-[#C7C7CC] bg-[#E2E2E4] text-[14px] font-semibold leading-[140%] text-[#787882] md:h-[163px] md:w-[104px] md:text-[12px] lg:h-[220px] lg:w-[140px] lg:text-[14px]">
          {type === 'receipt' ? (
            <>
              <Image
                src="/assets/icons/photo.svg"
                alt="사진 추가"
                width={24}
                height={24}
                className="h-[20px] w-[20px] lg:h-[24px] lg:w-[24px]"
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

        <div className="relative h-[178px] w-[120px] overflow-hidden rounded-[20px] border md:h-[123px] md:w-[83px] lg:h-[178px] lg:w-[120px]">
          {type === 'story' && storyData ? (
            <>
              <StoryPreview
                backgroundImage={storyBgImage}
                elements={storyData.elements}
                previewW={120}
                previewH={178}
              />
              <div className="absolute inset-0 z-10 bg-black/50" />
              <Link
                href="./graphic/story-editor"
                className="absolute inset-0 z-20 flex items-center justify-center text-[14px] font-semibold leading-[100%] text-white md:text-[10px] lg:text-[14px]"
              >
                예시 확인하기
              </Link>
              <button
                type="button"
                onClick={handleImageDelete}
                className="absolute right-2 top-2 z-30 cursor-pointer rounded bg-black/50 px-2 py-0.5 text-xs text-white"
              >
                삭제
              </button>
            </>
          ) : (
            <>
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
                  className="absolute inset-0 z-10 flex items-center justify-center text-[14px] font-semibold leading-[100%] text-white md:text-[10px] lg:text-[14px]"
                >
                  예시 확인하기
                </Link>
              ) : (
                <span className="absolute inset-0 z-10 flex items-center justify-center text-[14px] font-semibold leading-[100%] text-white md:text-[10px] lg:text-[14px]">
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
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default SinglePhotoUpload;
