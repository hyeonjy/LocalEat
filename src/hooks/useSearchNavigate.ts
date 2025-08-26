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
    .replace(/\/+$/, ''); // 끝 슬래시 제거
}

function buildApiUrl(
  path: string,
  params: Record<string, string | number | undefined>,
) {
  const base = sanitizeOrigin(process.env.NEXT_PUBLIC_API_BASE);

  const qs = new URLSearchParams();
  Object.entries(params).forEach(([k, v]) => {
    if (v !== undefined && v !== null && v !== '') qs.set(k, String(v));
  });

  if (base) return `${base}${path}?${qs.toString()}`;
  if (typeof window !== 'undefined') return `${path}?${qs.toString()}`;

  // 서버 사이드에서 BASE 없으면 명확히 에러
  throw new Error(
    'API base URL is missing. Set NEXT_PUBLIC_API_BASE in Vercel.',
  );
}

// ---- 여기만 교체 ----
async function fetchNearby({
  keyword,
  offset,
  limit = PAGE_SIZE,
  signal,
}: {
  keyword: string;
  offset: number;
  limit?: number;
  signal?: AbortSignal;
}): Promise<NearbyResponse> {
  const href = buildApiUrl('/api/restaurants/nearby', {
    q: keyword || undefined,
    limit,
    offset,
  });

  try {
    const res = await fetch(href, { signal /*, credentials: 'include'*/ });
    if (!res.ok) {
      const text = await res.text().catch(() => '');
      // 서버가 502면 여기로 들어옴(이때 CORS 헤더도 없어서 브라우저 콘솔엔 CORS에러처럼 보일 수 있음)
      throw new Error(
        `HTTP ${res.status} ${res.statusText} :: ${text.slice(0, 200)}`,
      );
    }
    return res.json();
  } catch (err: any) {
    // 네트워크/Abort/CORS 차단 등은 여기로 떨어짐
    console.error('fetchNearby 오류:', {
      href,
      name: err?.name,
      message: err?.message,
      isAbort: err?.name === 'AbortError',
    });
    // Abort는 조용히 무시하고 싶다면: if (err?.name === 'AbortError') throw err;  // RQ가 처리
    throw err;
  }
}

export function useInfiniteMapSearch(keyword?: string) {
  return useInfiniteQuery<NearbyResponse>({
    queryKey: ['nearby', keyword ?? ''],
    queryFn: ({ pageParam = 0, signal }) =>
      fetchNearby({
        keyword: keyword ?? '',
        offset: pageParam as number,
        signal,
      }),
    initialPageParam: 0,
    getNextPageParam: (last) =>
      last.items.length < PAGE_SIZE ? undefined : last.next_offset,

    // 🔧 네트워크 불안정/콜드스타트시 튀는 에러 완화
    retry: 1, // 재시도 1회(또는 false)
    refetchOnWindowFocus: false, // 탭 포커스시 재요청 방지
    refetchOnReconnect: false, // 네트워크 재연결시 재요청 방지
    retryOnMount: false, // 마운트 시 재요청 방지
    // useErrorBoundary: false,    // QueryClient에서 true로 켰다면 여기서 끄기
    staleTime: 30_000,
    enabled: keyword !== undefined,
  });
}