// hooks/useMediaQuery.ts
import { useEffect, useState } from 'react';

export default function useMediaQuery(query: string) {
  const [matches, setMatches] = useState(false); // SSR에서도 훅은 항상 호출

  useEffect(() => {
    if (typeof window === 'undefined') return; // 효과만 건너뜀
    const mql = window.matchMedia(query);
    // 첫 동기 반영
    setMatches(mql.matches);
    const onChange = (e: MediaQueryListEvent) => setMatches(e.matches);
    mql.addEventListener('change', onChange);
    return () => mql.removeEventListener('change', onChange);
  }, [query]);

  return matches;
}
