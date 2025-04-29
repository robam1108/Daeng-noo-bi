import { fetchTourAPI } from '../../../shared/api/fetcher';
import { FALLBACK_IMAGES } from '../../../shared/constants/fallbackImages';

export const PAGE_SIZE = 9;

export interface RawPlace {
  contentid: string;
  title: string;
  firstimage?: string;
  firstimage2?: string;
  // 원본 API에는 addr1이 포함되지 않으므로 detailCommon으로 보완
}

export interface Place extends RawPlace {
  finalImage: string;
  addr1: string;
}

/**
 * 지역별 반려동물 여행지 조회 및 이미지·주소 보완
 */
export async function fetchPetFriendlyPlacesByRegion(
  areaCode: number,
  page: number = 1
): Promise<Place[]> {
  // 1) areaBasedList 호출
  const params = {
    numOfRows: String(PAGE_SIZE),
    pageNo: String(page),
    arrange: 'P',
    areaCode: String(areaCode),
    MobileOS: 'ETC',
    MobileApp: 'PetTourApp',
    _type: 'json',
  };

  const result = await fetchTourAPI(
    'KorPetTourService',
    'areaBasedList',
    params
  );

  // 2) 원본 데이터를 배열로 통일
  const rawPlaces: RawPlace[] = Array.isArray(result)
    ? result
    : result
    ? [result]
    : [];

  // 3) 이미지 및 주소 보완
  const enriched: Place[] = await Promise.all(
    rawPlaces.map(async (p) => {
      // 이미지 보완: firstimage → firstimage2 → detailImage → fallback
      let img = p.firstimage || p.firstimage2 || '';
      if (!img) {
        const imgRes = await fetchTourAPI(
          'KorPetTourService',
          'detailImage',
          {
            contentId: p.contentid,
            imageYN: 'Y',
            subImageYN: 'Y',
            _type: 'json',
          }
        );
        const items = Array.isArray(imgRes) ? imgRes : imgRes ? [imgRes] : [];
        img = items[0]?.imageUrl || '';
      }

      // 주소 보완: detailCommon
      const commonRes = await fetchTourAPI(
        'KorPetTourService',
        'detailCommon',
        {
          contentId: p.contentid,
          defaultYN: 'Y',
          firstImageYN: 'Y',
          mapInfoYN: 'Y',
          _type: 'json',
        }
      );
      const commonItems = Array.isArray(commonRes)
        ? commonRes
        : commonRes
        ? [commonRes]
        : [];
      const addr1 = commonItems[0]?.addr1 || '주소 정보 없음';

      return {
        ...p,
        finalImage: img || FALLBACK_IMAGES[p.title] || '/images/no-image.png',
        addr1,
      };
    })
  );

  return enriched;
}