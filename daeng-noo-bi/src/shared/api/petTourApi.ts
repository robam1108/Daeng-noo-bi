import { fetchTourAPI } from './fetcher';
import { FALLBACK_IMAGES } from '../constants/fallbackImages';

/**
 * 화면에 최소한으로 표시할 장소 요약 정보 타입
 */
export interface PlaceDetail {
    contentId: string;          // 콘텐츠 고유 ID
    contentTypeId: string;      // 관광타입 ID
    title?: string;             // 제목
    addr1?: string;             // 대표 주소
    addr2?: string;             // 추가 주소
    firstimage?: string;        // API에서 내려주는 대표 이미지
    firstimage2?: string;       // API에서 내려주는 두번째 이미지
    overview?: string;          // 개요
    tel?: string;               // 연락처
    homepage?: string;          // 홈페이지
    finalImage: string;         // 보완된 이미지 URL
}

function toSecureUrl(url?: string): string | null {
    if (!url) return null;
    return url.startsWith('http://') ? url.replace('http://', 'https://') : url;
}

/**
 * contentId 하나로 최소 요약 정보만 뽑아온다.
 * KorService 의 detailCommon 오퍼레이션을 사용하며,
 * 불필요한 필드는 요청하지 않아 응답이 가볍다.
 *
 * @param contentId 관광지 고유 ID
 * @returns PlaceDetail 객체 또는 null (조회 실패 시)
 */
export async function fetchPlaceDetail(
    contentId: string
): Promise<PlaceDetail | null> {
    try {
        // 1) API 호출: detailCommon
        const items = await fetchTourAPI('KorPetTourService', 'detailCommon', {
            contentId,        // 필수: 콘텐츠 ID
            // contentTypeId,
            defaultYN: 'Y',   // 기본정보는 생략 (필요 없으면 N)
            overviewYN: 'Y',  // 개요 생략
            addrinfoYN: 'Y',  // 주소만 가져오기
            firstImageYN: 'Y',// 첫 번째 이미지 URL
            // API 문서에 따라 secondImageYN 옵션이 있다면 추가 요청
            // secondImageYN: 'Y',
        });

        // 디버깅용 로그
        // console.log('[fetchPlaceDetail] 요청 파라미터:', { contentId });
        // console.log('[fetchPlaceDetail] API 응답 items:', items);

        // 2) API가 배열로 주기도, 단일 객체로 주기도 하므로 처리
        const raw = Array.isArray(items) ? items[0] : items;
        if (!raw || !raw.contentid) {
            console.warn('[fetchPlaceDetail] 유효한 데이터가 없습니다:', raw);
            return null;
        }

        // 3) 이미지 보완 로직
        const finalImage =
            toSecureUrl(raw.firstimage) ||
            toSecureUrl(raw.firstimage2) ||
            FALLBACK_IMAGES[raw.title || ''] ||
            '/no-image.png';

        // 4) PlaceDetail 형태로 매핑
        const detail: PlaceDetail = {
            contentId: raw.contentid,
            contentTypeId: raw.contenttypeid,
            title: raw.title,
            addr1: raw.addr1,
            addr2: raw.addr2,
            firstimage: raw.firstimage,
            firstimage2: raw.firstimage2,
            overview: raw.overview,
            tel: raw.tel,
            homepage: raw.homepage,
            finalImage,                // 보완된 이미지
        };
        return detail;
    } catch (e) {
        console.error('[fetchPlaceDetail] API 조회 실패:', e);
        return null;
    }
}