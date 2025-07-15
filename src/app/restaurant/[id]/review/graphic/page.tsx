'use client';

import {
  createGraphicReview,
  getRestaurantInfoAndMenus,
} from '@/app/actions/restaurant';
import { useAuthStore } from '@/store/authStore';
import { GraphicReviewPayload } from '@/types/restaurant';
import { useQuery } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import KeywordSelection from '../_components/KeywordSelection';
import RestaurantInfo from '../_components/RestaurantInfo';
import SinglePhotoUpload from '../_components/SinglePhotoUpload';

type GraphicReviewPageProps = {
  params: {
    id: string;
  };
};

const GraphicReviewForm = ({ params }: GraphicReviewPageProps) => {
  const restaurantId = params.id;
  const [rating, setRating] = useState<number>(0);
  const [keywords, setKeywords] = useState<string[]>([]);
  const [receiptImage, setReceiptImage] = useState<string | null>(null);
  const [storyImage, setStoryImage] = useState<string | null>(null);
  const [storyData, setStoryData] = useState<any>(null);
  const { user, clearUser } = useAuthStore();
  const router = useRouter();

  const { data, isPending, error } = useQuery({
    queryKey: ['restaurant-info', restaurantId],
    queryFn: () => getRestaurantInfoAndMenus(restaurantId),
  });

  if (isPending) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const formData = new FormData(e.currentTarget);

    // localStorage에서 스토리 이미지들 가져오기
    const storyBgImage = localStorage.getItem('storyBgImage');

    if (receiptImage) {
      formData.append('photos', receiptImage);
      formData.append('photoTypes', 'receipt');
    }

    if (storyBgImage) {
      formData.append('photos', storyBgImage);
      formData.append('photoTypes', 'storyBg');
    }

    const res = await fetch('/api/upload', {
      method: 'POST',
      body: formData,
    });

    const result = await res.json();

    console.log('result: ', result);

    const review = {
      restaurantId,
      userId: user?.id,
      keywords,
      rating,
      photos: result.uploadedPhotos,
      elements: storyData?.elements,
    };

    console.log('review: ', review);

    try {
      const result = await createGraphicReview(review as GraphicReviewPayload);

      if (!result.success) {
        if (result.reason === 'UNAUTHORIZED') {
          alert('로그인 세션이 만료되었습니다. 다시 로그인해주세요.');
          clearUser();
          router.push('/signin');
          return;
        }

        alert('리뷰 등록 실패');
        return;
      }

      localStorage.removeItem('storyBgImage');
      localStorage.removeItem('storyData');

      alert('리뷰 등록 성공');
      router.push(`/restaurant/${restaurantId}`);
    } catch (error: any) {
      alert('리뷰 등록 실패');
    }
  };

  const handleKeywordToggle = (keyword: string) => {
    setKeywords((prev) =>
      prev.includes(keyword)
        ? prev.filter((k) => k !== keyword)
        : [...prev, keyword],
    );
  };

  const handleReceiptAdd = (file: File | string | null) => {
    if (file instanceof File) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const dataUrl = e.target?.result as string;
        setReceiptImage(dataUrl);
      };
      reader.readAsDataURL(file);
    } else {
      setReceiptImage(null);
    }
  };

  const handleStoryAdd = (file: File | string | null) => {
    // localStorage에서 로드한 data URL인 경우
    if (typeof file === 'string') {
      setStoryImage(file);
    }
    // 새로 업로드한 File 객체인 경우
    else if (file instanceof File) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const dataUrl = e.target?.result as string;
        setStoryImage(dataUrl);
      };
      reader.readAsDataURL(file);
    } else {
      setStoryImage(null);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="mt-[64px] flex flex-col items-center"
    >
      <RestaurantInfo
        restaurant={data.restaurant}
        rating={rating}
        setRating={setRating}
        type="graphic"
      />

      <KeywordSelection
        keywords={keywords}
        onKeywordToggle={handleKeywordToggle}
      />

      <section className="mt-[32px] flex w-[791px] gap-[20px]">
        <SinglePhotoUpload
          image={receiptImage}
          onImageAdd={handleReceiptAdd}
          page="graphic"
        />
        <SinglePhotoUpload
          image={storyImage}
          onImageAdd={handleStoryAdd}
          type="story"
          page="graphic"
          onStoryDataChange={setStoryData}
        />
      </section>

      <div className="mt-[32px] flex w-[791px] justify-end">
        <button className="flex h-[50px] w-[100px] items-center justify-center rounded-[8px] bg-[#FA4D09] px-[20px] py-[16px] text-white">
          등록
        </button>
      </div>
    </form>
  );
};

export default GraphicReviewForm;
