import { useEffect, useRef } from 'react';

// 지도에 표시할 위치 정보를 props로 받음 (위도, 경도)
interface MapProps {
    latitude: number;
    longitude: number;
}

export default function Map({ latitude, longitude }: MapProps) {

    // 지도 DOM 요소에 접근하기 위한 ref (초기에는 null)
    const mapRef = useRef<HTMLDivElement>(null);

    // 컴포넌트가 마운트된 후 한 번만 실행됨
    useEffect(() => {

        // 1. 네이버 지도 API 스크립트를 동적으로 생성
        const script = document.createElement('script');
        script.src = `https://oapi.map.naver.com/openapi/v3/maps.js?ncpKeyId=${import.meta.env.VITE_NAVER_MAP_API_KEY}`;
        script.async = true;

        // 2. 스크립트가 로드된 이후에 지도를 초기화함
        script.onload = () => {
            // 전역 window 객체에 naver 네임스페이스가 존재하고, mapRef가 준비된 경우 실행
            if (window.naver && mapRef.current) {
                // 지도 객체 생성 (지도를 렌더링할 위치와 옵션 지정)
                const map = new window.naver.maps.Map(mapRef.current, {
                    center: new window.naver.maps.LatLng(latitude, longitude), // 지도 중심 좌표
                    zoom: 14, // 줌 레벨
                });

                // 해당 좌표에 마커 생성
                new window.naver.maps.Marker({
                    position: new window.naver.maps.LatLng(latitude, longitude),
                    map, // 이 마커가 올라갈 지도 객체 지정
                });
            }
        };

        // 3. 문서의 head에 script 태그를 추가하여 지도 API 로드 시작
        document.head.appendChild(script);
    }, [latitude, longitude]); // 위도/경도가 변경되면 지도도 업데이트됨

    // 지도가 표시될 div 영역 (ref를 통해 지도 API가 이 DOM을 조작함)
    // css 수정 필요
    return <div ref={mapRef} style={{ width: '100%', height: '300px', marginTop: '1rem' }} />;
}