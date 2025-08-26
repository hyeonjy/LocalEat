'use client';
import { useEffect, useRef } from 'react';
import SearchResultItem from './SearchResultItem';

type Props = {
  items: any[];
  status: 'pending' | 'success' | 'error';
  error?: unknown;
  hasNextPage: boolean;
  isFetchingNextPage: boolean;
  fetchNextPage: () => void;
};

export default function SearchResultList({
  items,
  status,
  error,
  hasNextPage,
  isFetchingNextPage,
  fetchNextPage,
}: Props) {
  const sentinelRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!hasNextPage || !sentinelRef.current) return;
    const io = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting && hasNextPage && !isFetchingNextPage) {
        fetchNextPage();
      }
    });
    io.observe(sentinelRef.current);
    return () => io.disconnect();
  }, [hasNextPage, isFetchingNextPage, fetchNextPage]);

  if (status === 'pending') {
    return (
      <div className="p-4">
        <div className="animate-pulse space-y-4">
          <div className="h-6 w-1/3 rounded bg-gray-200" />
          <div className="h-4 w-1/2 rounded bg-gray-200" />
          <div className="h-[170px] w-[464px] rounded bg-gray-200" />
        </div>
      </div>
    );
  }

  if (status === 'error') {
    return (
      <div className="p-4 text-red-600">
        검색 중 오류가 발생했습니다. {String((error as any)?.message || '')}
      </div>
    );
  }

  return (
    <div>
      {items.map((it) => (
        <SearchResultItem key={it.id} it={it} />
      ))}
      <div ref={sentinelRef} style={{ height: 1 }} />
      {isFetchingNextPage && (
        <div className="py-4 text-center text-sm text-[#787882]">
          불러오는 중…
        </div>
      )}
      {!hasNextPage && items.length > 0 && (
        <div className="py-4 text-center text-sm text-[#787882]">
          끝까지 봤어요
        </div>
      )}
      {items.length === 0 && (
        <div className="py-8 text-center text-sm text-[#787882]">
          검색 결과가 없어요
        </div>
      )}
    </div>
  );
}
