import { useEffect, useState, useRef, useCallback } from "react";
import RegionSelector from "./RegionSelector";
import RegionCardList from "./RegionCardList";
import {
  fetchPetFriendlyPlacesByRegion,
  fetchDetailImage,
  filterHighQualityImages,
} from "./regionAPI";
import { REGION_CODES } from "./regionConstants";
import "./scss/Region.scss";
import { throttle } from "../../utils/throttle";

const Region = () => {
  const [selectedRegion, setSelectedRegion] = useState(1); // 기본값: 서울
  const [places, setPlaces] = useState<any[]>([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const observer = useRef<IntersectionObserver | null>(null);

  const selectedRegionData = REGION_CODES.find(
    (region) => region.code === selectedRegion
  );

  const throttledLoadMore = throttle(() => {
    setPage((prev) => prev + 1);
  }, 1500);

  // 초기/지역 변경시
  useEffect(() => {
    setPlaces([]);
    setPage(1);
  }, [selectedRegion]);

  // 페이지 번호 변할 때마다 로딩
  useEffect(() => {
    const loadPlaces = async () => {
      setLoading(true);

      const data = await fetchPetFriendlyPlacesByRegion(selectedRegion, page);

      const placesWithImages = data.filter(
        (place: any) => place.firstimage || place.firstimage2
      );

      const placesWithFinalImage = await Promise.all(
        placesWithImages.map(async (place: any) => {
          return {
            ...place,
            finalImage:
              place.firstimage || place.firstimage2 || "/images/no-image.png",
          };
        })
      );

      // 압축 끝날 때까지 기다리고 나서, 한 번에 9개 추가
      setPlaces((prev) => [...prev, ...placesWithFinalImage.slice(0, 9)]);
      setLoading(false);
    };

    loadPlaces();
  }, [page, selectedRegion]);

  // 스크롤 감지
  const lastCardRef = useCallback(
    (node: any) => {
      if (loading) return;
      if (observer.current) observer.current.disconnect();

      observer.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting) {
          throttledLoadMore();
        }
      });

      if (node) observer.current.observe(node);
    },
    [loading]
  );

  return (
    <div className="region-page">
      <RegionSelector selected={selectedRegion} onChange={setSelectedRegion} />
      <h2>{selectedRegionData?.name}</h2>
      <RegionCardList places={places} lastCardRef={lastCardRef} />

      {loading && <div className="loading">로딩 중...</div>}
    </div>
  );
};

export default Region;
