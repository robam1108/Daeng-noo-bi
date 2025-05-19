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
exports.fetchThemePlacesFromAPI = exports.fetchRegionPlacesFromAPI = exports.fetchPopularPlacesFromAPI = exports.fetchTourAPI = exports.PAGE_SIZE = void 0;
//  @ts-ignore: no type declarations for node-fetch
const node_fetch_1 = __importDefault(require("node-fetch"));
const functions = __importStar(require("firebase-functions"));
// const API_BASE = 'https://api.visitkorea.or.kr/openapi/service/rest/KorPetTourService';
// const API_KEY = process.env.TOUR_API_KEY!;
exports.PAGE_SIZE = 9;
// API 키 설정
const TOUR_API_KEYS = [
    functions.config().tourapi.key1,
    functions.config().tourapi.key2,
    functions.config().tourapi.key3,
];
let currentApiKeyIndex = 0;
function getNextApiKey() {
    const key = TOUR_API_KEYS[currentApiKeyIndex];
    currentApiKeyIndex = (currentApiKeyIndex + 1) % TOUR_API_KEYS.length;
    return key;
}
const BASE_URL = "https://apis.data.go.kr/B551011";
// API 호출용 유틸 함수
async function fetchTourAPI(service, operation, params) {
    var _a, _b, _c, _d;
    let attempts = 0;
    const maxAttempts = TOUR_API_KEYS.length;
    while (attempts < maxAttempts) {
        const ServiceKey = getNextApiKey();
        const qs = new URLSearchParams(Object.assign({ ServiceKey, MobileOS: "ETC", MobileApp: "PetTourApp", _type: "json" }, params)).toString();
        const url = `${BASE_URL}/${service}/${operation}?${qs}`;
        console.log("[fetchTourAPI] URL:", url);
        try {
            const res = await (0, node_fetch_1.default)(url);
            const ct = res.headers.get("Content-Type") || "";
            console.log("[fetchTourAPI] ◀️ HTTP", res.status, res.statusText);
            if (!ct.includes("application/json")) {
                const text = await res.text();
                console.warn("[fetchTourAPI] JSON 아닌 응답:", text);
                if (text.includes("LIMITED_NUMBER_OF_SERVICE_REQUESTS_EXCEEDS_ERROR")) {
                    attempts++;
                    console.warn("[fetchTourAPI] 한도 초과 – 다음 키로 재시도합니다.");
                    continue;
                }
                console.error("[fetchTourAPI] 예기치 못한 응답, 빈 배열 반환");
                return [];
            }
            const json = await res.json();
            console.log("[fetchTourAPI] ◀️ JSON 응답 전체:", JSON.stringify(json, null, 2));
            return (_d = (_c = (_b = (_a = json.response) === null || _a === void 0 ? void 0 : _a.body) === null || _b === void 0 ? void 0 : _b.items) === null || _c === void 0 ? void 0 : _c.item) !== null && _d !== void 0 ? _d : [];
        }
        catch (e) {
            console.error(`[fetchTourAPI] 네트워크 오류 (키=${ServiceKey}):`, e);
            attempts++;
            if (attempts < maxAttempts) {
                console.warn("[fetchTourAPI] 네트워크 오류 – 다음 키로 재시도합니다.");
            }
        }
    }
    console.error("[fetchTourAPI] 모든 키 소진 – 빈 배열 반환");
    return [];
}
exports.fetchTourAPI = fetchTourAPI;
// 인기별 페이지 캐시 갱신용
async function fetchPopularPlacesFromAPI(page = 1) {
    const raw = await fetchTourAPI('KorPetTourService', 'locationBasedList', {
        numOfRows: exports.PAGE_SIZE.toString(),
        pageNo: page.toString(),
        arrange: 'P',
        mapX: '127.5',
        mapY: '36.5',
        radius: '200000',
    });
    return raw.map(p => (Object.assign(Object.assign({}, p), { finalImage: p.firstimage || p.firstimage2 || '/images/no-image.png', addr1: p.addr1 || p.addr2 || '주소 정보 없음' })));
}
exports.fetchPopularPlacesFromAPI = fetchPopularPlacesFromAPI;
// 지역별 페이지 캐시 갱신용
async function fetchRegionPlacesFromAPI(areaCode, page = 1) {
    const raw = await fetchTourAPI('KorPetTourService', 'areaBasedList', {
        numOfRows: exports.PAGE_SIZE.toString(),
        pageNo: page.toString(),
        arrange: 'P',
        areaCode: areaCode.toString(),
    });
    return raw.map(p => (Object.assign(Object.assign({}, p), { finalImage: p.firstimage || p.firstimage2 || '/images/no-image.png', addr1: p.addr1 || p.addr2 || '주소 정보 없음' })));
}
exports.fetchRegionPlacesFromAPI = fetchRegionPlacesFromAPI;
// 테마별 페이지 캐시 갱신용
async function fetchThemePlacesFromAPI(themeKey, page = 1) {
    // 테마별 다중 config 설정
    const themeConfigMap = {
        nature: [{ contentTypeId: '12', cat1Filter: 'A01' }],
        culture: [{ contentTypeId: '12', cat1Filter: 'A02' }, { contentTypeId: '14' }],
        adventure: [{ contentTypeId: '12', cat1Filter: 'A03' }, { contentTypeId: '28' }],
        shopping: [{ contentTypeId: '12', cat1Filter: 'A04' }, { contentTypeId: '38' }],
        food: [{ contentTypeId: '12', cat1Filter: 'A05' }, { contentTypeId: '39' }],
        accommodation: [{ contentTypeId: '12', cat1Filter: 'B02' }, { contentTypeId: '32' }],
    };
    const configs = themeConfigMap[themeKey] || themeConfigMap['nature'];
    // 다중 요청 생성: 각 config마다, 같은 지역 전체를 대상으로 area-based 요청
    const calls = configs.flatMap(cfg => fetchTourAPI('KorPetTourService', 'areaBasedList', Object.assign(Object.assign({ numOfRows: exports.PAGE_SIZE.toString(), pageNo: page.toString(), arrange: 'P', contentTypeId: cfg.contentTypeId }, (cfg.cat1Filter && { cat1: cfg.cat1Filter })), { mapX: '127.5', mapY: '36.5', radius: '200000' })));
    const results = await Promise.all(calls);
    let items = results.flat();
    // contentTypeId 프로퍼티별 중복 제거
    const uniqueMap = new Map();
    items.forEach(p => uniqueMap.set(p.contentid, p));
    items = Array.from(uniqueMap.values());
    return items.map(p => (Object.assign(Object.assign({}, p), { finalImage: p.firstimage || p.firstimage2 || '/images/no-image.png', addr1: p.addr1 || p.addr2 || '주소 정보 없음' })));
}
exports.fetchThemePlacesFromAPI = fetchThemePlacesFromAPI;
//# sourceMappingURL=fetchExternal.js.map