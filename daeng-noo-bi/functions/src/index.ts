import { onSchedule } from 'firebase-functions/v2/scheduler';
import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';
import { fetchRegionPlacesFromAPI, fetchThemePlacesFromAPI } from './fetchExternal';

admin.initializeApp();
const db = admin.firestore();

// 전국 지역 코드 리스트
const REGION_CODES = [1, 2, 3, 4, 5, 6, 7, 8, 31, 32, 33, 34, 35, 36, 37, 38, 39] as const;

type ThemeKey =
  | 'nature'
  | 'culture'
  | 'adventure'
  | 'shopping'
  | 'food'
  | 'accommodation';

// 사용 중인 테마 키 리스트
const THEME_KEYS: ThemeKey[] = [
  'nature',
  'culture',
  'adventure',
  'shopping',
  'food',
  'accommodation',
];

// 지역별 페이지 캐시 갱신 스케줄러 생성
REGION_CODES.forEach((areaCode) => {
  const functionName = `refreshRegion_${areaCode}`;
  exports[functionName] = onSchedule('every 60 minutes', async () => {
    const page = 1;
    try {
      console.log(`▶️ [${functionName}] 시작 (지역 코드: ${areaCode}, 페이지: ${page})`);
      const places = await fetchRegionPlacesFromAPI(areaCode, page);
      await db.doc(`regionPlaces/${areaCode}_page_${page}`).set({
        places,
        updatedAt: admin.firestore.FieldValue.serverTimestamp(),
      });
      console.log(`✅ [${functionName}] 완료`);
    } catch (error) {
      console.error(`❌ [${functionName}] 실패:`, error);
    }
  });
});

// 테마별 페이지 캐시 갱신 스케줄러 생성
THEME_KEYS.forEach((themeKey) => {
  const functionName = `refreshTheme_${themeKey}`;
  exports[functionName] = onSchedule('every 60 minutes', async () => {
    const page = 1;
    try {
      console.log(`▶️ [${functionName}] 시작 (테마: ${themeKey}, 페이지: ${page})`);
      const places = await fetchThemePlacesFromAPI(themeKey, page);
      await db.doc(`themePlaces/${themeKey}_page_${page}`).set({
        places,
        updatedAt: admin.firestore.FieldValue.serverTimestamp(),
      });
      console.log(`✅ [${functionName}] 완료`);
    } catch (error) {
      console.error(`❌ [${functionName}] 실패:`, error);
    }
  });
});

export const httpRefreshRegion = functions.https.onRequest(async (req, res) => {
  const areaCode = Number(req.query.code) || 1;
  const page     = Number(req.query.page) || 1;
  const places   = await fetchRegionPlacesFromAPI(areaCode, page);
  await db.doc(`regionPlaces/${areaCode}_page_${page}`)
          .set({ places, updatedAt: admin.firestore.FieldValue.serverTimestamp() });
  res.send(`region ${areaCode}_${page} 캐시 갱신 완료`);
});

export const httpRefreshTheme = functions.https.onRequest(async (req, res) => {
  const theme = (req.query.theme as string) || 'nature';
  const page  = Number(req.query.page)     || 1;
  const places = await fetchThemePlacesFromAPI(theme as any, page);
  await db.doc(`themePlaces/${theme}_page_${page}`)
          .set({ places, updatedAt: admin.firestore.FieldValue.serverTimestamp() });
  res.send(`theme ${theme}_${page} 캐시 갱신 완료`);
});