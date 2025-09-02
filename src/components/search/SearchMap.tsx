// components/search/SearchMap.tsx
'use client';
/* eslint-disable @next/next/no-img-element */
import { useEffect, useMemo, useRef, useState } from 'react';
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
  isLoading = false,
  hasQuery = true,
  focusTopFirst = true,    // ✅ 추가: 랭킹 1번에 포커스
  topZoomLevel = 4,        // ✅ 추가: 줌 레벨(작을수록 확대)
}: {
  center: { lat: number; lng: number };
  places: Place[];
  isLoading?: boolean;
  hasQuery?: boolean;
  focusTopFirst?: boolean;
  topZoomLevel?: number;
}) {
  const [loading, error] = useKakaoLoader({
    appkey: process.env.NEXT_PUBLIC_KAKAO_JS_KEY!,
    libraries: ['services', 'clusterer', 'drawing'],
  });

  const [map, setMap] = useState<kakao.maps.Map | null>(null);
  const [activeId, setActiveId] = useState<number | null>(null);
  const activePlace = useMemo(
    () => places.find((p) => p.id === activeId) ?? null,
    [activeId, places],
  );

  const shouldShowPins = hasQuery && !isLoading && places.length > 0;

  // 결과 바뀌면 오버레이 닫기
  useEffect(() => setActiveId(null), [places]);

  // 🔒 첫 번째(랭킹1)으로 센터 이동을 중복 방지
  const lastTopIdRef = useRef<number | null>(null);

  // 필요시 오버레이 공간만큼 픽셀 오프셋 주는 유틸 (주석 해제해서 사용 가능)
  // const panToWithOffset = (m: kakao.maps.Map, lat: number, lng: number, dx = 0, dy = 0) => {
  //   const proj = m.getProjection();
  //   const p = proj.pointFromCoords(new kakao.maps.LatLng(lat, lng));
  //   const target = proj.coordsFromPoint(new kakao.maps.Point(p.x + dx, p.y + dy));
  //   m.panTo(target);
  // };

  // 결과에 맞춰 이동/확대
  useEffect(() => {
    if (!map || !shouldShowPins) return;

    const top = places[0]; // SQL 정렬순 1등
    const topId = top?.id ?? null;

    // ✅ 랭킹1 우선 포커스(한 번만)
    if (focusTopFirst && top && lastTopIdRef.current !== topId) {
      lastTopIdRef.current = topId;
      map.relayout?.();
      map.setLevel(topZoomLevel);
      map.setCenter(new kakao.maps.LatLng(top.lat, top.lng));
      // 오버레이 공간을 위해 아래처럼 약간 위로 올리고 싶다면:
      // panToWithOffset(map, top.lat, top.lng, 0, 80);  // dy=+는 화면 아래쪽으로 이동
      return;
    }

    // 기본: 전체 결과가 보이도록 fitBounds
    const bounds = new kakao.maps.LatLngBounds();
    places.forEach((p) => bounds.extend(new kakao.maps.LatLng(p.lat, p.lng)));
    map.relayout?.();
    if (!bounds.isEmpty()) {
      map.setBounds(bounds);
    } else {
      map.setCenter(new kakao.maps.LatLng(center.lat, center.lng));
    }
  }, [map, places, shouldShowPins, focusTopFirst, topZoomLevel, center.lat, center.lng]);

  if (error) return <div className="h-full w-full">지도 로딩 에러</div>;
  if (loading) return <div className="h-full w-full">지도 불러오는 중…</div>;

  // ===== 아래는 네가 이미 구현한 커스텀 마커/말풍선 그대로 유지 =====
  const PILL_H = 36, GAP_Y = 15, TRI_H = 10, CARD_W = 182, CARD_H = 255;
  const OFFSET_Y = PILL_H + GAP_Y;

  return (
    <Map
      style={{ width: '100%', height: '100%', minHeight: 320 }}
      center={center}
      level={5}
      isPanto
      onCreate={(m) => setMap(m)}
      onClick={() => setActiveId(null)}
    >
      {shouldShowPins &&
        places.map((p) => (
          <CustomOverlayMap
            key={p.id}
            position={{ lat: p.lat, lng: p.lng }}
            yAnchor={1}
            zIndex={activeId === p.id ? 10 : 1}
          >
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                setActiveId((cur) => (cur === p.id ? null : p.id));
              }}
              className={[
                'inline-flex items-center gap-[10px] py-[6px] pl-[6px] pr-[10px]',
                'rounded-full border border-[#EE7540]',
                activeId === p.id ? 'bg-[#FFF0EA]' : 'bg-[#FFF7F5]',
                'shadow-sm',
              ].join(' ')}
              style={{ pointerEvents: 'auto' }}
            >
              <span className="grid h-6 w-6 place-items-center rounded-full bg-[#EE7540] text-[12px] font-bold leading-none text-white">
                L
              </span>
              <span className="max-w-[200px] truncate text-[14px] font-semibold text-[#171719]">
                {p.name}
              </span>
            </button>
          </CustomOverlayMap>
        ))}

      {shouldShowPins && activePlace && (
        <CustomOverlayMap
          position={{ lat: activePlace.lat, lng: activePlace.lng }}
          yAnchor={1}
          zIndex={20}
        >
          <div
            style={{ transform: `translateY(-${OFFSET_Y}px)`, pointerEvents: 'auto' }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="relative mx-auto" style={{ width: CARD_W, height: CARD_H + TRI_H }}>
              <div
                className="absolute left-0 top-0 overflow-hidden rounded-[12px] shadow-[0_12px_24px_rgba(0,0,0,0.2)]"
                style={{ width: CARD_W, height: CARD_H, background: '#D9D9D9' }}
              >
                {activePlace.cover_image_url ? (
                  <div className="m-4 h-[223px] w-[150px] overflow-hidden rounded-[12px]">
                    <img
                      src={activePlace.cover_image_url}
                      alt={activePlace.name}
                      className="h-full w-full select-none object-cover"
                      draggable={false}
                    />
                  </div>
                ) : (
                  <div className="m-4 h-[223px] w-[150px] rounded-[12px] bg-[#cfcfcf]" />
                )}
              </div>
              <div
                className="absolute left-1/2 -translate-x-1/2"
                style={{
                  bottom: 0,
                  width: 0,
                  height: 0,
                  borderLeft: '8px solid transparent',
                  borderRight: '8px solid transparent',
                  borderTop: `${TRI_H}px solid #D9D9D9`,
                  filter: 'drop-shadow(0 2px 2px rgba(0,0,0,0.15))',
                }}
              />
            </div>
          </div>
        </CustomOverlayMap>
      )}
    </Map>
  );
}
