import { useEffect, useState } from 'react';
import { useTestAuth } from '../../../shared/context/TestAuthContext';
import FavoritesList from '../components/FavoritesList';
import { fetchPlaceDetail, PlaceDetail } from '../api/petTourApi';
import './Favorites.scss';

export default function Favorites() {
    const user = useTestAuth();
    // 상세 정보들을 담을 상태
    const [places, setPlaces] = useState<PlaceDetail[]>([]);
    // 로딩 상태 표시용
    const [loading, setLoading] = useState(true);

    // user.favorites 배열이 변경될 때마다(최초 마운트 포함) 데이터 로드 실행
    useEffect(() => {
        // favorites가 비어 있거나 user 자체가 없으면 바로 로딩 끝내기
        if (!user || !user.favorites?.length) {
            setLoading(false);
            return;
        }

        const loadFavorites = async () => {
            setLoading(true);
            try {
                // Promise.all로 favorites 안의 모든 항목을 병렬 호출
                // 각 객체는 { contentid, contentTypeId } 형태
                const results = await Promise.all(
                    user.favorites!.map(contentId => fetchPlaceDetail(contentId))
                );
                setPlaces(results.filter((item): item is PlaceDetail => item !== null));
            } catch (err) {
                console.error('즐겨찾기 상세정보 로드 중 오류:', err);
            } finally {
                setLoading(false);
            }
        };

        loadFavorites();
    }, [user?.favorites]);

    if (!user) return <p>로그인이 필요합니다.</p>;
    if (loading) return <p className="loading">로딩 중…</p>;

    return (
        <div className="favorites-page">
            <h2>'{user.id}'님이 찜한 장소</h2>
            <FavoritesList places={places} />
        </div>
    );
}
