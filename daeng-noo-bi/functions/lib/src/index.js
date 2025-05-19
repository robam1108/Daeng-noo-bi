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
exports.sendVerificationCode = exports.api = void 0;
const scheduler_1 = require("firebase-functions/v2/scheduler");
const https_1 = require("firebase-functions/v2/https");
const admin = __importStar(require("firebase-admin"));
const cors_1 = __importDefault(require("cors"));
const express_1 = __importDefault(require("express"));
const nodemailer = __importStar(require("nodemailer"));
const fetchExternal_1 = require("./fetchExternal");
// Firebase 초기화
admin.initializeApp();
const db = admin.firestore();
// CORS 핸들러 (Express용)
const corsHandler = (0, cors_1.default)({ origin: true });
const apiApp = (0, express_1.default)();
// 모든 요청에 CORS 적용
apiApp.use((0, cors_1.default)({ origin: true }));
apiApp.get('/KorPetTourService/:operation', async (req, res) => {
    try {
        const service = 'KorPetTourService';
        const operation = req.params.operation;
        const params = {};
        for (const [key, value] of Object.entries(req.query)) {
            if (typeof value === 'string')
                params[key] = value;
            else if (Array.isArray(value) && typeof value[0] === 'string')
                params[key] = value[0];
            else
                params[key] = '';
        }
        const items = await (0, fetchExternal_1.fetchTourAPI)(service, operation, params);
        res.json({ response: { body: { items: { item: items } } } });
    }
    catch (err) {
        console.error('KorPetTourService proxy error:', err);
        res.status(500).send('Internal Server Error');
    }
});
// Express 앱을 Firebase Function으로 내보내기
exports.api = (0, https_1.onRequest)(apiApp);
const gmailEmail = process.env.GMAIL_EMAIL || '';
const gmailPass = process.env.GMAIL_PASS || '';
// nodemailer transporter
const mailTransporter = nodemailer.createTransport({
    service: 'gmail',
    auth: { user: gmailEmail, pass: gmailPass },
});
// 이메일 인증 코드 발송 함수 (CORS 허용 및 Preflight 처리)
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
const regionConstants_1 = require("../constants/regionConstants");
regionConstants_1.REGION_CODES.forEach((region) => {
    const functionName = `refreshRegion_${region.code}`;
    exports[functionName] = (0, scheduler_1.onSchedule)('0 18 * * *', async () => {
        const page = 1;
        try {
            console.log(`▶️ [${functionName}] 시작 (지역 코드: ${region.code}, 페이지: ${page})`);
            const places = await (0, fetchExternal_1.fetchRegionPlacesFromAPI)(region.code, page);
            await db.doc(`regionPlaces/${region.code}_page_${page}`).set({
                places,
                updatedAt: admin.firestore.FieldValue.serverTimestamp(),
            });
            if (places.length > 0) {
                console.log(`✅ [${functionName}] 캐시 저장 완료 (${places.length}개)`);
            }
            else {
                console.warn(`⚠️ [${functionName}] 빈 결과지만 캐시 저장 완료`);
            }
        }
        catch (err) {
            console.error(`❌ [${functionName}] 오류 발생:`, err);
        }
    });
});
const themeKeys = ['nature', 'culture', 'adventure', 'shopping', 'food', 'accommodation'];
themeKeys.forEach((key) => {
    const functionName = `refreshTheme_${key}`;
    exports[functionName] = (0, scheduler_1.onSchedule)('0 18 * * *', async () => {
        const page = 1;
        try {
            console.log(`▶️ [${functionName}] 시작 (테마 키: ${key}, 페이지: ${page})`);
            const places = await (0, fetchExternal_1.fetchThemePlacesFromAPI)(key, page);
            if (places.length > 0) {
                await db.doc(`themePlaces/${key}_page_${page}`).set({
                    places,
                    updatedAt: admin.firestore.FieldValue.serverTimestamp(),
                });
                console.log(`✅ [${functionName}] 캐시 저장 완료 (${places.length}개)`);
            }
            else {
                console.warn(`⚠️ [${functionName}] 빈 결과, 캐시 생략`);
            }
        }
        catch (err) {
            console.error(`❌ [${functionName}] 오류 발생:`, err);
        }
    });
});
//# sourceMappingURL=index.js.map