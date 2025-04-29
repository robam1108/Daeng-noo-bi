import { fetchTourAPI } from '../../../shared/api/fetcher';

export const PAGE_SIZE = 9;

export interface RawPlace {
  contentid: string;
  title: string;
  firstimage?: string;
  firstimage2?: string;
  // …기타 필드…
}

/**
 * areaCode, page로 반려동물 여행지 원본 데이터  (raw) 9개를 가져옴
 */
export async function fetchPetFriendlyPlacesByRegion(
  areaCode: number,
  page: number = 1
): Promise<RawPlace[]> {
  const params = {
    numOfRows: String(PAGE_SIZE),
    pageNo: String(page),
    arrange: "P",
    areaCode: String(areaCode),
  };

  const result = await fetchTourAPI("KorPetTourService", "areaBasedList", params);

  // result가 배열이면 그대로, 아니면 단일 객체를 배열로
  if (Array.isArray(result)) {
    return result;
  }
  if (result) {
    return [result];
  }
  return [];
}