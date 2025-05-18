"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.fetchThemePlacesFromAPI = exports.fetchRegionPlacesFromAPI = exports.fetchPopularPlacesFromAPI = exports.fetchTourAPI = exports.PAGE_SIZE = void 0;
//  @ts-ignore: no type declarations for node-fetch
const node_fetch_1 = __importDefault(require("node-fetch"));
// import * as functions from 'firebase-functions';
const API_BASE = 'https://api.visitkorea.or.kr/openapi/service/rest/KorPetTourService';
// const API_KEY = process.env.TOUR_API_KEY!;
exports.PAGE_SIZE = 9;
// API 키 설정
const KEYS = [
    process.env.TOUR_API_KEY1 || "",
    process.env.TOUR_API_KEY2 || "",
    process.env.TOUR_API_KEY3 || "",
].filter(k => k.length > 0);
if (KEYS.length === 0) {
    throw new Error("No API keys configured. Set TOUR_API_KEY1, TOUR_API_KEY2, TOUR_API_KEY3 in Functions environment.");
}
let currentKeyIndex = 0;
function getNextKey() {
    const key = KEYS[currentKeyIndex];
    currentKeyIndex = (currentKeyIndex + 1) % KEYS.length;
    return encodeURIComponent(key);
}
// API 호출용 유틸 함수
async function fetchTourAPI(operation, params) {
    var _a, _b, _c;
    let attempts = 0;
    while (attempts < KEYS.length) {
        const ServiceKey = getNextKey();
        const qs = new URLSearchParams(Object.assign({ ServiceKey, MobileOS: 'ETC', MobileApp: 'PetTourApp', _type: 'json' }, params)).toString();
        const url = `${API_BASE}/${operation}?${qs}`;
        try {
            const res = await (0, node_fetch_1.default)(url);
            const json = await res.json();
            const items = (_c = (_b = (_a = json.response) === null || _a === void 0 ? void 0 : _a.body) === null || _b === void 0 ? void 0 : _b.items) === null || _c === void 0 ? void 0 : _c.item;
            if (Array.isArray(items))
                return items;
            if (items)
                return [items];
            return [];
        }
        catch (e) {
            console.error(`[fetchTourAPI] ${operation} error:`, e);
            attempts++;
        }
    }
    return [];
}
exports.fetchTourAPI = fetchTourAPI;
// 인기별 페이지 캐시 갱신용
async function fetchPopularPlacesFromAPI(page = 1) {
    const raw = await fetchTourAPI('locationBasedList', {
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
    const raw = await fetchTourAPI('areaBasedList', {
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
    const calls = configs.flatMap(cfg => fetchTourAPI('areaBasedList', Object.assign(Object.assign({ numOfRows: exports.PAGE_SIZE.toString(), pageNo: page.toString(), arrange: 'P', contentTypeId: cfg.contentTypeId }, (cfg.cat1Filter && { cat1: cfg.cat1Filter })), { mapX: '127.5', mapY: '36.5', radius: '200000' })));
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