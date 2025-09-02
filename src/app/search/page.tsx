import SearchPageClient from '@/components/search/SearchPageClient';

// app/search/page.tsx (예시)
export default function Page({
  searchParams,
}: {
  searchParams: { q?: string };
}) {
  const initialKeyword =
    typeof searchParams.q === 'string' ? searchParams.q : '';
  return <SearchPageClient initialKeyword={initialKeyword} />;
}
