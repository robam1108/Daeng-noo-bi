"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.api = exports.sendVerificationCode = exports.httpRefreshTheme = exports.httpRefreshRegion = void 0;
const scheduler_1 = require("firebase-functions/v2/scheduler");
const https_1 = require("firebase-functions/v2/https");
const admin = __importStar(require("firebase-admin"));
const cors_1 = __importDefault(require("cors"));
const nodemailer = __importStar(require("nodemailer"));
const fetchExternal_1 = require("./fetchExternal");
// CORS 설정: 모든 출처 허용
const corsHandler = (0, cors_1.default)({ origin: true });
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
const REGION_CODES = [1, 2, 3, 4, 5, 6, 7, 8, 31, 32, 33, 34, 35, 36, 37, 38, 39];
// 사용 중인 테마 키 리스트
const THEME_KEYS = [
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
    exports[functionName] = (0, scheduler_1.onSchedule)('every 60 minutes', async () => {
        const page = 1;
        try {
            console.log(`▶️ [${functionName}] 시작 (지역 코드: ${areaCode}, 페이지: ${page})`);
            const places = await (0, fetchExternal_1.fetchRegionPlacesFromAPI)(areaCode, page);
            await db.doc(`regionPlaces/${areaCode}_page_${page}`).set({
                places,
                updatedAt: admin.firestore.FieldValue.serverTimestamp(),
            });
            console.log(`✅ [${functionName}] 완료`);
        }
        catch (error) {
            console.error(`❌ [${functionName}] 실패:`, error);
        }
    });
});
// 테마별 페이지 캐시 갱신 스케줄러 생성
THEME_KEYS.forEach((themeKey) => {
    const functionName = `refreshTheme_${themeKey}`;
    exports[functionName] = (0, scheduler_1.onSchedule)('every 60 minutes', async () => {
        const page = 1;
        try {
            console.log(`▶️ [${functionName}] 시작 (테마: ${themeKey}, 페이지: ${page})`);
            const places = await (0, fetchExternal_1.fetchThemePlacesFromAPI)(themeKey, page);
            await db.doc(`themePlaces/${themeKey}_page_${page}`).set({
                places,
                updatedAt: admin.firestore.FieldValue.serverTimestamp(),
            });
            console.log(`✅ [${functionName}] 완료`);
        }
        catch (error) {
            console.error(`❌ [${functionName}] 실패:`, error);
        }
    });
});
// HTTP 엔드포인트: 지역 캐시 즉시 갱신 (CORS 허용)
exports.httpRefreshRegion = (0, https_1.onRequest)((req, res) => {
    corsHandler(req, res, async () => {
        const areaCode = Number(req.query.code) || 1;
        const page = Number(req.query.page) || 1;
        try {
            const places = await (0, fetchExternal_1.fetchRegionPlacesFromAPI)(areaCode, page);
            await db.doc(`regionPlaces/${areaCode}_page_${page}`).set({
                places,
                updatedAt: admin.firestore.FieldValue.serverTimestamp(),
            });
            res.status(200).send(`region ${areaCode}_${page} 캐시 갱신 완료`);
        }
        catch (error) {
            console.error('httpRefreshRegion 실패:', error);
            res.status(500).send('캐시 갱신 중 오류가 발생했습니다.');
        }
    });
});
// HTTP 엔드포인트: 테마 캐시 즉시 갱신 (CORS 허용)
exports.httpRefreshTheme = (0, https_1.onRequest)((req, res) => {
    corsHandler(req, res, async () => {
        const theme = req.query.theme || 'nature';
        const page = Number(req.query.page) || 1;
        try {
            const places = await (0, fetchExternal_1.fetchThemePlacesFromAPI)(theme, page);
            await db.doc(`themePlaces/${theme}_page_${page}`).set({
                places,
                updatedAt: admin.firestore.FieldValue.serverTimestamp(),
            });
            res.status(200).send(`theme ${theme}_${page} 캐시 갱신 완료`);
        }
        catch (error) {
            console.error('httpRefreshTheme 실패:', error);
            res.status(500).send('캐시 갱신 중 오류가 발생했습니다.');
        }
    });
});
// // 이메일 인증 코드 발송 함수 (CORS 허용 및 Preflight 처리)
exports.sendVerificationCode = (0, https_1.onRequest)((req, res) => {
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
        const { email, code } = req.body;
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
        }
        catch (err) {
            console.error('sendVerificationCode 오류', err);
            res.status(500).json({ success: false });
        }
    });
});
const express_1 = __importDefault(require("express"));
const fetchExternal_2 = require("./fetchExternal"); // fetchExternal이 fetchTourAPI를 re-export 하도록 수정하셔야 합니다.
// 1) Express 앱 생성
const apiApp = (0, express_1.default)();
// 2) CORS 설정 (기존 corsHandler 재사용)
apiApp.use((req, res, next) => corsHandler(req, res, next));
// 3) KorPetTourService 모든 operation 처리
apiApp.get('/KorPetTourService/:operation', async (req, res) => {
    const operation = req.params.operation;
    // ❶ 타입 가드로 string/string[] 만 골라내기
    const params = {};
    for (const [key, value] of Object.entries(req.query)) {
        let strValue;
        if (typeof value === 'string') {
            strValue = value;
        }
        else if (Array.isArray(value) && typeof value[0] === 'string') {
            strValue = value[0];
        }
        else {
            // 그 외(ParsedQs 등)는 빈 문자열 또는 기본값 처리
            strValue = '';
        }
        params[key] = strValue;
    }
    try {
        const items = await (0, fetchExternal_2.fetchTourAPI)('KorPetTourService', operation, params);
        res.json({ items });
    }
    catch (err) {
        console.error('KorPetTourService proxy error:', err);
        res.status(500).send('Internal Server Error');
    }
});
// 4) 이 Express 앱을 onRequest 함수로 내보내기
exports.api = (0, https_1.onRequest)(apiApp);
//# sourceMappingURL=index.js.map