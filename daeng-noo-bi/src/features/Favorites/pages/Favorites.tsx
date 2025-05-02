import { useEffect, useState } from 'react';
import { useTestAuth } from "../../../shared/context/TestAuthContext"
import FavoritesList from '../components/FavoritesList';
import { fetchPlaceDetail, PlaceDetail } from '../api/petTourApi';

export default async function Favorites() {
    const user = useTestAuth();
    // ① 상세 정보들을 담을 상태
    const [places, setPlaces] = useState<PlaceDetail[]>([]);
    // ② 로딩 상태 표시용
    const [loading, setLoading] = useState(false);

    // 2) 병렬로 요약 정보만 가져오기
    const detalies: PlaceDetail[] = (
        await Promise.all(user.favorites!.map(id => fetchPlaceDetail(id)))
    ).filter((x): x is PlaceDetail => x !== null);

    console.log('가져온 요약 정보:', detalies);

    // ⑤ 렌더링 분기
    if (!user) {
        return <p>로그인이 필요합니다.</p>;
    }
    if (loading) {
        return <p>로딩 중…</p>;
    }
    // if (places.length === 0) {
    //     return <p>즐겨찾기가 비어 있습니다.</p>;
    // }

    // ⑥ 데이터가 준비되면 리스트에 전달
    return (
        <div>

        </div>
    )
}