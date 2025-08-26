// app/search/page.tsx

import SearchPageClient from '@/components/search/SearchPageClient';

export const dynamic = 'force-dynamic'; // 정적 내보내기/SSR 충돌 방지(검색은 동적이 좋음)

export default function Page({
  searchParams,
}: {
  searchParams: { q?: string };
}) {
  const keyword =
    typeof searchParams.q === 'string' ? searchParams.q.trim() : '';
  return <SearchPageClient initialKeyword={keyword} />;
}
