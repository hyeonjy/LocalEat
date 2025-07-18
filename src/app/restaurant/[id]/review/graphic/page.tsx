'use client';

import {
  createGraphicReview,
  getRestaurantInfoAndMenus,
} from '@/app/actions/restaurant';
import { useAuthStore } from '@/store/authStore';
import { GraphicReviewPayload } from '@/types/restaurant';
import { useQuery } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
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
  const [formData, setFormData] = useState({
    rating: 0,
    keywords: [] as string[],
    receiptImage: null as string | null,
  });
  const [isMounted, setIsMounted] = useState(false);
  const [storyImage, setStoryImage] = useState<string | null>(null);
  const [storyData, setStoryData] = useState<any>(null);
  const { user, clearUser } = useAuthStore();
  const router = useRouter();

  useEffect(() => {
    if (isMounted) {
      localStorage.setItem(
        `graphicReview_${restaurantId}`,
        JSON.stringify(formData),
      );
    }
  }, [formData]);

  useEffect(() => {
    const storageKey = `graphicReview_${restaurantId}`;
    const savedData = localStorage.getItem(storageKey);

    if (savedData) {
      try {
        const parsed = JSON.parse(savedData);
        setFormData(parsed);
      } catch (error) {
        console.error('데이터 파싱 실패:', error);
      }
    }
    setIsMounted(true);
  }, [restaurantId]);

  const { data, isPending, error } = useQuery({
    queryKey: ['restaurant-info', restaurantId],
    queryFn: () => getRestaurantInfoAndMenus(restaurantId),
  });

  if (isPending) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const uploadFormData = new FormData(e.currentTarget);
    const storyBgImage = localStorage.getItem('storyBgImage');

    if (formData.receiptImage) {
      uploadFormData.append('photos', formData.receiptImage);
      uploadFormData.append('photoTypes', 'receipt');
    }

    if (storyBgImage) {
      uploadFormData.append('photos', storyBgImage);
      uploadFormData.append('photoTypes', 'storyBg');
    }

    const res = await fetch('/api/upload', {
      method: 'POST',
      body: uploadFormData,
    });

    const result = await res.json();

    const review = {
      restaurantId,
      userId: user?.id,
      keywords: formData.keywords,
      rating: formData.rating,
      photos: result.uploadedPhotos,
      elements: storyData?.elements,
    };

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

      // 성공 시 localStorage 정리
      localStorage.removeItem('storyBgImage');
      localStorage.removeItem('storyData');
      localStorage.removeItem(`graphicReview_${restaurantId}`);

      alert('리뷰 등록 성공');
      router.push(`/restaurant/${restaurantId}`);
    } catch (error: any) {
      alert('리뷰 등록 실패');
    }
  };

  const handleRatingChange = (rating: number) => {
    setFormData((prev) => ({ ...prev, rating }));
  };

  const handleKeywordToggle = (keyword: string) => {
    setFormData((prev) => {
      const newKeywords = prev.keywords.includes(keyword)
        ? prev.keywords.filter((k) => k !== keyword)
        : [...prev.keywords, keyword];
      return { ...prev, keywords: newKeywords };
    });
  };

  const handleReceiptAdd = (file: File | string | null) => {
    if (file instanceof File) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const dataUrl = e.target?.result as string;
        setFormData((prev) => ({
          ...prev,
          receiptImage: dataUrl,
        }));
      };
      reader.readAsDataURL(file);
    } else {
      setFormData((prev) => ({
        ...prev,
        receiptImage: null,
      }));
    }
  };

  const handleStoryAdd = (file: File | string | null) => {
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
        rating={formData.rating}
        setRating={handleRatingChange}
        type="graphic"
      />

      <KeywordSelection
        keywords={formData.keywords}
        onKeywordToggle={handleKeywordToggle}
      />

      <section className="mt-[32px] flex w-[791px] gap-[20px]">
        <SinglePhotoUpload
          image={formData.receiptImage}
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
