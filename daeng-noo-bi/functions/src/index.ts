import { onSchedule } from 'firebase-functions/v2/scheduler';
import { onRequest } from 'firebase-functions/v2/https';
import * as admin from 'firebase-admin';
import cors from 'cors';
import express from 'express';
import * as nodemailer from 'nodemailer';
import {
  fetchTourAPI,
  fetchRegionPlacesFromAPI,
  fetchThemePlacesFromAPI,
} from './fetchExternal';

// Firebase 초기화
admin.initializeApp();
const db = admin.firestore();

// CORS 핸들러 (Express용)
const corsHandler = cors({ origin: true });

const apiApp = express();
// 모든 요청에 CORS 적용
apiApp.use(cors({ origin: true }));

apiApp.get('/KorPetTourService/:operation', async (req, res) => {
  try {
    const service = 'KorPetTourService';
    const operation = req.params.operation;
    const params: Record<string, string> = {};
    for (const [key, value] of Object.entries(req.query)) {
      if (typeof value === 'string') params[key] = value;
      else if (Array.isArray(value) && typeof value[0] === 'string') params[key] = value[0];
      else params[key] = '';
    }

    const items = await fetchTourAPI(service,operation, params);
    res.json({ response: { body: { items: { item: items } } } });
  } catch (err) {
    console.error('KorPetTourService proxy error:', err);
    res.status(500).send('Internal Server Error');
  }
});

// Express 앱을 Firebase Function으로 내보내기
export const api = onRequest(apiApp);

const gmailEmail = process.env.GMAIL_EMAIL || '';
const gmailPass = process.env.GMAIL_PASS || '';

// nodemailer transporter
const mailTransporter = nodemailer.createTransport({
  service: 'gmail',
  auth: { user: gmailEmail, pass: gmailPass },
});


// 이메일 인증 코드 발송 함수 (CORS 허용 및 Preflight 처리)
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

import { REGION_CODES } from '../constants/regionConstants';

REGION_CODES.forEach((region) => {
  const functionName = `refreshRegion_${region.code}`;
  exports[functionName] = onSchedule('0 18 * * *', async () => {
    const page = 1;
    try {
      console.log(`▶️ [${functionName}] 시작 (지역 코드: ${region.code}, 페이지: ${page})`);
      const places = await fetchRegionPlacesFromAPI(region.code, page);
      
      await db.doc(`regionPlaces/${region.code}_page_${page}`).set({
        places,  // ← 비어 있어도 저장
        updatedAt: admin.firestore.FieldValue.serverTimestamp(),
      });

      if (places.length > 0) {
        console.log(`✅ [${functionName}] 캐시 저장 완료 (${places.length}개)`);
      } else {
        console.warn(`⚠️ [${functionName}] 빈 결과지만 캐시 저장 완료`);
      }

    } catch (err) {
      console.error(`❌ [${functionName}] 오류 발생:`, err);
    }
  });
});

const themeKeys = ['nature', 'culture', 'adventure', 'shopping', 'food', 'accommodation'];

themeKeys.forEach((key) => {
  const functionName = `refreshTheme_${key}`;
  exports[functionName] = onSchedule('0 18 * * *', async () => {
    const page = 1;
    try {
      console.log(`▶️ [${functionName}] 시작 (테마 키: ${key}, 페이지: ${page})`);
      const places = await fetchThemePlacesFromAPI(key, page);
      if (places.length > 0) {
        await db.doc(`themePlaces/${key}_page_${page}`).set({
          places,
          updatedAt: admin.firestore.FieldValue.serverTimestamp(),
        });
        console.log(`✅ [${functionName}] 캐시 저장 완료 (${places.length}개)`);
      } else {
        console.warn(`⚠️ [${functionName}] 빈 결과, 캐시 생략`);
      }
    } catch (err) {
      console.error(`❌ [${functionName}] 오류 발생:`, err);
    }
  });
});