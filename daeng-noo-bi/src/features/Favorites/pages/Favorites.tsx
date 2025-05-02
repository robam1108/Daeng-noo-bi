import { useEffect, useState } from 'react';
import { useTestAuth } from "../../../shared/context/TestAuthContext"
import FavoritesList from '../components/FavoritesList';
import { fetchPlaceDetail, PlaceDetail } from '../api/petTourApi';

export default function Favorites() {
    const user = useTestAuth();
    // 상세 정보들을 담을 상태
    const [places, setPlaces] = useState<PlaceDetail[]>([]);
    // 로딩 상태 표시용
    const [loading, setLoading] = useState(true);

    console.log(user.favorites);

    // user.favorites 배열이 변경될 때마다(최초 마운트 포함) 데이터 로드 실행
    useEffect(() => {
        // favorites가 비어 있거나 user 자체가 없으면 바로 로딩 끝내기
        if (!user || !user.favorites?.length) {
            setLoading(false);
            return;
        }

        // 실제 데이터를 가져올 비동기 함수 정의
        const loadFavorites = async () => {
            setLoading(true);  // 데이터 로딩 시작

            try {
                // Promise.all로 favorites 안의 모든 항목을 병렬 호출
                // 각 객체는 { contentid, contentTypeId } 형태
                const results = await Promise.all(
                    user.favorites!.map((contentId) =>
                        // id와 type을 함께 넘겨서 detail 조회
                        fetchPlaceDetail(contentId)
                    )
                );

                // null이 아닌 것만 걸러서 places state에 세팅
                setPlaces(
                    results.filter(
                        (item): item is PlaceDetail => item !== null
                    )
                );
            } catch (err) {
                console.error('즐겨찾기 상세정보 로드 중 오류:', err);
            } finally {
                setLoading(false); // 로딩 완료
            }
        };

        loadFavorites();
    }, [user?.favorites]); // user.favorites 배열이 바뀔 때만 다시 실행

    console.log('가져온 요약 정보:', places);

    // 렌더링 분기
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