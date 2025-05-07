/**
 * naverMapAPI.ts
 * 네이버 지도 API 스크립트 로드 & geocoding 유틸
 */

export interface Coords {
    latitude: number;
    longitude: number;
}

// 중복 로드 방지 플래그
let isScriptLoaded = false;

/**
 * 네이버 지도 API 스크립트를 동적으로 로드하고,
 * maps.Service가 준비될 때까지 대기합니다.
 */
export function loadNaverMapScript(): Promise<void> {
    return new Promise((resolve, reject) => {
        // 1) 이미 로드되어 있고 Service도 준비된 경우 즉시 resolve
        if (isScriptLoaded && window.naver?.maps?.Service) {
            resolve();
            return;
        }

        // 2) 스크립트 태그가 이미 존재할 경우 -> Service 준비만 대기
        const existing = document.querySelector('script[data-naver-maps]');
        if (existing) {
            const checkInterval = setInterval(() => {
                if (window.naver?.maps?.Service) {
                    clearInterval(checkInterval);
                    isScriptLoaded = true;
                    resolve();
                }
            }, 100);
            // 타임아웃 옵션(예: 5초)도 추가 가능
            return;
        }

        // 3) 새로 스크립트 태그 생성
        const script = document.createElement('script');
        script.async = true;
        script.setAttribute('data-naver-maps', 'true');

        // A) onload 핸들러 먼저 등록 (race condition 방지)
        script.onload = () => {
            // B) maps.Service가 실제 준비될 때까지 폴링
            const checkInterval = setInterval(() => {
                if (window.naver?.maps?.Service) {
                    clearInterval(checkInterval);
                    isScriptLoaded = true;
                    resolve();
                }
            }, 100);
        };
        script.onerror = () => {
            reject(new Error(`네이버 지도 API 로드 실패: ${script.src}`));
        };

        // C) 그 다음에 src 지정
        script.src =
            `https://oapi.map.naver.com/openapi/v3/maps.js?` +
            `ncpKeyId=${import.meta.env.VITE_NAVER_MAP_API_KEY}` +
            `&submodules=geocoder`;
        document.head.appendChild(script);
    });
}

/**
 * 주소 문자열을 naver.maps.Service.geocode로 변환
 * loadNaverMapScript를 통해 Service 준비를 보장
 */
export async function geocodeAddress(address: string): Promise<Coords> {
    // 1) 스크립트 + Service 준비
    await loadNaverMapScript();

    return new Promise((resolve, reject) => {
        if (!window.naver?.maps?.Service) {
            // 이 경우는 거의 발생하지 X
            reject(new Error('네이버 지도 Service가 준비되지 않음'));
            return;
        }

        // 2) 실제 geocode 호출
        window.naver.maps.Service.geocode(
            { query: address },
            (status, response) => {
                if (status !== window.naver.maps.Service.Status.OK) {
                    reject(new Error(`지오코딩 실패: status=${status}`));
                    return;
                }
                const item = response.v2.addresses[0];
                resolve({
                    latitude: parseFloat(item.y),
                    longitude: parseFloat(item.x),
                });
            }
        );
    });
}