// src/api/cacheAPI.ts
import { db } from '../../firebase';
import { doc, getDoc, setDoc, serverTimestamp, Timestamp } from 'firebase/firestore';
import { fetchRegionPlacesFromAPI, fetchThemePlacesFromAPI, fetchPlaceDetailFromAPI, fetchDetailIntroFromAPI, fetchPlaceImageFromAPI } from './externalAPI';
import type { ThemeKey } from '../../features/theme/constants/themeConstants';
import type { Place } from '../../features/theme/api/themeAPI';
import type { PlaceDetail } from './petTourApi';
import type { PlaceImage } from '../../features/Detail/api/fetchImages';
import type { DetailIntroResponse } from '../../features/Detail/api/fetchDetailIntro';


const TTL_MS = 1000 * 60 * 60;  // 1시간

export async function getCachedRegion(areaCode: number, page = 1) {
  const ref = doc(db, 'regionPlaces', `${areaCode}_page_${page}`);
  const snap = await getDoc(ref);
  if (snap.exists()) {
    const { places, updatedAt } = snap.data() as { places: Place[]; updatedAt: Timestamp };
    const age = Date.now() - updatedAt.toMillis();

    if (age < TTL_MS) {
      // console.log(`✅[캐시 히트] regionPlaces/${areaCode}_page_${page} (age: ${Math.floor(age / 1000)}s)`);
      return places;
    }
    // console.log(`⚠️[캐시 만료] regionPlaces/${areaCode}_page_${page} (age: ${Math.floor(age / 1000)}s)`);
  } else {
    // console.log(`⚠️[캐시 없음] regionPlaces/${areaCode}_page_${page}`);
  }

  // console.log(`🔄 [API 호출] fetchRegionPlacesFromAPI(${areaCode}, ${page})`);
  const fresh = await fetchRegionPlacesFromAPI(areaCode, page);
  await setDoc(ref, { places: fresh, updatedAt: serverTimestamp() });
  return fresh;
}

export async function getCachedTheme(
  themeKey: ThemeKey,
  page = 1
): Promise<Place[]> {
  const ref = doc(db, 'themePlaces', `${themeKey}_page_${page}`);
  const snap = await getDoc(ref);

  if (snap.exists()) {
    const { places, updatedAt } =
      snap.data() as { places: Place[]; updatedAt: Timestamp };
    const age = Date.now() - updatedAt.toMillis();

    if (age < TTL_MS) {
      // console.log(`✅[캐시 히트] ${themeKey}_page_${page} (age ${Math.floor(age / 1000)}s)`);
      return places;
    } else {
      // console.log(`⚠️[캐시 만료] ${themeKey}_page_${page} (age ${Math.floor(age / 1000)}s)`);
    }
  } else {
    // console.log(`⚠️[캐시 없음] ${themeKey}_page_${page}`);
  }

  // console.log(`🔄[API 호출] fetchThemePlacesFromAPI(${themeKey}, ${page})`);
  const fresh = await fetchThemePlacesFromAPI(themeKey, page);
  await setDoc(ref, { places: fresh, updatedAt: serverTimestamp() });
  return fresh;
}

/**
 * contentId로 조회한 PlaceDetail을 캐싱하여 반환
 */
export async function getCachedPlaceDetail(contentId: string): Promise<PlaceDetail> {
  const ref = doc(db, 'placeDetails', contentId);
  const snap = await getDoc(ref);

  if (snap.exists()) {
    const { detail, updatedAt } = snap.data() as { detail: PlaceDetail; updatedAt: Timestamp };
    const age = Date.now() - updatedAt.toMillis();

    if (age < TTL_MS) {
      // console.log(`✅[캐시 히트] placeDetails/${contentId} (age: ${Math.floor(age / 1000)}s)`);
      return detail;
    }
    // console.log(`⚠️[캐시 만료] placeDetails/${contentId} (age: ${Math.floor(age / 1000)}s)`);
  } else {
    // console.log(`⚠️[캐시 없음] placeDetails/${contentId}`);
  }

  // console.log(`🔄 [API 호출] fetchPlaceDetailFromAPI(${contentId})`);
  const freshDetail = await fetchPlaceDetailFromAPI(contentId);
  await setDoc(ref, { detail: freshDetail, updatedAt: serverTimestamp() });
  return freshDetail!;
}

/**
 * contentId로 조회한 PlaceImage[] 배열을 캐싱하여 반환
 */
export async function getCachedPlaceImages(contentId: string): Promise<PlaceImage[]> {
  const ref = doc(db, 'placeImages', contentId);
  const snap = await getDoc(ref);

  if (snap.exists()) {
    const { images, updatedAt } = snap.data() as { images: PlaceImage[]; updatedAt: Timestamp };
    const age = Date.now() - updatedAt.toMillis();

    if (age < TTL_MS) {
      // console.log(`✅[캐시 히트] placeImages/${contentId} (age: ${Math.floor(age / 1000)}s)`);
      return images;
    }
    // console.log(`⚠️[캐시 만료] placeImages/${contentId} (age: ${Math.floor(age / 1000)}s)`);
  } else {
    // console.log(`⚠️[캐시 없음] placeImages/${contentId}`);
  }

  // console.log(`🔄 [API 호출] fetchPlaceImageFromAPI(${contentId})`);
  const freshImages = await fetchPlaceImageFromAPI(contentId);
  await setDoc(ref, { images: freshImages, updatedAt: serverTimestamp() });
  return freshImages!;
}

/**
 * contentId, contentTypeId로 호출한 DetailIntro 데이터를 캐시하여 반환
 */
export async function getCachedDetailIntro(
  contentId: string,
  contentTypeId: string
): Promise<DetailIntroResponse | null> {
  const ref = doc(db, 'detailIntros', `${contentId}_${contentTypeId}`);
  const snap = await getDoc(ref);

  if (snap.exists()) {
    const data = snap.data() as { intro: DetailIntroResponse; updatedAt: Timestamp };
    const age = Date.now() - data.updatedAt.toMillis();
    if (age < TTL_MS) {
      // console.log(`✅[캐시 히트] detailIntros/${contentId}_${contentTypeId}`);
      return data.intro;
    }
    // console.log(`⚠️[캐시 만료] detailIntros/${contentId}_${contentTypeId}`);
  } else {
    // console.log(`⚠️[캐시 없음] detailIntros/${contentId}_${contentTypeId}`);
  }

  // console.log(`🔄[API 호출] fetchDetailIntroFromAPI(${contentId}, ${contentTypeId})`);
  const freshIntro = await fetchDetailIntroFromAPI(contentId, contentTypeId);
  if (freshIntro) {
    await setDoc(ref, { intro: freshIntro, updatedAt: serverTimestamp() });
  }
  return freshIntro;
}