'use client';
import { CustomOverlayMap, Map, useKakaoLoader } from 'react-kakao-maps-sdk';

type Place = {
  id: number;
  name: string;
  lat: number;
  lng: number;
  cover_image_url?: string | null;
  avg_rating?: number | string | null;
  review_count?: number | string | null;
};

export default function SearchMap({
  center,
  places,
}: {
  center: { lat: number; lng: number };
  places: Place[];
}) {
  // 📌 카카오 스크립트 로더 (환경변수는 NEXT_PUBLIC_로 시작해야 브라우저에 노출됨)
  const [loading, error] = useKakaoLoader({
    appkey: process.env.NEXT_PUBLIC_KAKAO_JS_KEY!, // JS 키
    libraries: ['services', 'clusterer', 'drawing'],
  });

  console.log(
    'KAKAO_KEY(prefix)=',
    process.env.NEXT_PUBLIC_KAKAO_JS_KEY?.slice(0, 6),
  );
  console.log('loader states', { loading, error });

  if (error) return <div className="h-[1019px] w-[976px]">지도 로딩 에러</div>;
  if (loading)
    return <div className="h-[1019px] w-[976px]">지도 불러오는 중…</div>;

  return (
    // ✅ className만으로도 될 때가 있지만, height/width는 style로 주면 안전
    <Map center={center} level={5} style={{ height: '1019px', width: '976px' }}>
      {places.map((p) => {
        const rating = Number.isFinite(Number(p.avg_rating))
          ? Number(p.avg_rating).toFixed(1)
          : '–';
        const cnt = Number(p.review_count) || 0;

        return (
          <CustomOverlayMap key={p.id} position={{ lat: p.lat, lng: p.lng }}>
            <div className="rounded-2xl bg-white p-2 shadow-[0_4px_16px_rgba(0,0,0,0.2)]">
              <div className="mb-1 text-xs text-gray-600">{p.name}</div>
              <div className="flex items-center gap-1 text-sm">
                <span>⭐</span>
                <span>{rating}</span>
                <span className="text-gray-500">({cnt})</span>
              </div>
              {p.cover_image_url && (
                <div className="mt-2 h-[120px] w-[180px] overflow-hidden rounded-lg bg-gray-200">
                  <img
                    src={p.cover_image_url}
                    alt={p.name}
                    className="h-full w-full object-cover"
                  />
                </div>
              )}
            </div>
          </CustomOverlayMap>
        );
      })}
    </Map>
  );
}
