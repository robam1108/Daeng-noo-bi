import { fetchTourAPI } from '../../api/fetcher';
import { PAGE_SIZE, RawPlace } from '../Region/regionAPI';
import { ThemeKey, themeMap } from './themeConstants';

/**
 * 테마별 장소 조회 (KorPetTourService - typeBasedList)
 */
export async function fetchPlacesByTheme(
  themeKey: ThemeKey,
  page: number = 1
): Promise<RawPlace[]> {
  const contentTypeIds = themeMap[themeKey].ids;
  const results = await Promise.all(
    contentTypeIds.map(async (id) => {
      const params = {
        contentTypeId: String(id),
        numOfRows: String(PAGE_SIZE),
        pageNo: String(page),
      };
      const res = await fetchTourAPI('KorPetTourService', 'typeBasedList', params);
      if (Array.isArray(res)) return res;
      if (res) return [res];
      return [];
    })
  );
  return results.flat();
}