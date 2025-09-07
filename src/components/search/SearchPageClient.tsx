// components/search/SearchPageClient.tsx
'use client';

import SearchMap from '@/components/search/SearchMap';
import SearchResultList from '@/components/search/SearchResultList';
import { useInfiniteMapSearch } from '@/hooks/useSearchNavigate';
import { useSearchParams } from 'next/navigation';
import MobileBottomSheet from './MobileBottomSheet';
import TopBar from './TopBar';

const SearchPageClient = ({ initialKeyword }: { initialKeyword: string }) => {
  const sp = useSearchParams();

  let kwFromUrl: string[] = [];
  try {
    const raw = sp.get('keywords');
    const arr = raw ? (JSON.parse(raw) as unknown) : [];
    if (Array.isArray(arr)) {
      const onlyStr = arr.filter((v): v is string => typeof v === 'string');
      kwFromUrl = onlyStr.filter((v, i) => onlyStr.indexOf(v) === i);
    }
  } catch {}

  const hasActiveInputs =
    (initialKeyword?.trim()?.length ?? 0) > 0 || kwFromUrl.length > 0;

  const q = useInfiniteMapSearch(initialKeyword, {
    keywords: kwFromUrl,
    enabled: hasActiveInputs,
  });

  const rqStatus = q.status as 'loading' | 'pending' | 'error' | 'success';
  const normalizedStatus: 'pending' | 'error' | 'success' =
    rqStatus === 'loading' ? 'pending' : rqStatus;

  const isBusy =
    (('isPending' in q
      ? (q as any).isPending
      : (q as any).isLoading) as boolean) || q.isFetching;

  const items = q.data?.pages?.flatMap((p) => p.items) ?? [];
  const center = {
    lat: q.data?.pages?.[0]?.center?.lat ?? 37.5665,
    lng: q.data?.pages?.[0]?.center?.lng ?? 126.978,
  };

  // 검색 전 상태
  if (!hasActiveInputs) {
    return (
      <div className="relative w-full lg:mx-auto lg:mt-16 lg:grid lg:max-w-[1520px] lg:gap-6 lg:px-10 lg:[grid-template-columns:464px_minmax(0,1fr)]">
        <aside className="hidden border-l border-[#E2E2E4] lg:block">
          <div className="flex h-[calc(100vh-96px)] flex-col">
            <div className="border-b border-[#E2E2E4] p-5">
              <TopBar initialKeyword={initialKeyword} />
            </div>
            <div className="flex-1 overflow-hidden p-6 text-sm text-[#787882]">
              검색어 또는 필터를 선택해 주세요.
            </div>
          </div>
        </aside>

        {/* ✅ 지도 칼럼과 내부 래퍼 둘 다 min-w-0 */}
        <section className="min-w-0 lg:h-[calc(100vh-96px)]">
          <div className="h-[calc(100vh-64px)] w-full min-w-0 overflow-hidden lg:h-full lg:rounded-xl lg:border lg:border-[#E2E2E4]">
            <SearchMap center={center} places={[]} />
          </div>

          <div className="fixed left-0 right-0 top-[64px] z-20 block p-3 lg:hidden">
            <TopBar initialKeyword={initialKeyword} />
          </div>

          {/* ✅ 검색값이 없어도 BottomSheet를 항상 마운트 (FilterBar만 노출됨) */}
          <MobileBottomSheet
            items={[]} // 결과 없음
            status="success" // 무엇이든 OK; 내부는 URL 기준으로 분기함
            error={undefined}
            hasNextPage={false}
            isFetchingNextPage={false}
            fetchNextPage={() => {}} // no-op
            initialKeyword={initialKeyword}
            // enableDesktop
          />
        </section>
      </div>
    );
  }

  // 검색 활성화
  if (normalizedStatus === 'pending') return <div className="p-4">로딩중…</div>;
  if (normalizedStatus === 'error')
    return (
      <div className="p-4 text-red-600">
        {(q.error as Error)?.message ?? '오류'}
      </div>
    );

  return (
    <div className="relative w-full lg:mx-auto lg:mt-16 lg:grid lg:max-w-[1520px] lg:gap-6 lg:px-10 lg:[grid-template-columns:464px_minmax(0,1fr)]">
      <aside className="hidden border-l border-[#E2E2E4] lg:block">
        <div className="flex h-[calc(100vh-96px)] flex-col">
          <div className="border-b border-[#E2E2E4] p-5">
            <TopBar initialKeyword={initialKeyword} />
          </div>
          <div className="min-h-0 flex-1 overflow-x-hidden overscroll-contain">
            <SearchResultList
              items={items}
              status={normalizedStatus}
              error={q.error}
              hasNextPage={!!q.hasNextPage}
              isFetchingNextPage={!!q.isFetchingNextPage}
              fetchNextPage={() => void q.fetchNextPage()}
            />
          </div>
        </div>
      </aside>

      {/* ✅ 지도 칼럼과 내부 래퍼 둘 다 min-w-0 */}
      <section className="min-w-0 lg:h-[calc(100vh-96px)]">
        <div className="h-[calc(100vh-64px)] w-full min-w-0 overflow-hidden lg:h-[calc(100vh-96px)] lg:rounded-xl lg:border lg:border-[#E2E2E4]">
          <SearchMap
            center={center}
            places={items}
            isLoading={isBusy}
            hasQuery={hasActiveInputs}
            focusTopFirst
            topZoomLevel={4}
          />
        </div>

        <div className="fixed left-0 right-0 top-[64px] z-20 block p-3 lg:hidden">
          <TopBar initialKeyword={initialKeyword} />
        </div>

        {/* ✅ 검색 활성화일 때도 항상 마운트 (내부에서 리스트/헤더 보여줌) */}
        <MobileBottomSheet
          items={items ?? []}
          status={normalizedStatus}
          error={q?.error}
          hasNextPage={!!q?.hasNextPage}
          isFetchingNextPage={!!q?.isFetchingNextPage}
          fetchNextPage={() => {
            if (q?.fetchNextPage) void q.fetchNextPage();
          }}
          initialKeyword={initialKeyword}
          // enableDesktop
        />
      </section>
    </div>
  );
};

export default SearchPageClient;
