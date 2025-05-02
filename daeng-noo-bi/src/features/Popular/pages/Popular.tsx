// src/pages/Popular.tsx
import React, { useEffect, useState } from "react";
import PopularCardList from "../components/PopularCardList";
import { fetchPopularPlaces, Place } from "../api/popularAPI";
import "./Popular.scss";

export default function Popular() {
  const [places, setPlaces] = useState<Place[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      setError(null);
      try {
        const data = await fetchPopularPlaces(1);
        setPlaces(data);
      } catch (err) {
        console.error(err);
        setError("인기 여행지 조회 중 문제가 발생했습니다.");
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  return (
    <div className="popular-page">
      <div className="popular-title">
        <h1>
          전국 반려동물 인기 스팟 <span className="pointColor">TOP 9</span>
        </h1>
        <p>지금 가장 주목받는 반려동물 동반 명소를 한눈에 만나보세요.</p>
      </div>

      {loading && <p className="loading">로딩 중...</p>}
      {error && <div className="error">⚠️ {error}</div>}

      {!loading && !error && <PopularCardList places={places} />}
    </div>
  );
}
