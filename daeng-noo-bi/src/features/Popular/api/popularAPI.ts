// src/api/popularAPI.ts
import { fetchTourAPI } from '../../../shared/api/fetcher';
import { FALLBACK_IMAGES } from '../../../shared/constants/fallbackImages';
import { db } from "../../../firebase";
import {
  collection,
  query,
  orderBy,
  limit,
  getDocs,
  QueryDocumentSnapshot,
  DocumentData,
} from "firebase/firestore";

export const PAGE_SIZE = 9;
export interface RawPlace {
  contentid:   string;
  title:       string;
  firstimage?: string;
  firstimage2?: string;
  addr1?:      string;
  addr2?:      string;
}

export interface Place extends RawPlace {
  finalImage: string;
  addr1:      string;
}

export async function fetchPopularPlaces(page = 1): Promise<Place[]> {
  const params = {
    numOfRows: String(PAGE_SIZE),
    pageNo:    String(page),
    contentTypeId: '12',
    arrange:   'P',
    mapX:       '127.5',      // 전국 중심 경도
    mapY:       '36.5',       // 전국 중심 위도
    radius:    '200000',     // 반경 200km (m 단위)
    MobileOS:  'ETC',
    MobileApp: 'PetTourApp',
    _type:     'json',
  };

  // 1) locationBasedList 호출
  const result = await fetchTourAPI(
    'KorPetTourService',
    'locationBasedList',
    params
  );
  const raw: RawPlace[] = Array.isArray(result)
    ? result
    : result
    ? [result]
    : [];

  // 2) finalImage·addr1 보완
  const places: Place[] = raw.map(p => ({
    ...p,
    finalImage:
      p.firstimage ||
      p.firstimage2 ||
      FALLBACK_IMAGES[p.title] ||
      '/images/no-image.png',
    addr1: p.addr1 || p.addr2 || '주소 정보 없음',
  }));

  return places;
}

export async function fetchTopFavoritedPlaces(): Promise<Place[]> {
  // 1) 컬렉션 참조(collection)  
  const placesColl = collection(db, "places");

  // 2) 쿼리(query) 구성: favoriteCount 내림차순 정렬 + 개수 제한
  const favQuery = query(
    placesColl,
    orderBy("favoriteCount", "desc"),
    limit(PAGE_SIZE)
  );

  // 3) 문서 조회
  const snapshot = await getDocs(favQuery);
  console.log("[fetchTopFavoritedPlaces] snapshot docs:", snapshot.docs.length);

  // 4) Snapshot.docs 의 각 doc 타입을 명시하고, Place 배열로 매핑
  const places: Place[] = snapshot.docs.map(
      (doc: QueryDocumentSnapshot<DocumentData>) => {
        const data = doc.data();
        const title      = data.title       as string;
        const storedImg  = data.finalImage  as string | undefined;
        const addr       = data.addr1       as string | undefined;
  
        return {
          contentid:  data.contentid as string,
          title,
          // 빈 문자열 또는 undefined일 경우 API fallback → 그래도 없으면 기본 no-image.png
          finalImage:
            storedImg ||
            FALLBACK_IMAGES[title] ||
            "/images/no-image.png",
          addr1: addr || "주소 정보 없음",
        };
      }
    );
  console.log("[fetchTopFavoritedPlaces] returned places:", places);
  return places;
}