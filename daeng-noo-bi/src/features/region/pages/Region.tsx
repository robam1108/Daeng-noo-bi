import React, { useEffect, useState, useRef } from "react";
import { useLocation } from "react-router-dom";
import RegionSelector from "../components/regionSelector/RegionSelector";
import RegionCardList from "../components/regionCardList/RegionCardList";
import Loading from "../../../shared/components/Loading/Loading";
import Error from "../../../shared/components/Error/Error";
import { REGION_CODES } from "../constants/regionConstants";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCaretDown } from "@fortawesome/free-solid-svg-icons";
import type { IconProp } from "@fortawesome/fontawesome-svg-core";
import type { Place } from "../api/regionAPI";
import { getCachedRegion } from "../../../shared/api/cacheAPI";
import "./Region.scss";

interface LocationState {
  initialRegion?: number;
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

  // 지역 변경 시 초기화
  useEffect(() => {
    setPlaces([]);
    setPage(1);
    setHasMore(true);
    setError(null);
  }, [selectedRegion]);

  // 데이터 로드 (캐시 우선)
  useEffect(() => {
    const loadPlaces = async () => {
      setLoading(true);
      setError(null);
      try {
        // getCachedRegion: Firestore 캐시에서 읽거나, 없으면 외부 API 호출
        const data = await getCachedRegion(selectedRegion, page);
        setPlaces((prev) => [...prev, ...data]);
        // 받아온 데이터가 0개면 더 불러올 필요 없음
        if (data.length === 0) {
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
    <main
      className="region-page"
      role="region-page"
      aria-label="지역별 여행지 페이지"
    >
      <section className="regionSelector-section" aria-label="지역 선택 영역">
        <h3 className="selector-title">
          <span className="selector-titleLine1">오늘은</span>
          <span className="selector-titleLine2">어디로 떠나볼까요?</span>
        </h3>
        <RegionSelector
          selected={selectedRegion}
          onChange={setSelectedRegion}
        />
      </section>

      <section aria-labelledby="places-title" className="places-section">
        <h2>{regionName}</h2>
        <RegionCardList places={places} />
      </section>

      {error && (
        <div className="error" role="alert">
          <Error />
        </div>
      )}

      {loading && (
        <div className="loading">
          <Loading />
        </div>
      )}

      {!loading && hasMore && (
        <button
          className="load-more-button"
          onClick={handleLoadMore}
          aria-label="더 많은 여행지 불러오기"
        >
          <p>더보기</p>
          <FontAwesomeIcon icon={faCaretDown as IconProp} />
        </button>
      )}

      {!loading && !hasMore && places.length > 0 && (
        <div className="end-message" role="status">
          마지막 여행지까지 모두 불러왔습니다.
        </div>
      )}
    </main>
  );
}
