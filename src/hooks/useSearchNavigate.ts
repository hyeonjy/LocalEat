// hooks/useSearchNavigate.ts
import { useInfiniteQuery } from '@tanstack/react-query';

type NearbyResponse = {
  items: any[];
  next_offset: number;
  center: { lat: number | null; lng: number | null; radius?: number | null };
};

const PAGE_SIZE = 10;

function sanitizeOrigin(input?: string) {
  return (input ?? '')
    .trim()
    .replace(/^['"]+|['"]+$/g, '')
    .replace(/\/+$/, '');
}
function buildApiUrl(path: string, params: Record<string, any>) {
  const base = sanitizeOrigin(process.env.NEXT_PUBLIC_API_BASE);
  const qs = new URLSearchParams();
  Object.entries(params).forEach(([k, v]) => {
    if (v !== undefined && v !== null && v !== '') qs.set(k, String(v));
  });
  if (base) return `${base}${path}?${qs.toString()}`;
  if (typeof window !== 'undefined') return `${path}?${qs.toString()}`;
  throw new Error(
    'API base URL is missing. Set NEXT_PUBLIC_API_BASE in Vercel.',
  );
}

async function fetchNearby({
  keyword,
  offset,
  limit = PAGE_SIZE,
  keywords,
  signal,
}: {
  keyword: string;
  offset: number;
  limit?: number;
  keywords?: string[];
  signal?: AbortSignal;
}): Promise<NearbyResponse> {
  const href = buildApiUrl('/api/restaurants/nearby', {
    q: keyword || undefined,
    limit,
    offset,
    // 🔑 URL로 백엔드에 키워드 배열 전달(있을 때만)
    keywords:
      keywords && keywords.length ? JSON.stringify(keywords) : undefined,
  });
  const res = await fetch(href, { signal });
  if (!res.ok) throw new Error(`HTTP ${res.status} ${res.statusText}`);
  return res.json();
}

export function useInfiniteMapSearch(
  keyword?: string,
  opts?: { enabled?: boolean; keywords?: string[] },
) {
  const trimmed = (keyword ?? '').trim();
  const kwArr = opts?.keywords ?? [];

  // ✅ 키워드(텍스트) 또는 필터가 하나라도 있어야 요청
  const enabledByInputs = trimmed.length > 0 || kwArr.length > 0;

  return useInfiniteQuery<NearbyResponse, Error>({
    queryKey: ['nearby', trimmed, { keywords: kwArr }],
    queryFn: ({ pageParam = 0, signal }) =>
      fetchNearby({
        keyword: trimmed,
        offset: pageParam as number,
        keywords: kwArr,
        signal,
      }),
    initialPageParam: 0,
    getNextPageParam: (last) =>
      last.items.length < PAGE_SIZE ? undefined : last.next_offset,
    retry: 1,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
    retryOnMount: false,
    staleTime: 30_000,
    enabled: (opts?.enabled ?? true) && enabledByInputs, // ← 핵심
  });
}
