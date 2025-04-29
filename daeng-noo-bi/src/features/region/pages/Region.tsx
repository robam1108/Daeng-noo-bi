import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import RegionSelector from '../components/regionSelector/RegionSelector';
import RegionCardList from '../components/regionCardList/RegionCardList';
import { fetchPetFriendlyPlacesByRegion, Place } from '../api/regionAPI';
import { REGION_CODES } from '../constants/regionConstants';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCaretDown } from '@fortawesome/free-solid-svg-icons';
import type { IconProp } from '@fortawesome/fontawesome-svg-core';
import './Region.scss';

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

  const regionName = REGION_CODES.find(r => r.code === selectedRegion)?.name;

  // 지역 변경 시 초기화
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
        const data = await fetchPetFriendlyPlacesByRegion(selectedRegion, page);
        setPlaces(prev => [...prev, ...data]);
        if (data.length === 0) setHasMore(false);
      } catch (e: any) {
        console.error('Region 로딩 에러:', e);
        setError(e.message || '데이터 로딩 중 에러가 발생했습니다.');
      } finally {
        setLoading(false);
      }
    }; 
    loadPlaces();
  }, [selectedRegion, page]);

  const handleLoadMore = () => {
    if (!loading && hasMore) {
      setPage(prev => prev + 1);
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
