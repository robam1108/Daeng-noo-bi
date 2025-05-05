// src/api/themeAPI.ts

import { fetchTourAPI } from '../../../shared/api/fetcher';
import { FALLBACK_IMAGES } from '../../../shared/constants/fallbackImages';
import { ThemeKey, THEMES } from '../constants/themeConstants';

export const PAGE_SIZE = 9;

/** API 원본 필드 타입 */
export interface RawPlace {
  contentid:     string;
  contenttypeid: string;
  title:         string;
  firstimage?:   string;
  firstimage2?:  string;
  cat1?:         string;
  addr1?:        string; 
  addr2?:        string; 
  readcount:     string;
}

/** UI 보완 타입 */
export interface Place extends RawPlace {
  finalImage: string;
  addr1:      string;
}

interface ThemeConfig {
  contentTypeId: string;
  cat1Filter?:   string;
}

const themeConfigMap: Record<ThemeKey, ThemeConfig[]> = {
  nature:       [{ contentTypeId: '12', cat1Filter: THEMES.find(t => t.key === 'nature')!.code }],
  culture:      [
    { contentTypeId: '12', cat1Filter: THEMES.find(t => t.key === 'culture')!.code },
    { contentTypeId: '14' }
  ],
  adventure:    [
    { contentTypeId: '12', cat1Filter: THEMES.find(t => t.key === 'adventure')!.code },
    { contentTypeId: '28' }
  ],
  shopping:     [
    { contentTypeId: '12', cat1Filter: THEMES.find(t => t.key === 'shopping')!.code },
    { contentTypeId: '38' }
  ],
  food:         [
    { contentTypeId: '12', cat1Filter: THEMES.find(t => t.key === 'food')!.code },
    { contentTypeId: '39' }
  ],
  accommodation:[
    { contentTypeId: '12', cat1Filter: THEMES.find(t => t.key === 'accommodation')!.code },
    { contentTypeId: '32' }
  ],
};

const REGION_CODES = [1,2,3,4,5,6,7,8,31,32,33,34,35,36,37,38,39];

/**
 * 테마별 여행지 조회 + addr1 & finalImage 보완
 */
export async function fetchPlacesByTheme(
  theme: ThemeKey,
  page: number = 1
): Promise<Place[]> {
  const configs = themeConfigMap[theme];

  // 1) areaBasedList 호출하여 RawPlace[] 수집
  const calls = configs.flatMap(cfg =>
    REGION_CODES.map(areaCode =>
      fetchTourAPI(
        'KorPetTourService',
        'areaBasedList',
        {
          contentTypeId: cfg.contentTypeId,
          numOfRows:     String(PAGE_SIZE),
          pageNo:        String(page),
          arrange:       'P',
          areaCode:      String(areaCode),
          MobileOS:      'ETC',
          MobileApp:     'PetTourApp',
          _type:         'json',
        }
      ) as Promise<RawPlace[]>
    )
  );
  const results = await Promise.all(calls);
  let items: RawPlace[] = results
    .flat()
    .filter((x: any): x is RawPlace => !!x && !!x.contentid);

  // 2) cat1Filter 적용
  configs.forEach(cfg => {
    if (cfg.cat1Filter) {
      items = items.filter(p => p.cat1 === cfg.cat1Filter);
    }
  });

// 3) 중복 제거
const uniqueMap = new Map<string, RawPlace>();
items.forEach(p => uniqueMap.set(p.contentid, p));
const uniq = Array.from(uniqueMap.values());

// 4) 전역 인기순(조회수) 정렬
uniq.sort((a, b) =>
  parseInt(b.readcount, 10) - parseInt(a.readcount, 10)
);

// 5) 페이지네이션
const pageItems = uniq.slice(
  (page - 1) * PAGE_SIZE,
  page * PAGE_SIZE
);

// 6) 이미지·주소 보완(detailCommon 호출 포함)
const enriched: Place[] = await Promise.all(
  pageItems.map(async (p) => {
    // 6-1) 이미지 보완
    const finalImage =
      p.firstimage ||
      p.firstimage2 ||
      FALLBACK_IMAGES[p.title] ||
      '/images/no-image.png';

    // 6-2) 주소 보완: 이미 addr1/addr2가 있으면 그대로, 없으면 detailCommon 호출
    let addr = p.addr1 || p.addr2 || '';
    if (!addr) {
      try {
        const commonRes = await fetchTourAPI(
          'KorPetTourService',
          'detailCommon',
          {
            contentId:    p.contentid,
            defaultYN:    'Y',
            firstImageYN: 'Y',
            mapInfoYN:    'Y',
            _type:        'json',
          }
        );
        const arr = Array.isArray(commonRes)
          ? commonRes
          : commonRes
            ? [commonRes]
            : [];
        addr = arr[0]?.addr1 || arr[0]?.addr2 || '';
      } catch {
        // 실패해도 빈 문자열 유지
      }
    }
    // 없으면 기본 메시지
    if (!addr) addr = '주소 정보 없음';

    return {
      ...p,
      finalImage,
      addr1: addr,
    };
  })
);

return enriched;
}
