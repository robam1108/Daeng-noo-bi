import React, { useState, useEffect } from 'react';
import ThemeSelector from '../components/ThemeSelector';
import ThemeCardList from '../components/ThemeCardList';
import { fetchPlacesByTheme, Place } from '../api/themeAPI';
import { ThemeKey } from '../constants/themeConstants';
import './Theme.scss';

export default function Theme() {
  const [selectedTheme, setSelectedTheme] = useState<ThemeKey>('nature');
  const [places, setPlaces] = useState<Place[]>([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [error, setError] = useState<string | null>(null);

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
        console.log('🟢 fetchPlacesByTheme →', selectedTheme, 'page', page, 'returned', data);
        setPlaces(prev => [...prev, ...data]);
        if (data.length === 0) setHasMore(false);
      } catch (e: any) {
        console.error('Theme 로딩 에러:', e);
        setError(e.message || '데이터 로딩 중 에러가 발생했습니다.');
      } finally {
        setLoading(false);
      }
    };
    loadPlaces();
  }, [selectedTheme, page]);

  const handleLoadMore = () => {
    if (!loading && hasMore) {
      setPage(prev => prev + 1);
    }
  };

  return (
    <div className="theme-page">
      <h1 className="theme-title">테마별 여행지</h1>

      <ThemeSelector selectedTheme={selectedTheme} onSelect={setSelectedTheme} />

      {error && <div className="error">⚠️ {error}</div>}

      <ThemeCardList places={places} />

      {loading && <div className="loading">로딩 중...</div>}

      {!loading && hasMore && (
        <button className="load-more" onClick={handleLoadMore}>
          더 불러오기
        </button>
      )}

      {!loading && !hasMore && places.length > 0 && (
        <div className="end-message">모든 테마 장소를 불러왔습니다.</div>
      )}
    </div>
  );
}