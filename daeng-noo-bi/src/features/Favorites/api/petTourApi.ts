import { fetchTourAPI } from '../../../shared/api/fetcher';

/**
 * 화면에 최소한으로 표시할 장소 요약 정보 타입
 */
export interface PlaceDetail {
    contentId: string;     // 콘텐츠 고유 ID (필수)
    title?: string;        // 제목
    addr1?: string;        // 대표 주소
    addr2?: string;
    firstimage?: string;   // 대표 이미지 URL
    firstimage2?: string;  // 추가 이미지 URL (API에 포함돼 있으면)
    overview?: string;
    tel?: string;
    homepage?: string;
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
            contentId: contentId,        // 필수: 콘텐츠 ID  // 필수:
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

        // 3) PlaceDetail 형태로 매핑
        const detali: PlaceDetail = {
            contentId: raw.contentid,
            title: raw.title,
            addr1: raw.addr1,
            addr2: raw.addr2,
            firstimage: raw.firstimage,
            firstimage2: (raw as any).firstimage2, // API에 따라 없을 수도 있음
            tel: raw.tel,
            overview: raw.overview,
            homepage: raw.homepage,
        };
        return detali;
    } catch (e) {
        console.error('[fetchPlaceDetail] API 조회 실패:', e);
        return null;
    }
}