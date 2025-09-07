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
  focusTopFirst = true, // 랭킹 1 우선 포커스
  topZoomLevel = 4, // 작을수록 더 확대
  preferAreaView = true, // 결과 많으면 지역 뷰(줌아웃)
  areaMinCount = 6, // 이 개수 이상이면 지역 뷰
  areaZoomLevel = 6, // 지역 뷰 줌 레벨
  centerOffsetYPx = 200, // ✅ 중앙에서 '아래로' 531px만큼 센터 이동(양수)
}: {
  center: { lat: number; lng: number };
  places: Place[];
  isLoading?: boolean;
  hasQuery?: boolean;
  focusTopFirst?: boolean;
  topZoomLevel?: number;
  preferAreaView?: boolean;
  areaMinCount?: number;
  areaZoomLevel?: number;
  centerOffsetYPx?: number; // 기본 531
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

  // 랭킹1 포커스 중복 방지
  const lastTopIdRef = useRef<number | null>(null);

  // ✅ 픽셀 오프셋으로 센터 이동(현재 줌 기준의 2D 좌표 → 아래로 양수 dy)
  // dy가 양수이면 지도의 '센터'가 화면에서 아래로 내려가므로,
  // 대상 포인트는 화면에서 더 '위'에 보이게 됩니다.
  const panToWithOffset = (
    m: kakao.maps.Map,
    lat: number,
    lng: number,
    dx = 0,
    dy = 0,
  ) => {
    const proj = m.getProjection();
    const p = proj.pointFromCoords(new kakao.maps.LatLng(lat, lng));
    const target = proj.coordsFromPoint(
      new kakao.maps.Point(p.x + dx, p.y + dy),
    );
    m.setCenter(target);
  };

  // 결과에 맞춰 한 번만 이동/확대 + 2D로 531px 아래(센터)로 오프셋
  useEffect(() => {
    if (!map || !shouldShowPins) return;

    const bounds = new kakao.maps.LatLngBounds();
    places.forEach((p) => bounds.extend(new kakao.maps.LatLng(p.lat, p.lng)));
    map.relayout?.();

    const dy = centerOffsetYPx; // ✅ 아래로 531px

    // 결과가 많으면 지역 뷰 우선
    const useArea = preferAreaView && places.length >= areaMinCount;
    if (useArea && !bounds.isEmpty()) {
      const sw = bounds.getSouthWest();
      const ne = bounds.getNorthEast();
      const centerLat = (sw.getLat() + ne.getLat()) / 2;
      const centerLng = (sw.getLng() + ne.getLng()) / 2;

      map.setLevel(areaZoomLevel);
      panToWithOffset(map, centerLat, centerLng, 0, dy);
      return;
    }

    // 랭킹 1 우선 포커스 + 오프셋
    const top = places[0];
    const topId = top?.id ?? null;
    if (focusTopFirst && top && lastTopIdRef.current !== topId) {
      lastTopIdRef.current = topId;
      map.setLevel(topZoomLevel);
      panToWithOffset(map, top.lat, top.lng, 0, dy);
      return;
    }

    // 기본: 전체 보이기 → fitBounds 후 중앙을 오프셋하여 재설정
    if (!bounds.isEmpty()) {
      map.setBounds(bounds);

      const sw = bounds.getSouthWest();
      const ne = bounds.getNorthEast();
      const centerLat = (sw.getLat() + ne.getLat()) / 2;
      const centerLng = (sw.getLng() + ne.getLng()) / 2;

      // setBounds 반영 직후 한 틱 뒤 오프셋 적용
      setTimeout(() => {
        panToWithOffset(map, centerLat, centerLng, 0, dy);
      }, 0);
    } else {
      panToWithOffset(map, center.lat, center.lng, 0, dy);
    }
  }, [
    map,
    places,
    shouldShowPins,
    focusTopFirst,
    topZoomLevel,
    center.lat,
    center.lng,
    preferAreaView,
    areaMinCount,
    areaZoomLevel,
    centerOffsetYPx, // 531(px)
  ]);

  if (error) return <div className="h-full w-full">지도 로딩 에러</div>;
  if (loading) return <div className="h-full w-full">지도 불러오는 중…</div>;

  // ===== 커스텀 마커/말풍선 UI =====
  const PILL_H = 36,
    GAP_Y = 15,
    TRI_H = 10,
    CARD_W = 182,
    CARD_H = 255;
  const OFFSET_Y = PILL_H + GAP_Y;

  const CARD_BG = '#fff';
  const TRI_OVERLAP = 1;

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
            style={{
              transform: `translateY(-${OFFSET_Y}px)`,
              pointerEvents: 'auto',
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div
              className="relative mx-auto"
              style={{ width: CARD_W, height: CARD_H + TRI_H }}
            >
              <div
                className="absolute left-0 top-0 overflow-hidden rounded-[12px] shadow-[0_12px_24px_rgba(0,0,0,0.2)]"
                style={{ width: CARD_W, height: CARD_H, background: '#fff' }}
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
                  <div className="m-4 h-[223px] w-[150px] rounded-[12px] bg-[#fff]" />
                )}
              </div>
              <div
                className="absolute left-1/2 -translate-x-1/2"
                style={{
                  bottom: TRI_OVERLAP,
                  width: 0,
                  height: 0,
                  borderLeft: '8px solid transparent',
                  borderRight: '8px solid transparent',
                  borderTop: `${TRI_H + TRI_OVERLAP}px solid ${CARD_BG}`,
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
