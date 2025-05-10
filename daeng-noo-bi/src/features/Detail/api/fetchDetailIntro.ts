import { fetchTourAPI } from "../../../shared/api/fetcher";

// 공통 베이스
interface DetailIntroBase {
    contentid: string;
    contenttypeid: string;
}

// contentTypeId = '12' (관광지)
export interface DetailIntroTourist extends DetailIntroBase {
    contenttypeid: '12';
    useseason: string;
    usetime: string;
    parking: string;
    infocenter: string;
    restdate: string;
}

// contentTypeId = '14' (문화시설)
export interface DetailIntroCulture extends DetailIntroBase {
    contenttypeid: '14';
    infocenterculture: string;
    parkingculture: string;
    parkingfee: string;
    restdateculture: string;
    usefee: string;
    usetimeculture: string;
}

// contentTypeId = '28' (레포츠)
export interface DetailIntroLeports extends DetailIntroBase {
    contenttypeid: '28';
    expagerangeleports: string;
    infocenterleports: string;
    openperiod: string;
    restdateleports: string;
    usefeeleports: string;
    usetimeleports: string;
}

// contentTypeId = '32' (숙박)
export interface DetailIntroStay extends DetailIntroBase {
    contenttypeid: '32';
    checkintime: string;
    checkouttime: string;
    chkcooking: string;
    parkinglodgin: string;
    reservationurl: string;
}

// contentTypeId = '38' (쇼핑)
export interface DetailIntroShopping extends DetailIntroBase {
    contenttypeid: '38';
    fairday: string;
    opentime: string;
    parkingshopping: string;
    restdateshopping: string;
    infocentershopping: string;
}

// contentTypeId = '39' (음식점)
export interface DetailIntroFood extends DetailIntroBase {
    contenttypeid: '39';
    opentimefood: string;
    parkingfood: string;
    restdatefood: string;
    infocenterfood: string;
}



// 모든 경우를 묶은 유니언
export type DetailIntroResponse =
    | DetailIntroTourist
    | DetailIntroCulture
    | DetailIntroLeports
    | DetailIntroStay
    | DetailIntroShopping
    | DetailIntroFood;

// 함수 오버로드 시그니처
export function fetchDetailIntro(
    contentId: string,
    contentTypeId: '12'
): Promise<DetailIntroTourist | null>;
export function fetchDetailIntro(
    contentId: string,
    contentTypeId: '14'
): Promise<DetailIntroCulture | null>;
export function fetchDetailIntro(
    contentId: string,
    contentTypeId: '28'
): Promise<DetailIntroLeports | null>;
export function fetchDetailIntro(
    contentId: string,
    contentTypeId: '32'
): Promise<DetailIntroStay | null>;
export function fetchDetailIntro(
    contentId: string,
    contentTypeId: '38'
): Promise<DetailIntroShopping | null>;
export function fetchDetailIntro(
    contentId: string,
    contentTypeId: '39'
): Promise<DetailIntroFood | null>;
// 일반 시그니처 (fallback)
export function fetchDetailIntro(
    contentId: string,
    contentTypeId: string
): Promise<DetailIntroResponse | null>;

// 구현부
export async function fetchDetailIntro(
    contentId: string,
    contentTypeId: string
): Promise<DetailIntroResponse | null> {
    try {
        const items = await fetchTourAPI(
            "KorPetTourService",
            "detailIntro",
            { contentId, contentTypeId }
        );
        const raw = Array.isArray(items) ? items[0] : items;
        if (!raw || !raw.contenttypeid) {
            console.warn('[fetchDetailIntro] 유효한 데이터가 없습니다:', raw);
            return null;
        }

        switch (raw.contenttypeid) {
            case "12":
                return raw as DetailIntroTourist;
            case "14":
                return raw as DetailIntroCulture;
            case "28":
                return raw as DetailIntroLeports;
            case "32":
                return raw as DetailIntroStay;
            case "38":
                return raw as DetailIntroShopping;
            case "39":
                return raw as DetailIntroFood;
            default:
                return null;
        }
    } catch (e) {
        console.error("[fetchDetailIntro] 실패", e);
        return null;
    }
}
