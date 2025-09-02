'use client';
import { OpeningHours } from '@/types/restaurant';
import Image from 'next/image';
import { useEffect, useRef, useState } from 'react';
import { CustomOverlayMap, Map, useKakaoLoader } from 'react-kakao-maps-sdk';

type Place = {
  id: number;
  name: string;
  address: string;
  lat: number;
  lng: number;
  phone: string;
  category: string;
  opening_hours: OpeningHours;
  closed_days: string | null;
  parking: boolean;
  pet_allowed: boolean;
  image_url: string;
  created_at: string;
  average_rating: string;
  review_count: string;
};

type RestaurantReviewMapProps = {
  place: Place;
  onClose: () => void;
};

// 하버사인 거리 계산 (m 단위)
function distanceMeters(
  lat1: number,
  lng1: number,
  lat2: number,
  lng2: number,
) {
  const R = 6371000;
  const toRad = (v: number) => (v * Math.PI) / 180;

  const dLat = toRad(lat2 - lat1);
  const dLng = toRad(lng2 - lng1);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRad(lat1)) *
      Math.cos(toRad(lat2)) *
      Math.sin(dLng / 2) *
      Math.sin(dLng / 2);

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

const RestaurantReviewMap = ({ place, onClose }: RestaurantReviewMapProps) => {
  const mapRef = useRef<any>(null);
  const modalRef = useRef<HTMLDivElement>(null);
  const [currentLevel, setCurrentLevel] = useState(2);
  const [mapHeight, setMapHeight] = useState('333px');
  const [mapWidth, setMapWidth] = useState('100%');
  const [mapCenter, setMapCenter] = useState({
    lat: place.lat,
    lng: place.lng,
  });

  const [loading, error] = useKakaoLoader({
    appkey: process.env.NEXT_PUBLIC_KAKAO_JS_KEY!, // JS 키
    libraries: ['services', 'clusterer', 'drawing'],
  });

  // 화면 크기에 따른 지도 크기 설정
  useEffect(() => {
    let resizeTimeout: NodeJS.Timeout;

    const updateMapSize = () => {
      let newHeight = '333px';
      let newWidth = '288px';
      let screenMultiplier = 2;

      if (window.innerWidth >= 1024) {
        newHeight = '600px';
        newWidth = '980px';
        screenMultiplier = 1;
      } else if (window.innerWidth >= 768) {
        newHeight = '481px';
        newWidth = '519px';
        screenMultiplier = 1.5;
      }

      setMapHeight(newHeight);
      setMapWidth(newWidth);
    };

    const debouncedUpdateMapSize = () => {
      clearTimeout(resizeTimeout);
      resizeTimeout = setTimeout(updateMapSize, 100);
    };

    updateMapSize();
    window.addEventListener('resize', debouncedUpdateMapSize);
    return () => {
      window.removeEventListener('resize', debouncedUpdateMapSize);
      clearTimeout(resizeTimeout);
    };
  }, [place.lat, place.lng]);

  // 배경 클릭 감지
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        modalRef.current &&
        !modalRef.current.contains(event.target as Node)
      ) {
        onClose();
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [onClose]);

  if (error) return;
  if (loading) return;

  const maxDistance = 500; // 500m 이상 벗어나면 복귀

  // 화면 크기에 따른 마커 위치 오프셋 계산
  const getMarkerOffset = () => {
    // 화면 크기에 따라 마커가 지도 가운데에 보이도록 오프셋 조정
    if (window.innerWidth >= 1024) {
      return 0.0001; // 데스크톱
    } else if (window.innerWidth >= 768) {
      return 0.00015; // 태블릿
    } else {
      return 0.0002; // 모바일
    }
  };

  // 식당 위치로 이동하는 함수
  const moveToRestaurant = () => {
    if (mapRef.current) {
      mapRef.current.panTo(new window.kakao.maps.LatLng(place.lat, place.lng));
    }
  };

  // 지도 확대 함수
  const zoomIn = () => {
    if (mapRef.current) {
      const level = mapRef.current.getLevel();
      if (level > 1) {
        mapRef.current.setLevel(level - 1);
        setCurrentLevel(level - 1);
      }
    }
  };

  // 지도 축소 함수
  const zoomOut = () => {
    if (mapRef.current) {
      const level = mapRef.current.getLevel();
      if (level < 10) {
        mapRef.current.setLevel(level + 1);
        setCurrentLevel(level + 1);
      }
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center bg-[rgba(0,0,0,0.6)] pt-[101px] lg:pt-[79px]">
      <div
        ref={modalRef}
        className="relative max-w-[288px] rounded-lg bg-white shadow-lg md:max-w-[519px] lg:max-w-[980px]"
      >
        <button
          onClick={onClose}
          className="absolute right-0 top-[-28px] z-20 flex items-center justify-center"
        >
          <span className="text-[16px] font-normal leading-[130%] text-white">
            닫기 x
          </span>
        </button>

        {/* 지도 */}
        <div className="relative h-[333px] w-[288px] overflow-hidden rounded-lg md:h-[481px] md:w-[519px] lg:h-[600px] lg:w-[980px]">
          <div className="absolute right-[20px] top-[100px] z-10">
            <button
              type="button"
              onClick={moveToRestaurant}
              className="h-[44px] w-[44px] rounded-[8px] bg-white p-[10px] shadow-[0px_0px_8px_0px_rgba(0,0,0,0.30)] hover:bg-gray-50"
            >
              <Image
                src="/assets/icons/map.svg"
                alt="현 위치로 이동"
                width={22}
                height={22}
              />
            </button>
            <div className="mt-[12px] h-[88px] w-[44px] rounded-[8px] bg-white shadow-[0px_0px_8px_0px_rgba(0,0,0,0.30)]">
              <button
                type="button"
                onClick={zoomIn}
                className="flex h-[44px] w-[44px] items-center justify-center border-b border-[#EBEBEB] p-[10px] hover:bg-gray-50"
              >
                <Image
                  src="/assets/icons/plus.svg"
                  alt="플러스"
                  width={18}
                  height={18}
                />
              </button>
              <button
                type="button"
                onClick={zoomOut}
                className="flex h-[44px] w-[44px] items-center justify-center p-[10px] hover:bg-gray-50"
              >
                <Image
                  src="/assets/icons/minus.svg"
                  alt="마이너스"
                  width={18}
                  height={18}
                />
              </button>
            </div>
          </div>
          <Map
            ref={mapRef}
            center={mapCenter}
            level={2}
            style={{ height: mapHeight, width: mapWidth }}
            onIdle={(map: any) => {
              if (!window?.kakao) return;

              const center = map.getCenter?.();
              if (!center) return;

              const dist = distanceMeters(
                place.lat,
                place.lng,
                center.getLat(),
                center.getLng(),
              );

              // 부드럽게 원위치 복귀
              if (dist > maxDistance) {
                map.panTo(new window.kakao.maps.LatLng(place.lat, place.lng));
              }
            }}
            onZoomChanged={(map: any) => {
              const level = map.getLevel();
              setCurrentLevel(level);
            }}
          >
            <CustomOverlayMap
              position={{
                lat: place.lat + getMarkerOffset(),
                lng: place.lng,
              }}
            >
              <div className="relative">
                {/* 툴팁 화살표 */}
                <div className="absolute -bottom-1 left-1/2 h-2 w-2 -translate-x-1/2 rotate-45 border-b border-r border-[#0074FD] bg-white"></div>

                {/* 기존 모양 유지 */}
                <div className="flex rounded-2xl border border-[#0074FD] bg-white p-[5px] shadow-[0_4px_16px_rgba(0,0,0,0.2)]">
                  <div className="flex h-[24px] w-[24px] items-center justify-center rounded-[50%] bg-white shadow-lg">
                    <Image
                      src="/assets/icons/profile1.svg"
                      alt="식당 위치"
                      width={16}
                      height={16}
                    />
                  </div>

                  <div className="ml-[5px] mr-[7px] flex h-[26px] flex-col">
                    <div className="h-[16px] text-[12px] font-semibold text-black">
                      {place.name} {place.address.split(' ')[1]}
                    </div>

                    <div className="mt-[-2px] flex h-[12px] items-center gap-2 text-[10px] text-[#666666]">
                      <div className="flex items-center gap-1">
                        <span>★</span>
                        <span>{place.average_rating}</span>
                      </div>

                      <p>{place.category.split(',')[0]}</p>
                    </div>
                  </div>
                </div>
              </div>
            </CustomOverlayMap>
          </Map>
        </div>
      </div>
    </div>
  );
};

export default RestaurantReviewMap;
