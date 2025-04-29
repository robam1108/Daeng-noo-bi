import { useEffect, useState } from 'react';
import { useTestAuth } from "../../../shared/context/TestAuthContext"
import { fetchDetailCommon } from '../../../shared/api/tourApi';
import FavoritesList, { PlaceDetail } from '../components/FavoritesList';

export default function Favorites() {
    const user = useTestAuth();
    // ① 상세 정보들을 담을 상태
    const [places, setPlaces] = useState<PlaceDetail[]>([]);
    // ② 로딩 상태 표시용
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        // ③ useEffect: user.favorites가 바뀔 때마다 실행
        async function loadFavorites() {
            // – 즐겨찾기 배열이 비어 있으면 바로 종료
            if (!user?.favorites?.length) return;
            setLoading(true);

            // ④ Promise.all로 여러 contentId를 병렬로 fetch
            const details = await Promise.all(
                user.favorites.map(async (contentId) => {
                    // – fetchDetailCommon: API 호출, 배열 또는 단일 객체 반환
                    const items = await fetchDetailCommon(contentId);
                    // – 배열이면 첫 번째 요소, 아니면 그대로
                    const item = Array.isArray(items) ? items[0] : items;
                    // – PlaceDetail 모양으로 변환
                    return {
                        contentid: contentId,
                        title: item.title,
                        firstimage: item.firstimage,
                        firstimage2: item.firstimage2,
                        addr1: item.addr1,
                    } as PlaceDetail;
                })
            );

            setPlaces(details);
            setLoading(false);
        }

        loadFavorites();
    }, [user]); // user 변경 시 재실행

    // ⑤ 렌더링 분기
    if (!user) {
        return <p>로그인이 필요합니다.</p>;
    }
    if (loading) {
        return <p>로딩 중…</p>;
    }
    if (places.length === 0) {
        return <p>즐겨찾기가 비어 있습니다.</p>;
    }

    // ⑥ 데이터가 준비되면 리스트에 전달
    return <FavoritesList places={places} />;
}