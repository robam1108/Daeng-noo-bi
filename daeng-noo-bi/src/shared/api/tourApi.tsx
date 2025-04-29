// src/api/tourApi.ts
import { fetchTourAPI } from './fetcher';

// 반려동물 동반 가능한 관광지 목록
export function fetchPetFriendlyPlaces(areaCode: string) {
  return fetchTourAPI('KorPetTourService', 'areaBasedList', {
    areaCode, // 필수: 지역 코드
    numOfRows: '20', // 한 번에 가져올 개수
    pageNo: '1', // 페이지 번호 (기본 1)
    arrange: 'A',  // 정렬 방식 (A: 제목순)
    contentTypeId: '12', // 관광지 유형 (12: 관광지, 32: 숙박, 39: 음식점 등)
  });
}

// 관광지 상세정보 (이미지, 설명 등)
export function fetchDetailCommon(contentId: string) {
  return fetchTourAPI('KorService', 'detailCommon', {
    contentId,// 필수: 콘텐츠 ID
    defaultYN: 'Y', // 기본정보 포함 여부
    overviewYN: 'Y',// 개요 포함 여부
    addrinfoYN: 'Y',// 주소 포함 여부
    telYN: 'Y',// 전화번호 포함 여부
    firstImageYN: 'Y',// 대표 이미지 포함 여부
  });
}