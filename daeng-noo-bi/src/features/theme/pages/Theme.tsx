import React, { useState, useEffect } from "react";
import ThemeSelector from "../components/ThemeSelector";
import ThemeCardList from "../components/ThemeCardList";
import { fetchPlacesByTheme, Place } from "../api/themeAPI";
import { ThemeKey, themeMap } from "../constants/themeConstants";
import "./Theme.scss";

export default function Theme() {
  const [selectedTheme, setSelectedTheme] = useState<ThemeKey>("nature");
  const [places, setPlaces] = useState<Place[]>([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const themeTitle = themeMap[selectedTheme].title;

  // 테마 변경 시 초기화
  useEffect(() => {
    setPlaces([]);
    setPage(1);
    setHasMore(true);
    setError(null);
  }, [selectedTheme]);

  // 데이터 로드
  useEffect(() => {
    const loadPlaces = async () => {
      setLoading(true);
      setError(null);
      try {
        const data = await fetchPlacesByTheme(selectedTheme, page);
        // console.log(
        //   "🟢 fetchPlacesByTheme →",
        //   selectedTheme,
        //   "page",
        //   page,
        //   "returned",
        //   data
        // );
        setPlaces((prev) => [...prev, ...data]);
        if (data.length === 0) setHasMore(false);
      } catch (e: any) {
        console.error("Theme 로딩 에러:", e);
        setError(e.message || "데이터 로딩 중 에러가 발생했습니다.");
      } finally {
        setLoading(false);
      }
    };
    loadPlaces();
  }, [selectedTheme, page]);

  const handleLoadMore = () => {
    if (!loading && hasMore) {
      setPage((prev) => prev + 1);
    }
  };

  return (
    <div className="theme-page">
      <h1 className="theme-title">
        <span className="theme-pagetitleLine1">힐링부터 모험까지,</span>
        <span className="theme-pagetitleLine2">
          테마별로 즐기는 반려동물 동반 여행
        </span>
      </h1>

      <ThemeSelector
        selectedTheme={selectedTheme}
        onSelect={setSelectedTheme}
      />
      {error && <div className="error">⚠️ {error}</div>}
      <h2>{themeTitle}</h2>
      <ThemeCardList places={places} />

      {loading && <div className="loading">로딩 중...</div>}

      {!loading && hasMore && (
        <button className="load-more-button" onClick={handleLoadMore}>
          <p>더보기</p>
        </button>
      )}

      {!loading && !hasMore && places.length > 0 && (
        <div className="end-message">모든 테마 장소를 불러왔습니다.</div>
      )}
    </div>
  );
}
