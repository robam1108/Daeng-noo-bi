import { useLocation, useParams, useNavigate } from "react-router-dom"
import { useEffect, useState } from "react"
import { fetchPlaceDetail, PlaceDetail } from "../../../shared/api/petTourApi"
import { useFavorites } from "../../../shared/hooks/useFavorites"
import Error from "../../../shared/components/Error/Error"
import Loading from "../../../shared/components/Loading/Loading"
import DetailView from "../components/DetailView"
import "./Detail.scss";



interface DetailState {
    place?: PlaceDetail
}


export default function Detail() {
    const nav = useNavigate();
    const location = useLocation();
    const { contentId } = useParams<{ contentId: string }>();
    const initialPlace = (location.state as DetailState)?.place;
    const [place, setPlace] = useState<PlaceDetail | null>(initialPlace ?? null);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<boolean>(false);

    // 즐겨찾기 훅: 상태 조회, 추가·삭제 함수
    const { user, isFavorite, toggleFavorite } = useFavorites();

    // 토글 핸들러
    const handleToggle = () => {
        if (!user) {
            // 로그인 유도
            const ok = window.confirm('로그인이 필요합니다.\n로그인 페이지로 이동하시겠습니까?');
            if (ok) {
                // 이동 후 돌아올 경로 보존
                nav('/login', { state: { from: location } });
            }
            return;
        }
        toggleFavorite(contentId!);
    };


    useEffect(() => {
        if (initialPlace) {
            setLoading(false);
            return;
        }

        if (!contentId) {
            console.log('유효한 constentId가 없습니다.');
            setError(true);
            setLoading(false);
            return;
        }

        const loadDetail = async () => {
            try {
                const detail = await fetchPlaceDetail(contentId);
                console.log('fetchPlaceDetail 실행');
                if (detail) {
                    setPlace(detail);
                } else {
                    console.log('해당 여행지 정보를 찾을 수 없습니다.'); 4
                    setError(true);
                }
            } catch (e: any) {
                console.error('fetchPlaceDetail 에러:', e);
                setError(true);
            } finally {
                setLoading(false);
            }
        };

        loadDetail();
    }, [initialPlace, contentId])

    if (loading) return <Loading />;
    if (error) return <Error />;

    console.log(place);

    return (
        <DetailView
            place={place!}
            isFavorited={isFavorite(contentId!)}
            onToggleFavorite={handleToggle}
        />
    )
}