import { useEffect, useState } from "react";
import RegionSelector from "../components/regionSelector/RegionSelector";
import RegionCardList from "../components/regionCardList/RegionCardList";
import { fetchPetFriendlyPlacesByRegion, RawPlace } from "../api/regionAPI";
import { fetchDetailImage } from "../../../shared/api/datailAPI";
import { REGION_CODES } from "../constants/regionConstants";
import { FALLBACK_IMAGES } from "../../../shared/constants/fallbackImages";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { IconProp } from "@fortawesome/fontawesome-svg-core";
import { faCaretDown } from "@fortawesome/free-solid-svg-icons";
import { useLocation } from "react-router-dom";

import "./Region.scss";

interface LocationState {
  initialRegion?: number;
}

interface Place extends RawPlace {
  finalImage: string;
}

export default function Region() {
  const location = useLocation();
  const initialRegion = (location.state as LocationState)?.initialRegion ?? 1;
  const [selectedRegion, setSelectedRegion] = useState<number>(initialRegion);
  const [places, setPlaces] = useState<Place[]>([]);
  const [page, setPage] = useState<number>(1);
  const [loading, setLoading] = useState<boolean>(false);
  const [hasMore, setHasMore] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);


  const regionName = REGION_CODES.find((r) => r.code === selectedRegion)?.name;

  // 지역 바뀌면 초기화
  useEffect(() => {
    setPlaces([]);
    setPage(1);
    setHasMore(true);
    setError(null);
  }, [selectedRegion]);

  // 데이터 로드
  useEffect(() => {
    const loadPlaces = async () => {
      setLoading(true);
      setError(null);
      try {
        const rawData = await fetchPetFriendlyPlacesByRegion(
          selectedRegion,
          page
        );
        // rawData가 배열인지, 요소가 null/undefined인지 필터링
        const validData = Array.isArray(rawData)
          ? rawData.filter((p): p is RawPlace => !!p)
          : [];

        // 이미지 보완
        const enriched: Place[] = await Promise.all(
          validData.map(async (p) => {
            // 1. API 첫 응답 이미지 시도
            let img = p.firstimage || p.firstimage2;
            const fallback = FALLBACK_IMAGES[p.title];
            // 2. 없으면 detailAPI 시도
            if (!img) {
              const detail = await fetchDetailImage(p.contentid);
              img = detail.imageUrl;
            }

            // 3. 그래도 없으면 placeholder
            // const final = img ?? "/images/no-image.png";
            // console.log(
            //   `[Region] contentId=${p.contentid}, finalImage=`,
            //   final
            // );

            return {
              ...p,
              finalImage: img || fallback || "/images/no-image.png",
            };
          })
        );

        setPlaces((prev) => [...prev, ...enriched]);

        if (validData.length === 0) {
          setHasMore(false);
        }
      } catch (e: any) {
        console.error("Region 로딩 에러:", e);
        setError(e.message || "데이터 로딩 중 에러가 발생했습니다.");
      } finally {
        setLoading(false);
      }
    };

    loadPlaces();
  }, [selectedRegion, page]);

  const handleLoadMore = () => {
    if (!loading && hasMore) {
      setPage((prev) => prev + 1);
    }
  };

  return (
    <div className="region-page">
      <RegionSelector selected={selectedRegion} onChange={setSelectedRegion} />
      <h2>{regionName}</h2>

      {error && <div className="error">⚠️ {error}</div>}

      <RegionCardList places={places} />

      {loading && <div className="loading">로딩 중...</div>}

      {!loading && hasMore && (
        <button className="load-more-button" onClick={handleLoadMore}>
          <p>더보기</p>
          <FontAwesomeIcon icon={faCaretDown as IconProp} />
        </button>
      )}

      {!loading && !hasMore && places.length > 0 && (
        <div className="end-message">마지막 여행지까지 모두 불러왔습니다.</div>
      )}
    </div>
  );
}
