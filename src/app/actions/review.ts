// app/actions/review.ts
// 클라이언트에서 import하는 fetch 전용

export type StoryCard = {
  id: string;
  restaurant_id?: string;
  created_at?: string;
  background_image_url: string;
  keywords?: string[];
  story_preview_url?: string | null;
  nickname?: string;
  profile_image?: string;
  elements: any[];
};

const ORIGIN = (
  process.env.NEXT_PUBLIC_API_BASE_URL || 'https://test-shhu.onrender.com'
).replace(/\/+$/, '');

// ✅ URL 정규화:
// - 절대 URL(http/https)은 그대로
// - 프론트 정적(/assets/...)은 그대로 (public에서 서빙)
// - 그 외(/uploads/... 등)만 백엔드 ORIGIN 붙이기
const toFrontUrl = (u?: string | null) => {
  if (!u) return '';
  if (u.startsWith('http')) return u;
  if (u.startsWith('/assets/')) return u;
  return `${ORIGIN}${u}`;
};

export async function getLatestStoryCards(
  limit = 12,
  offset = 0,
): Promise<StoryCard[]> {
  const url = `${ORIGIN}/api/reviews/graphic?limit=${limit}&offset=${offset}`;
  const res = await fetch(url, { cache: 'no-store' });
  const text = await res.text();

  if (!res.ok) {
    console.error('[getLatestStoryCards] HTTP', res.status, text.slice(0, 400));
    throw new Error(`GET /api/reviews/graphic failed ${res.status}`);
  }

  let json: any = {};
  try {
    json = text ? JSON.parse(text) : {};
  } catch (e) {
    console.error(
      '[getLatestStoryCards] JSON parse error:',
      text.slice(0, 400),
    );
    throw e;
  }

  const rawItems: StoryCard[] = Array.isArray(json?.data) ? json.data : [];

  // ✅ 여기서 한 번에 정규화해서 반환
  const items = rawItems.map((c) => ({
    ...c,
    background_image_url: toFrontUrl(c.background_image_url),
    elements: (c.elements ?? []).map((el: any) => ({
      ...el,
      src: toFrontUrl(el.src),
    })),
  }));

  return items;
}
