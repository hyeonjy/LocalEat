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
  // 디버깅: 환경변수와 origin 값 확인
  console.log('🔍 getOrigin 디버깅:');
  console.log('RAW_BASE:', RAW_BASE);
  console.log('RAW_BASE.trim():', RAW_BASE.trim());

  // 끝 슬래시 제거
  const fromEnv = RAW_BASE.replace(/\/$/, '');
  console.log('fromEnv (끝 슬래시 제거 후):', fromEnv);

  if (fromEnv) {
    console.log('✅ 환경변수에서 origin 사용:', fromEnv);
    return fromEnv;
  }

  // 브라우저 환경이면 현재 도메인으로 폴백
  if (typeof window !== 'undefined') {
    const browserOrigin = window.location.origin;
    console.log('✅ 브라우저 origin 사용:', browserOrigin);
    return browserOrigin;
  }

  // 서버에서 불리면 에러(환경변수 넣으라는 안내)
  console.error('❌ 서버사이드에서 origin을 가져올 수 없음');
  throw new Error(
    'API base URL is missing. Set NEXT_PUBLIC_API_BASE in Vercel.',
  );
};

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
async function fetchNearby(params: {
  keyword: string;
  offset: number;
  limit?: number;
  signal?: AbortSignal;
}): Promise<NearbyResponse> {
  const { keyword, offset, limit = PAGE_SIZE, signal } = params;

  console.log('🔍 fetchNearby 호출됨:', { keyword, offset, limit });

  try {
    const origin = getOrigin();
    console.log('✅ getOrigin 결과:', origin);

    // ✅ 기준 URL + 상대경로 방식이 new URL에 가장 안전
    const url = new URL('/api/restaurants/nearby', origin);
    console.log('✅ URL 생성 성공:', url.toString());
    console.log('URL 객체:', url);

    if (keyword) url.searchParams.set('q', keyword);
    url.searchParams.set('limit', String(limit));
    url.searchParams.set('offset', String(offset));

    console.log('✅ 최종 URL:', url.toString());
    console.log('검색 파라미터:', {
      q: url.searchParams.get('q'),
      limit: url.searchParams.get('limit'),
      offset: url.searchParams.get('offset'),
    });

    const res = await fetch(url.toString(), { signal });
    if (!res.ok) {
      const text = await res.text().catch(() => '');
      throw new Error(`검색 실패: ${res.status} ${text}`);
    }
    return res.json();
  } catch (error) {
    console.error('❌ fetchNearby 오류:', error);
    console.error('오류 상세:', {
      message: error instanceof Error ? error.message : String(error),
      stack: error instanceof Error ? error.stack : undefined,
    });
    throw error;
  }
}

export function useInfiniteMapSearch(keyword?: string) {
  console.log('🔍 useInfiniteMapSearch 호출됨:', { keyword });

  return useInfiniteQuery<NearbyResponse>({
    queryKey: ['nearby', keyword ?? ''], // 빈 문자열로 고정해 캐시키 안정화
    queryFn: ({ pageParam = 0, signal }) => {
      console.log('🔍 queryFn 실행:', { pageParam, keyword: keyword ?? '' });
      return fetchNearby({
        keyword: keyword ?? '',
        offset: pageParam as number,
        signal,
      });
    },
    initialPageParam: 0,
    getNextPageParam: (last) =>
      last.items.length < PAGE_SIZE ? undefined : last.next_offset,
    // ✅ keyword가 undefined일 때만 막고, ''(빈 문자열)는 호출 허용
    enabled: keyword !== undefined,
    staleTime: 1000 * 30,
  });
}
