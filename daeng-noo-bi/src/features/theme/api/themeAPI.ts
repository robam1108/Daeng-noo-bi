import { fetchTourAPI } from '../../../shared/api/fetcher';
import { FALLBACK_IMAGES } from '../../../shared/constants/fallbackImages';
import { ThemeKey, THEMES } from '../constants/themeConstants';

export const PAGE_SIZE = 9;

export interface RawPlace {
  contentid: string;
  title: string;
  firstimage?: string;
  firstimage2?: string;
}

export interface Place extends RawPlace {
  finalImage: string;
  addr1: string;
}

// ThemeKey → cat1 매핑
const themeCategoryMap: Record<ThemeKey, string> = THEMES.reduce(
  (map, t) => {
    map[t.key] = t.code;
    return map;
  },
  {} as Record<ThemeKey, string>
);

export async function fetchPlacesByTheme(
  theme: ThemeKey,
  page: number = 1
): Promise<Place[]> {
  const cat1 = themeCategoryMap[theme];
  const params = {
    contentTypeId: '12',
    cat1,
    numOfRows: String(PAGE_SIZE),
    pageNo: String(page),
    arrange: 'P',
  };

  const raw = await fetchTourAPI('KorPetTourService', 'categoryCode', params);

  const rawArr: RawPlace[] = Array.isArray(raw) ? raw : raw ? [raw] : [];

  return Promise.all(
    rawArr.map(async (item) => {
      let img = item.firstimage || item.firstimage2 || '';
      if (!img) {
        const imgRes = await fetchTourAPI(
          'KorPetTourService',
          'detailImage',
          { contentId: item.contentid, imageYN: 'Y', subImageYN: 'Y' }
        );
        const list = Array.isArray(imgRes) ? imgRes : imgRes ? [imgRes] : [];
        img = list[0]?.imageUrl || '';
      }

      const comRes = await fetchTourAPI(
        'KorPetTourService',
        'detailCommon',
        { contentId: item.contentid, defaultYN: 'Y', firstImageYN: 'Y', mapInfoYN: 'Y' }
      );
      const comList = Array.isArray(comRes) ? comRes : comRes ? [comRes] : [];
      const addr1 = comList[0]?.addr1 || '주소 정보 없음';

      return { ...item, finalImage: img || FALLBACK_IMAGES[item.title] || '', addr1 };
    })
  );
}