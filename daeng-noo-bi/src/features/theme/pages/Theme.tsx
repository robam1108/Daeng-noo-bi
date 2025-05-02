import { useState, useEffect } from 'react';
import ThemeSelector from '../components/ThemeSelector';
// import ThemeCardList from './ThemeCardList';
import { fetchPlacesByTheme } from '../api/themeAPI';
import { ThemeKey } from '../constants/themeConstants';
import type { RawPlace } from '../../region/api/regionAPI';
// import './Theme.scss';

export default function Theme() {
  const [selectedTheme, setSelectedTheme] = useState<ThemeKey>('healing');
  const [places, setPlaces] = useState<RawPlace[]>([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setPlaces([]);
    setPage(1);
  }, [selectedTheme]);

  useEffect(() => {
    setLoading(true);
    fetchPlacesByTheme(selectedTheme, page)
      .then((data) => setPlaces((prev) => [...prev, ...data]))
      .finally(() => setLoading(false));
  }, [selectedTheme, page]);

  const handleLoadMore = () => setPage((prev) => prev + 1);

  return (
    <div className="theme-page">
      <ThemeSelector selectedTheme={selectedTheme} onSelect={setSelectedTheme} />
      {/* <ThemeCardList places={places} onLoadMore={handleLoadMore} loading={loading} /> */}
    </div>
  );
}