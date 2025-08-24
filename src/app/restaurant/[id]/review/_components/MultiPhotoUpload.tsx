import Image from 'next/image';
import { useEffect, useRef, useState } from 'react';

const MAX_PHOTOS = 4;

const MultiPhotoUpload = ({
  photos,
  onPhotoAdd,
  onPhotoDelete,
}: {
  photos: File[];
  onPhotoAdd: (files: FileList | null) => void;
  onPhotoDelete: (index: number) => void;
}) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const [photoUrls, setPhotoUrls] = useState<string[]>([]);

  useEffect(() => {
    const urls = photos.map((photo) => URL.createObjectURL(photo));
    setPhotoUrls(urls);

    // 컴포넌트 언마운트 시 또는 photos 변경 시 이전 URL들 정리
    return () => {
      urls.forEach((url) => URL.revokeObjectURL(url));
    };
  }, [photos]);

  const getPhotoCellRadius = (index: number) => {
    const radiusMap = {
      0: 'rounded-tl-[12px]',
      1: 'rounded-tr-[12px]',
      2: 'rounded-bl-[12px]',
      3: 'rounded-br-[12px]',
    };
    return radiusMap[index as keyof typeof radiusMap] || '';
  };

  const handleDeleteClick = (index: number) => {
    onPhotoDelete(index);
    if (inputRef.current) {
      inputRef.current.value = '';
    }
  };

  return (
    <div className="w-[426px] flex-1 rounded-[30px] bg-[#FDF8F6] py-[40px] pl-[27px] pr-[26px]">
      <p className="text-[20px] font-semibold leading-[130%] text-[#171719]">
        사진 인증 [필수]
      </p>
      <p className="mb-[24px] mt-[6px] text-[16px] font-normal leading-[130%] text-[#787882]">
        음식 사진 1장 이상 필수예요! (최대 4장)
      </p>

      <div className="flex gap-[12px]">
        <label className="flex h-[220px] w-[140px] shrink-0 cursor-pointer flex-col items-center justify-center rounded-[20px] border border-[#C7C7CC] bg-[#E2E2E4] text-[14px] text-[#787882]">
          <Image
            src="/assets/icons/photo.svg"
            alt="사진 추가"
            width={24}
            height={24}
          />
          <span className="font-semibold">사진 추가</span>
          <span className="mt-1 text-[13px] font-medium">
            {photos.length}/{MAX_PHOTOS}
          </span>
          <input
            type="file"
            accept="image/*"
            multiple
            onChange={(e) => onPhotoAdd(e.target.files)}
            className="hidden"
          />
        </label>

        {photos.length === 0 ? (
          <div className="my-auto flex h-[220px] w-[280px] items-center justify-center rounded-[20px] bg-[#E5E6E8] text-[16px] font-semibold text-white">
            예시 확인하기
          </div>
        ) : (
          <div className="grid h-[220px] w-[280px] grid-cols-2 grid-rows-2 gap-[2px]">
            {Array.from({ length: MAX_PHOTOS }).map((_, index) => {
              const file = photos[index];
              const photoUrl = photoUrls[index];
              return (
                <div
                  key={index}
                  className={`relative overflow-hidden bg-white ${getPhotoCellRadius(index)} border border-[#E2E2E4]`}
                >
                  {file && photoUrl && (
                    <>
                      <Image
                        src={photoUrl}
                        alt={`사진 ${index + 1}`}
                        className="h-full w-full object-cover"
                        width={110}
                        height={106}
                      />
                      <button
                        type="button"
                        onClick={() => handleDeleteClick(index)}
                        className="absolute right-1 top-1 rounded bg-black/50 px-2 py-0.5 text-xs text-white"
                      >
                        삭제
                      </button>
                    </>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default MultiPhotoUpload;
