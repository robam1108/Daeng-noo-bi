import { fetchTourAPI } from '../../src/shared/api/fetcher';
import { FALLBACK_IMAGES } from '../../src/shared/constants/fallbackImages';

/** 한 페이지당 아이템 수 */
export const PAGE_SIZE = 9;

/** API 원본 필드 타입 */
export interface RawPlace {
  contentid:      string;
  contenttypeid?: string;
  title:          string;
  firstimage?:    string;
  firstimage2?:   string;
  cat1?:          string;
  addr1?:         string;
  addr2?:         string;
  readcount?:     string;
}

/** 보완된 UI용 타입 */
export interface Place extends RawPlace {
  finalImage: string;
  addr1:      string;
}

/** 지역 코드 리스트 (전국) */
const REGION_CODES = [1,2,3,4,5,6,7,8,31,32,33,34,35,36,37,38,39] as const;

/** 테마 키 타입 */
type ThemeKey =
  | 'nature'
  | 'culture'
  | 'adventure'
  | 'shopping'
  | 'food'
  | 'accommodation';

/** 테마별 구성 정보 */
interface ThemeConfig {
  contentTypeId: string;
  cat1Filter?:   string;
}

/** 테마별 호출 설정 */
const themeConfigMap: Record<ThemeKey, ThemeConfig[]> = {
  nature:       [{ contentTypeId: '12', cat1Filter: 'A01' }],
  culture:      [
    { contentTypeId: '12', cat1Filter: 'A02' },
    { contentTypeId: '14' }
  ],
  adventure:    [
    { contentTypeId: '12', cat1Filter: 'A03' },
    { contentTypeId: '28' }
  ],
  shopping:     [
    { contentTypeId: '12', cat1Filter: 'A04' },
    { contentTypeId: '38' }
  ],
  food:         [
    { contentTypeId: '12', cat1Filter: 'A05' },
    { contentTypeId: '39' }
  ],
  accommodation:[
    { contentTypeId: '12', cat1Filter: 'B02' },
    { contentTypeId: '32' }
  ],
};

/**
 * 전국 인기 페이지 캐시 갱신용 헬퍼
 */
export async function fetchPopularPlacesFromAPI(page = 1): Promise<Place[]> {
  const result = await fetchTourAPI(
    'KorPetTourService',
    'locationBasedList',
    {
      numOfRows: String(PAGE_SIZE),
      pageNo:    String(page),
      arrange:   'P',
      mapX:      '127.5',
      mapY:      '36.5',
      radius:    '200000',
      MobileOS:  'ETC',
      MobileApp: 'PetTourApp',
      _type:     'json',
    }
  );
  const raw: RawPlace[] = Array.isArray(result)
    ? result
    : result
      ? [result]
      : [];

  return raw.map(p => ({
    ...p,
    finalImage: p.firstimage
      || p.firstimage2
      || FALLBACK_IMAGES[p.title]
      || '/images/no-image.png',
    addr1: p.addr1 || p.addr2 || '주소 정보 없음',
  }));
}

/**
 * 지역별 페이지 캐시 갱신용 헬퍼
 */
export async function fetchRegionPlacesFromAPI(
  areaCode: number,
  page = 1
): Promise<Place[]> {
  const result = await fetchTourAPI(
    'KorPetTourService',
    'areaBasedList',
    {
      numOfRows: String(PAGE_SIZE),
      pageNo:    String(page),
      arrange:   'P',
      areaCode:  String(areaCode),
      MobileOS:  'ETC',
      MobileApp: 'PetTourApp',
      _type:     'json',
    }
  );
  const raw: RawPlace[] = Array.isArray(result)
    ? result
    : result
      ? [result]
      : [];

  const enriched: Place[] = await Promise.all(
    raw.map(async (p) => {
      // 이미지 보완
      let img = p.firstimage || p.firstimage2 || '';
      if (!img) {
        const imgRes = await fetchTourAPI(
          'KorPetTourService',
          'detailImage',
          {
            contentId:  p.contentid,
            imageYN:    'Y',
            subImageYN: 'Y',
            _type:      'json',
          }
        );
        const items = Array.isArray(imgRes)
          ? imgRes
          : imgRes
            ? [imgRes]
            : [];
        img = items[0]?.imageUrl || '';
      }

      // 주소 보완: 기본 addr1/addr2 우선 사용, 없을 때만 detailCommon 호출
      let addr = (p as any).addr1 || (p as any).addr2 || '';
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
          const commonItems = Array.isArray(commonRes)
            ? commonRes
            : commonRes
              ? [commonRes]
              : [];
          addr = commonItems[0]?.addr1 || commonItems[0]?.addr2 || '';
        } catch {
          // 실패 시 그대로
        }
      }
      if (!addr) addr = '주소 정보 없음';

      return {
        ...p,
        finalImage: img || FALLBACK_IMAGES[p.title] || '/images/no-image.png',
        addr1:      addr,
      };
    })
  );
  return enriched;
}

/**
 * 테마별 페이지 캐시 갱신용 헬퍼
 */
export async function fetchThemePlacesFromAPI(
  theme: ThemeKey,
  page = 1
): Promise<Place[]> {
  const configs = themeConfigMap[theme];

  const calls = configs.flatMap(cfg =>
    REGION_CODES.map((areaCode) =>
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
      ).then(res => (Array.isArray(res) ? res : res ? [res] : []))
    )
  );
  const results = await Promise.all(calls);

  let items: RawPlace[] = results
    .flat()
    .filter((x: any): x is RawPlace => !!x && !!x.contentid);

  configs.forEach(cfg => {
    if (cfg.cat1Filter) {
      items = items.filter(p => p.cat1 === cfg.cat1Filter);
    }
  });

  const unique = Array.from(new Map(items.map(p => [p.contentid, p])).values());
  unique.sort((a, b) => parseInt(b.readcount || '0', 10) - parseInt(a.readcount || '0', 10));
  const pageItems = unique.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  const enrichedTheme: Place[] = await Promise.all(
    pageItems.map(async p => {
      // 이미지
      const finalImage = p.firstimage || p.firstimage2 || FALLBACK_IMAGES[p.title] || '/images/no-image.png';

      // 주소 보완
      let addr = (p as any).addr1 || (p as any).addr2 || '';
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
          const arr = Array.isArray(commonRes) ? commonRes : commonRes ? [commonRes] : [];
          addr = arr[0]?.addr1 || arr[0]?.addr2 || '';
        } catch {
          // 실패 시 그대로
        }
      }
      if (!addr) addr = '주소 정보 없음';

      return { ...p, finalImage, addr1: addr };
    })
  );

  return enrichedTheme;
}
