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

// ---- 안전한 URL 빌더 ----
function sanitizeOrigin(input?: string) {
  return (input ?? '')
    .trim()
    .replace(/^['"]+|['"]+$/g, '') // 앞뒤 따옴표 제거
    .replace(/\/+$/, '');          // 끝 슬래시 제거
}

function buildApiUrl(path: string, params: Record<string, string | number | undefined>) {
  const base = sanitizeOrigin(process.env.NEXT_PUBLIC_API_BASE);

  const qs = new URLSearchParams();
  Object.entries(params).forEach(([k, v]) => {
    if (v !== undefined && v !== null && v !== '') qs.set(k, String(v));
  });

  if (base) return `${base}${path}?${qs.toString()}`;
  if (typeof window !== 'undefined') return `${path}?${qs.toString()}`;

  // 서버 사이드에서 BASE 없으면 명확히 에러
  throw new Error('API base URL is missing. Set NEXT_PUBLIC_API_BASE in Vercel.');
}


// ---- 여기만 교체 ----
async function fetchNearby(params: {
  keyword: string;
  offset: number;
  limit?: number;
  signal?: AbortSignal;
}): Promise<NearbyResponse> {
  const { keyword, offset, limit = PAGE_SIZE, signal } = params;

  const href = buildApiUrl('/api/restaurants/nearby', {
    q: keyword || undefined,
    limit,
    offset,
  });

  const res = await fetch(href, { signal });
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
