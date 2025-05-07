import { fetchTourAPI } from "../../../shared/api/fetcher";

export interface PlaceImage {
    contentid: string;
    imgname?: string;
    originimgurl?: string;
    smallimageurl?: string;
    cpyrhtDivCd?: string    // 저작권 유형 (Type1:제1유형(출처표시-권장) ,Type3: 제3유형(제1유형+변경금지
}


export async function fetchPlaceImage(
    contentId: string
): Promise<PlaceImage[] | null> {
    try {
        // 1) API 호출: detailImage
        const items = await fetchTourAPI('KorPetTourService', 'detailImage', {
            contentId,        // 필수: 콘텐츠 ID
            imageYN: 'Y',
            numOfRows: '4',
            pageNo: '1',
        });

        const raw = Array.isArray(items) ? items : items ? [items] : [];
        if (raw.length === 0) {
            console.warn('[fetchPlaceImage] 이미지가 없습니다');
            return null;
        }

        const rawImages: PlaceImage[] = raw.map(img => ({
            contentid: img.contentid,
            imgname: img.imgname,
            originimgurl: img.originimgurl,
            smallimageurl: img.smallimageurl,
            cpyrhtDivCd: img.cpyrhtDivCd,
        }));

        return rawImages;
    } catch (e) {
        console.error('[fetchPlaceImage] API 조회 실패:', e);
        return null;
    }
}