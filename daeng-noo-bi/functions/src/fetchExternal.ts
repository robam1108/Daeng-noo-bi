//  @ts-ignore: no type declarations for node-fetch
import fetch from 'node-fetch';
import * as functions from 'firebase-functions';

// const API_BASE = 'https://api.visitkorea.or.kr/openapi/service/rest/KorPetTourService';
// const API_KEY = process.env.TOUR_API_KEY!;
export const PAGE_SIZE = 9;

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

export interface Place extends RawPlace {
  finalImage: string;
  addr1:      string;
}

// API 키 설정
const TOUR_API_KEYS = [
  functions.config().tourapi.key1,
  functions.config().tourapi.key2,
  functions.config().tourapi.key3,
];

let currentApiKeyIndex = 0;
function getNextApiKey() {
  const key = TOUR_API_KEYS[currentApiKeyIndex];
  currentApiKeyIndex = (currentApiKeyIndex + 1) % TOUR_API_KEYS.length;
  return key;
}

const BASE_URL = "https://apis.data.go.kr/B551011";

// API 호출용 유틸 함수
export async function fetchTourAPI(
  service: string,
  operation: string,
  params: Record<string, string>
): Promise<any[]> {
  let attempts = 0;
  const maxAttempts = TOUR_API_KEYS.length;

  while (attempts < maxAttempts) {
    const ServiceKey = getNextApiKey();
    const qs = new URLSearchParams({
      ServiceKey,
      MobileOS: "ETC",
      MobileApp: "PetTourApp",
      _type: "json",
      ...params,
    }).toString();

    const url = `${BASE_URL}/${service}/${operation}?${qs}`;
    console.log("[fetchTourAPI] URL:", url);

    try {
      const res = await fetch(url);
      const ct = res.headers.get("Content-Type") || "";
      console.log("[fetchTourAPI] ◀️ HTTP", res.status, res.statusText);

      if (!ct.includes("application/json")) {
        const text = await res.text();
        console.warn("[fetchTourAPI] JSON 아닌 응답:", text);

        if (text.includes("LIMITED_NUMBER_OF_SERVICE_REQUESTS_EXCEEDS_ERROR")) {
          attempts++;
          console.warn("[fetchTourAPI] 한도 초과 – 다음 키로 재시도합니다.");
          continue;
        }

        console.error("[fetchTourAPI] 예기치 못한 응답, 빈 배열 반환");
        return [];
      }

      const json = await res.json();
      console.log("[fetchTourAPI] ◀️ JSON 응답 전체:", JSON.stringify(json, null, 2));
      return json.response?.body?.items?.item ?? [];
    } catch (e) {
      console.error(`[fetchTourAPI] 네트워크 오류 (키=${ServiceKey}):`, e);
      attempts++;
      if (attempts < maxAttempts) {
        console.warn("[fetchTourAPI] 네트워크 오류 – 다음 키로 재시도합니다.");
      }
    }
  }

  console.error("[fetchTourAPI] 모든 키 소진 – 빈 배열 반환");
  return [];
}

// 인기별 페이지 캐시 갱신용
export async function fetchPopularPlacesFromAPI(
  page = 1
): Promise<Place[]> {
  const raw = await fetchTourAPI('KorPetTourService','locationBasedList', {
    numOfRows: PAGE_SIZE.toString(),
    pageNo:    page.toString(),
    arrange:   'P',
    mapX:      '127.5',
    mapY:      '36.5',
    radius:    '200000',
  });

  return raw.map(p => ({
    ...p,
    finalImage: p.firstimage || p.firstimage2 || '/images/no-image.png',
    addr1:      p.addr1 || p.addr2 || '주소 정보 없음',
  }));
}

// 지역별 페이지 캐시 갱신용
export async function fetchRegionPlacesFromAPI(
  areaCode: number,
  page = 1
): Promise<Place[]> {
  const raw: RawPlace[] = await fetchTourAPI('KorPetTourService','areaBasedList', {
    numOfRows: PAGE_SIZE.toString(),
    pageNo:    page.toString(),
    arrange:   'P',
    areaCode:  areaCode.toString(),
  });

  return raw.map(p => ({
    ...p,
    finalImage: p.firstimage || p.firstimage2 || '/images/no-image.png',
    addr1:      p.addr1 || p.addr2 || '주소 정보 없음',
  }));
}

// 테마별 페이지 캐시 갱신용
export async function fetchThemePlacesFromAPI(
  themeKey: string,
  page = 1
): Promise<Place[]> {
  // 테마별 다중 config 설정
  const themeConfigMap: Record<string, { contentTypeId: string; cat1Filter?: string }[]> = {
    nature: [      { contentTypeId: '12', cat1Filter: 'A01' } ],
    culture: [     { contentTypeId: '12', cat1Filter: 'A02' }, { contentTypeId: '14' } ],
    adventure: [   { contentTypeId: '12', cat1Filter: 'A03' }, { contentTypeId: '28' } ],
    shopping: [    { contentTypeId: '12', cat1Filter: 'A04' }, { contentTypeId: '38' } ],
    food: [        { contentTypeId: '12', cat1Filter: 'A05' }, { contentTypeId: '39' } ],
    accommodation:[ { contentTypeId: '12', cat1Filter: 'B02' }, { contentTypeId: '32' } ],
  };

  const configs = themeConfigMap[themeKey] || themeConfigMap['nature'];
  // 다중 요청 생성: 각 config마다, 같은 지역 전체를 대상으로 area-based 요청
  const calls = configs.flatMap(cfg =>
    fetchTourAPI('KorPetTourService','areaBasedList', {
      numOfRows:     PAGE_SIZE.toString(),
      pageNo:        page.toString(),
      arrange:       'P',
      contentTypeId: cfg.contentTypeId,
      ...(cfg.cat1Filter && { cat1: cfg.cat1Filter }),
      mapX:          '127.5',
      mapY:          '36.5',
      radius:        '200000',
    })
  );

  const results = await Promise.all(calls);
  let items = results.flat();
  // contentTypeId 프로퍼티별 중복 제거
  const uniqueMap = new Map<string, RawPlace>();
  items.forEach(p => uniqueMap.set(p.contentid, p));
  items = Array.from(uniqueMap.values());

  return items.map(p => ({
    ...p,
    finalImage: p.firstimage || p.firstimage2 || '/images/no-image.png',
    addr1:      p.addr1 || p.addr2 || '주소 정보 없음',
  }));
}



