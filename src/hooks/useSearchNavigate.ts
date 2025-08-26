import { useInfiniteQuery } from '@tanstack/react-query';

type Place = {
  id: number;
  name: string;
  address: string;
  lat: number;
  lng: number;
  // 필요시 cover_image_url, avg_rating 등 추가
};

type NearbyResponse = {
  items: Place[];
  next_offset: number;
  center: { lat: number | null; lng: number | null; radius?: number | null };
};

const PAGE_SIZE = 10;

const RAW_BASE = (process.env.NEXT_PUBLIC_API_BASE ?? '').trim();
const getOrigin = () => {
  // 끝 슬래시 제거
  const fromEnv = RAW_BASE.replace(/\/$/, '');
  if (fromEnv) return fromEnv;
  // 브라우저 환경이면 현재 도메인으로 폴백
  if (typeof window !== 'undefined') return window.location.origin;
  // 서버에서 불리면 에러(환경변수 넣으라는 안내)
  throw new Error(
    'API base URL is missing. Set NEXT_PUBLIC_API_BASE in Vercel.',
  );
};

async function fetchNearby(params: {
  keyword: string;
  offset: number;
  limit?: number;
  signal?: AbortSignal;
}): Promise<NearbyResponse> {
  const { keyword, offset, limit = PAGE_SIZE, signal } = params;

  const origin = getOrigin();
  // ✅ 기준 URL + 상대경로 방식이 new URL에 가장 안전
  const url = new URL('/api/restaurants/nearby', origin);

  if (keyword) url.searchParams.set('q', keyword);
  url.searchParams.set('limit', String(limit));
  url.searchParams.set('offset', String(offset));

  const res = await fetch(url.toString(), { signal });
  if (!res.ok) {
    const text = await res.text().catch(() => '');
    throw new Error(`검색 실패: ${res.status} ${text}`);
  }
  return res.json();
}
export function useInfiniteMapSearch(keyword?: string) {
  return useInfiniteQuery<NearbyResponse>({
    queryKey: ['nearby', keyword ?? ''], // 빈 문자열로 고정해 캐시키 안정화
    queryFn: ({ pageParam = 0, signal }) =>
      fetchNearby({
        keyword: keyword ?? '',
        offset: pageParam as number,
        signal,
      }),
    initialPageParam: 0,
    getNextPageParam: (last) =>
      last.items.length < PAGE_SIZE ? undefined : last.next_offset,
    // ✅ keyword가 undefined일 때만 막고, ''(빈 문자열)는 호출 허용
    enabled: keyword !== undefined,
    staleTime: 1000 * 30,
  });
}
