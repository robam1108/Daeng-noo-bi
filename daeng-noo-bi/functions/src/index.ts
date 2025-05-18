import { onSchedule } from 'firebase-functions/v2/scheduler';
import { onRequest } from 'firebase-functions/v2/https';
import * as admin from 'firebase-admin';
import cors from 'cors';
import * as nodemailer from 'nodemailer';
import {
  fetchRegionPlacesFromAPI,
  fetchThemePlacesFromAPI,
} from './fetchExternal';

// CORS 설정: 모든 출처 허용
const corsHandler = cors({ origin: true });

// Firebase 초기화
admin.initializeApp();
const db = admin.firestore();

const gmailEmail = process.env.GMAIL_EMAIL || '';
const gmailPass = process.env.GMAIL_PASS || '';

// nodemailer transporter
const mailTransporter = nodemailer.createTransport({
  service: 'gmail',
  auth: { user: gmailEmail, pass: gmailPass },
});

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

// HTTP 엔드포인트: 지역 캐시 즉시 갱신 (CORS 허용)
export const httpRefreshRegion = onRequest((req, res) => {
  corsHandler(req, res, async () => {
    const areaCode = Number(req.query.code) || 1;
    const page = Number(req.query.page) || 1;
    try {
      const places = await fetchRegionPlacesFromAPI(areaCode, page);
      await db.doc(`regionPlaces/${areaCode}_page_${page}`).set({
        places,
        updatedAt: admin.firestore.FieldValue.serverTimestamp(),
      });
      res.status(200).send(`region ${areaCode}_${page} 캐시 갱신 완료`);
    } catch (error) {
      console.error('httpRefreshRegion 실패:', error);
      res.status(500).send('캐시 갱신 중 오류가 발생했습니다.');
    }
  });
});

// HTTP 엔드포인트: 테마 캐시 즉시 갱신 (CORS 허용)
export const httpRefreshTheme = onRequest((req, res) => {
  corsHandler(req, res, async () => {
    const theme = (req.query.theme as string) || 'nature';
    const page = Number(req.query.page) || 1;
    try {
      const places = await fetchThemePlacesFromAPI(theme as ThemeKey, page);
      await db.doc(`themePlaces/${theme}_page_${page}`).set({
        places,
        updatedAt: admin.firestore.FieldValue.serverTimestamp(),
      });
      res.status(200).send(`theme ${theme}_${page} 캐시 갱신 완료`);
    } catch (error) {
      console.error('httpRefreshTheme 실패:', error);
      res.status(500).send('캐시 갱신 중 오류가 발생했습니다.');
    }
  });
});

// // 이메일 인증 코드 발송 함수 (CORS 허용 및 Preflight 처리)
export const sendVerificationCode = onRequest((req, res) => {
  corsHandler(req, res, async () => {
    // Preflight 요청 처리
    if (req.method === 'OPTIONS') {
      res.status(204).end();
      return;
    }
    if (req.method !== 'POST') {
      res.status(405).send('Method Not Allowed');
      return;
    }

    const { email, code } = req.body as { email: string; code: string };
    const isDev = process.env.NODE_ENV !== 'production' || process.env.FUNCTIONS_EMULATOR === 'true';

    if (isDev) {
      console.log(`[DEV] sendVerificationCode → ${email}: ${code}`);
      res.status(200).json({ success: true, dev: true });
      return;
    }

    try {
      await mailTransporter.sendMail({
        from: `"Your App" <${gmailEmail}>`,
        to: email,
        subject: '인증 코드입니다',
        text: `인증 코드: ${code}`,
      });
      res.status(200).json({ success: true });
    } catch (err) {
      console.error('sendVerificationCode 오류', err);
      res.status(500).json({ success: false });
    }
  });
});
