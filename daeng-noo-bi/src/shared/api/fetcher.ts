// src/api/fetcher.ts

const TOUR_API_KEYS = [
  import.meta.env.VITE_TOUR_API_KEY1!,
  import.meta.env.VITE_TOUR_API_KEY2!,
  import.meta.env.VITE_TOUR_API_KEY3!,
];

let currentApiKeyIndex = 0;
function getNextApiKey() {
  const key = TOUR_API_KEYS[currentApiKeyIndex];
  currentApiKeyIndex = (currentApiKeyIndex + 1) % TOUR_API_KEYS.length;
  return key;
}

const BASE_URL = import.meta.env.VITE_FUNCTIONS_BASE_URL!
  // 절대 URL이 안 들어왔을 때의 안전장치
  || "https://us-central1-dang-noo-bi.cloudfunctions.net/api";
// const BASE_URL ="";
console.log("🔥 BASE_URL:", BASE_URL);

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
    // console.log('[fetchTourAPI] URL:', url);
    try {
      const res = await fetch(url);
      const ct = res.headers.get("Content-Type") || "";
      // console.log("[fetchTourAPI] ◀️ HTTP", res.status, res.statusText);

      if (!ct.includes("application/json")) {
        const text = await res.text();
        console.warn("[fetchTourAPI] JSON 아닌 응답:", text);

        if (text.includes("LIMITED_NUMBER_OF_SERVICE_REQUESTS_EXCEEDS_ERROR")) {
          attempts++;
          console.warn("[fetchTourAPI] 한도 초과 – 다음 키로 재시도합니다.");
          continue; // 다음 키로 retry
        }
        // limit 에러가 아니면 그냥 빈 배열 리턴
        console.error("[fetchTourAPI] 예기치 못한 응답, 빈 배열 반환");
        return [];
      }

      const json = await res.json();
      // console.log("[fetchTourAPI] ◀️ JSON 응답 전체:", JSON.stringify(json, null, 2));
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

// 키워드 검색 기능 추가 

export interface SearchPlace {
  contentId:     string;
  contentTypeId: string;
  title?:        string;
  addr1?:        string;
  firstimage?:   string;
  overview?:     string;
}

export async function searchPlacesByKeyword(
  keyword: string,
  pageNo: number = 1,
  numOfRows: number = 20,
  arrange: 'A' | 'B' | 'C' = 'C'
): Promise<SearchPlace[]> {
  const items = await fetchTourAPI(
    'KorPetTourService',
    'searchKeyword',
    {
      keyword,
      pageNo:    pageNo.toString(),
      numOfRows: numOfRows.toString(),
      arrange,
    }
  );

  // 필요한 경우 필드명을 camelCase로 변환하여 반환합니다.
  return (items as any[]).map(item => ({
    contentId:     item.contentid,
    contentTypeId: item.contenttypeid,
    title:         item.title,
    addr1:         item.addr1,
    firstimage:    item.firstimage,
    overview:      item.overview,
  }));
}