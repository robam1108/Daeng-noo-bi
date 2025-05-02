// src/api/popularAPI.ts
import { fetchTourAPI } from '../../../shared/api/fetcher';
import { FALLBACK_IMAGES } from '../../../shared/constants/fallbackImages';

export const PAGE_SIZE = 9;
export interface RawPlace {
  contentid:   string;
  title:       string;
  firstimage?: string;
  firstimage2?: string;
  addr1?:      string;
  addr2?:      string;
}

export interface Place extends RawPlace {
  finalImage: string;
  addr1:      string;
}

export async function fetchPopularPlaces(page = 1): Promise<Place[]> {
  const params = {
    numOfRows: String(PAGE_SIZE),
    pageNo:    String(page),
    contentTypeId: '12',
    arrange:   'P',
    mapX:       '127.5',      // 전국 중심 경도
    mapY:       '36.5',       // 전국 중심 위도
    radius:    '200000',     // 반경 200km (m 단위)
    MobileOS:  'ETC',
    MobileApp: 'PetTourApp',
    _type:     'json',
  };

  // 1) locationBasedList 호출
  const result = await fetchTourAPI(
    'KorPetTourService',
    'locationBasedList',
    params
  );
  const raw: RawPlace[] = Array.isArray(result)
    ? result
    : result
    ? [result]
    : [];

  // 2) finalImage·addr1 보완
  const places: Place[] = raw.map(p => ({
    ...p,
    finalImage:
      p.firstimage ||
      p.firstimage2 ||
      FALLBACK_IMAGES[p.title] ||
      '/images/no-image.png',
    addr1: p.addr1 || p.addr2 || '주소 정보 없음',
  }));

  return places;
}
