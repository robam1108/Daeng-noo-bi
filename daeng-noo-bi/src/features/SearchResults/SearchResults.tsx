// src/pages/SearchResults.tsx
import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { searchPlacesByKeyword, SearchPlace } from "../../shared/api/fetcher";
import RegionCardList from "../region/components/regionCardList/RegionCardList"; // 실제 경로로 조정하세요
import { FALLBACK_IMAGES } from "../../shared/constants/fallbackImages";
import type { Place as PopularPlace } from "../region/components/regionCardList/RegionCard";
import "./SearchResults.scss";

function useQuery() {
  return new URLSearchParams(useLocation().search);
}

export default function SearchResults() {
  const query = useQuery();
  const keyword = query.get("keyword") || "";
  const [results, setResults] = useState<SearchPlace[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!keyword) return;
    setLoading(true);
    searchPlacesByKeyword(keyword)
      .then((data) => setResults(data))
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, [keyword]);

  // PopularCardList에서 사용하는 Place 타입으로 변환
  const places: PopularPlace[] = results.map((item) => ({
    contentid: item.contentId,
    contenttypeid: item.contentTypeId,
    title: item.title ?? "",
    firstimage: item.firstimage,
    firstimage2: "", // API에서 추가 이미지를 받으면 설정
    finalImage: item.firstimage || FALLBACK_IMAGES.default,
    addr1: item.addr1 || "",
  }));

  return (
    <div className="SearchResults">
      <div className="SearchResult-title">
        <h1>
          “<span className="pointColor">{keyword}</span>” 검색 결과
        </h1>
      </div>
      {loading && <p>검색 중...</p>}
      {!loading && places.length === 0 && <p>결과가 없습니다.</p>}
      {!loading && places.length > 0 && <RegionCardList places={places} />}
    </div>
  );
}
