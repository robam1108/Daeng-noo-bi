//  @ts-ignore: no type declarations for node-fetch
import fetch from 'node-fetch';

const API_BASE = 'https://api.visitkorea.or.kr/openapi/service/rest/KorPetTourService';
const API_KEY = process.env.TOUR_API_KEY!;
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

// 인기별 페이지 캐시 갱신용
export async function fetchPopularPlacesFromAPI(page = 1): Promise<Place[]> {
  const params = new URLSearchParams({
    ServiceKey:  API_KEY,
    MobileOS:    'ETC',
    MobileApp:   'PetTourApp',
    _type:       'json',
    numOfRows:   PAGE_SIZE.toString(),
    pageNo:      page.toString(),
    arrange:     'P',
    mapX:        '127.5',
    mapY:        '36.5',
    radius:      '200000',
  });
  const res = await fetch(`${API_BASE}/locationBasedList?${params}`);
  const data = await res.json();
  const items: RawPlace[] = data.response?.body?.items?.item ?? [];
  return items.map(p => ({
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
  const params = new URLSearchParams({
    ServiceKey:  API_KEY,
    MobileOS:    'ETC',
    MobileApp:   'PetTourApp',
    _type:       'json',
    numOfRows:   PAGE_SIZE.toString(),
    pageNo:      page.toString(),
    arrange:     'P',
    areaCode:    areaCode.toString(),
  });
  const res = await fetch(`${API_BASE}/areaBasedList?${params}`);
  const data = await res.json();
  const items: RawPlace[] = data.response?.body?.items?.item ?? [];

  // 추가 이미지 및 주소 보완 로직은 필요 시 구현
  return items.map(p => ({
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
  const configs = {
    nature:       { contentTypeId: '12', cat1Filter: 'A01' },
    culture:      { contentTypeId: '14' },
    adventure:    { contentTypeId: '28' },
    shopping:     { contentTypeId: '38' },
    food:         { contentTypeId: '39' },
    accommodation:{ contentTypeId: '32' },
  } as Record<string,{contentTypeId:string}>;

  const cfg = configs[themeKey] || { contentTypeId: '12' };
  const params = new URLSearchParams({
    ServiceKey:    API_KEY,
    MobileOS:      'ETC',
    MobileApp:     'PetTourApp',
    _type:         'json',
    numOfRows:     PAGE_SIZE.toString(),
    pageNo:        page.toString(),
    arrange:       'P',
    contentTypeId: cfg.contentTypeId,
  });
  const res = await fetch(`${API_BASE}/searchKeyword?${params}`);
  const data = await res.json();
  const items: RawPlace[] = data.response?.body?.items?.item ?? [];
  return items.map(p => ({
    ...p,
    finalImage: p.firstimage || p.firstimage2 || '/images/no-image.png',
    addr1:      p.addr1 || p.addr2 || '주소 정보 없음',
  }));
}
