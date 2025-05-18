"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.fetchThemePlacesFromAPI = exports.fetchRegionPlacesFromAPI = exports.fetchPopularPlacesFromAPI = exports.PAGE_SIZE = exports.fetchTourAPI = void 0;
//  @ts-ignore: no type declarations for node-fetch
const node_fetch_1 = __importDefault(require("node-fetch"));
const fetcher_1 = require("../../src/shared/api/fetcher");
exports.fetchTourAPI = fetcher_1.fetchTourAPI;
const API_BASE = 'https://api.visitkorea.or.kr/openapi/service/rest/KorPetTourService';
const API_KEY = process.env.TOUR_API_KEY;
exports.PAGE_SIZE = 9;
// 인기별 페이지 캐시 갱신용
async function fetchPopularPlacesFromAPI(page = 1) {
    var _a, _b, _c, _d;
    const params = new URLSearchParams({
        ServiceKey: API_KEY,
        MobileOS: 'ETC',
        MobileApp: 'PetTourApp',
        _type: 'json',
        numOfRows: exports.PAGE_SIZE.toString(),
        pageNo: page.toString(),
        arrange: 'P',
        mapX: '127.5',
        mapY: '36.5',
        radius: '200000',
    });
    const res = await (0, node_fetch_1.default)(`${API_BASE}/locationBasedList?${params}`);
    const data = await res.json();
    const items = (_d = (_c = (_b = (_a = data.response) === null || _a === void 0 ? void 0 : _a.body) === null || _b === void 0 ? void 0 : _b.items) === null || _c === void 0 ? void 0 : _c.item) !== null && _d !== void 0 ? _d : [];
    return items.map(p => (Object.assign(Object.assign({}, p), { finalImage: p.firstimage || p.firstimage2 || '/images/no-image.png', addr1: p.addr1 || p.addr2 || '주소 정보 없음' })));
}
exports.fetchPopularPlacesFromAPI = fetchPopularPlacesFromAPI;
// 지역별 페이지 캐시 갱신용
async function fetchRegionPlacesFromAPI(areaCode, page = 1) {
    var _a, _b, _c, _d;
    const params = new URLSearchParams({
        ServiceKey: API_KEY,
        MobileOS: 'ETC',
        MobileApp: 'PetTourApp',
        _type: 'json',
        numOfRows: exports.PAGE_SIZE.toString(),
        pageNo: page.toString(),
        arrange: 'P',
        areaCode: areaCode.toString(),
    });
    const res = await (0, node_fetch_1.default)(`${API_BASE}/areaBasedList?${params}`);
    const data = await res.json();
    const items = (_d = (_c = (_b = (_a = data.response) === null || _a === void 0 ? void 0 : _a.body) === null || _b === void 0 ? void 0 : _b.items) === null || _c === void 0 ? void 0 : _c.item) !== null && _d !== void 0 ? _d : [];
    // 추가 이미지 및 주소 보완 로직은 필요 시 구현
    return items.map(p => (Object.assign(Object.assign({}, p), { finalImage: p.firstimage || p.firstimage2 || '/images/no-image.png', addr1: p.addr1 || p.addr2 || '주소 정보 없음' })));
}
exports.fetchRegionPlacesFromAPI = fetchRegionPlacesFromAPI;
// 테마별 페이지 캐시 갱신용
async function fetchThemePlacesFromAPI(themeKey, page = 1) {
    var _a, _b, _c, _d;
    const configs = {
        nature: { contentTypeId: '12', cat1Filter: 'A01' },
        culture: { contentTypeId: '14' },
        adventure: { contentTypeId: '28' },
        shopping: { contentTypeId: '38' },
        food: { contentTypeId: '39' },
        accommodation: { contentTypeId: '32' },
    };
    const cfg = configs[themeKey] || { contentTypeId: '12' };
    const params = new URLSearchParams({
        ServiceKey: API_KEY,
        MobileOS: 'ETC',
        MobileApp: 'PetTourApp',
        _type: 'json',
        numOfRows: exports.PAGE_SIZE.toString(),
        pageNo: page.toString(),
        arrange: 'P',
        contentTypeId: cfg.contentTypeId,
    });
    const res = await (0, node_fetch_1.default)(`${API_BASE}/searchKeyword?${params}`);
    const data = await res.json();
    const items = (_d = (_c = (_b = (_a = data.response) === null || _a === void 0 ? void 0 : _a.body) === null || _b === void 0 ? void 0 : _b.items) === null || _c === void 0 ? void 0 : _c.item) !== null && _d !== void 0 ? _d : [];
    return items.map(p => (Object.assign(Object.assign({}, p), { finalImage: p.firstimage || p.firstimage2 || '/images/no-image.png', addr1: p.addr1 || p.addr2 || '주소 정보 없음' })));
}
exports.fetchThemePlacesFromAPI = fetchThemePlacesFromAPI;
//# sourceMappingURL=fetchExternal.js.map