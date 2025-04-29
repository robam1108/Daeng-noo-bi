import { useEffect, useRef } from "react";
import { geocodeAddress, Coords } from "../../shared/api/NaverMapApi"

interface MapProps {
    address: string;
}

/**
 * NewMap 컴포넌트
 * 1) 주소 → geocode → 위도/경도 획득
 * 2) 해당 좌표로 네이버 지도 렌더링
 */
const Map: React.FC<MapProps> = ({ address }) => {
    const mapRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        async function initMap() {
            try {
                // 스크립트 로드 + Service 준비 + 주소 geocode
                const { latitude, longitude }: Coords = await geocodeAddress(address);

                // mapRef가 준비되면 지도와 마커 생성
                if (mapRef.current && window.naver?.maps) {
                    const map = new window.naver.maps.Map(mapRef.current, {
                        center: new window.naver.maps.LatLng(latitude, longitude),
                        zoom: 14,
                    });
                    new window.naver.maps.Marker({
                        position: new window.naver.maps.LatLng(latitude, longitude),
                        map,
                    });
                }
            } catch (err) {
                console.error("지도 초기화 중 오류:", err);
            }
        }

        initMap();
    }, [address]);

    return (
        <div
            ref={mapRef}
            style={{ width: "100%", height: "300px", marginTop: "1rem" }}
        />
    );
};

export default Map;
