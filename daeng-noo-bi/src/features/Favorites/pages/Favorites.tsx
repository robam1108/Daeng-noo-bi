import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../../shared/context/AuthContext';
import FavoritesList from '../components/FavoritesList';
import { PlaceDetail } from '../../../shared/api/petTourApi';
import { getCachedPlaceDetail } from '../../../shared/api/cacheAPI';
import Error from '../../../shared/components/Error/Error';
import Loading from '../../../shared/components/Loading/Loading';
import './Favorites.scss';

export default function Favorites() {
    const { user, removeFavorite, initializing } = useAuth();
    const fromPath = location.pathname + location.search;
    const nav = useNavigate();
    const [places, setPlaces] = useState<PlaceDetail[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<boolean>(false);

    useEffect(() => {
        if (!user || !user.favorites?.length) {
            setLoading(false);
            return;
        }

        const loadFavorites = async () => {
            setLoading(true);
            try {
                const results = await Promise.all(
                    user.favorites!.map(contentId => getCachedPlaceDetail(contentId))
                );
                setPlaces(results.filter((item): item is PlaceDetail => item !== null));
            } catch (err) {
                console.error('즐겨찾기 상세정보 로드 중 오류:', err);
                setError(true);
            } finally {
                setLoading(false);
            }
        };

        loadFavorites();
    }, [user?.favorites]);

    const onDelete = async (contentId: string) => {
        await removeFavorite(contentId)
    };

    if (initializing) {
        return <Loading />;
    }
    if (!user) {
        // 이동 후 돌아올 경로 보존
        nav("/login", { state: { from: fromPath } });
        return;
    }
    if (loading) return <Loading />
    if (error) return <Error />

    if (user?.favorites?.length == 0) {
        return (
            <div className="Favorites empty">
                <div className='Favorites-header'>
                    <h2>'{user.nickname}'님이 찜한 장소</h2>
                </div>
                <p>찜한 장소가 없습니다</p>
            </div>
        )
    }

    return (
        <div className="Favorites">
            <div className='Favorites-header'>
                <h2>'{user.nickname}'님이 찜한 장소</h2>
            </div>
            <FavoritesList places={places} onDelete={onDelete} />
        </div>
    );
}
