// src/api/cacheAPI.ts
import { db } from '../../firebase';
import { doc, getDoc, setDoc, serverTimestamp, Timestamp } from 'firebase/firestore';
import { fetchRegionPlacesFromAPI, fetchThemePlacesFromAPI } from './externalAPI';
import type { ThemeKey } from '../../features/theme/constants/themeConstants';
import type { Place }    from '../../features/theme/api/themeAPI'; 

const TTL_MS = 1000 * 60 * 60;  // 1시간

export async function getCachedRegion(areaCode: number, page = 1) {
  const ref = doc(db, 'regionPlaces', `${areaCode}_page_${page}`);
  const snap = await getDoc(ref);
  if (snap.exists()) {
    const { places, updatedAt } = snap.data() as { places: Place[]; updatedAt: Timestamp };
    const age = Date.now() - updatedAt.toMillis();

    if (age < TTL_MS) {
      console.log(`✅[캐시 히트] regionPlaces/${areaCode}_page_${page} (age: ${Math.floor(age/1000)}s)`);
      return places;
    }
    console.log(`⚠️[캐시 만료] regionPlaces/${areaCode}_page_${page} (age: ${Math.floor(age/1000)}s)`);
  } else {
    console.log(`⚠️[캐시 없음] regionPlaces/${areaCode}_page_${page}`);
  }

  console.log(`🔄 [API 호출] fetchRegionPlacesFromAPI(${areaCode}, ${page})`);
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
      console.log(`✅[캐시 히트] ${themeKey}_page_${page} (age ${Math.floor(age/1000)}s)`);
      return places;
    } else {
      console.log(`⚠️[캐시 만료] ${themeKey}_page_${page} (age ${Math.floor(age/1000)}s)`);
    }
  } else {
    console.log(`⚠️[캐시 없음] ${themeKey}_page_${page}`);
  }

  console.log(`🔄[API 호출] fetchThemePlacesFromAPI(${themeKey}, ${page})`);
  const fresh = await fetchThemePlacesFromAPI(themeKey, page);
  await setDoc(ref, { places: fresh, updatedAt: serverTimestamp() });
  return fresh;
}