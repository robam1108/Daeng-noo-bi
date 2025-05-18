// import { onSchedule } from 'firebase-functions/v2/scheduler';
import { onRequest } from 'firebase-functions/v2/https';
import * as admin from 'firebase-admin';
import cors from 'cors';
import express from 'express';
import * as nodemailer from 'nodemailer';
import {
  fetchTourAPI,
  // fetchRegionPlacesFromAPI,
  // fetchThemePlacesFromAPI,
} from './fetchExternal';

// Firebase 초기화
admin.initializeApp();
// const db = admin.firestore();

// CORS 핸들러 (Express용)
const corsHandler = cors({ origin: true });

const app = express();
const apiApp = express();
// 모든 요청에 CORS 적용
apiApp.use(cors({ origin: true }));
app.options("*", cors({ origin: true }));

apiApp.get('/KorPetTourService/:operation', async (req, res) => {
  const operation = req.params.operation;
  const params: Record<string,string> = {};
  for (const [key, value] of Object.entries(req.query)) {
    if (typeof value === 'string') params[key] = value;
    else if (Array.isArray(value) && typeof value[0] === 'string') params[key] = value[0];
    else params[key] = '';
  }

  try {
    // fetchTourAPI 호출: operation과 params만 전달하도록 수정
    const items = await fetchTourAPI(operation, params);
    res.set('Access-Control-Allow-Origin', '*');
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


