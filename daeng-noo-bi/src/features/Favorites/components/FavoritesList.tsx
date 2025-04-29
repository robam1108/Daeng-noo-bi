import FavoriteCard from './FavoriteCard';

// PlaceDetail 타입을 export: 부모(FavoritesPage) ↔ 자식(FavoriteCard) 간에 공유
export interface PlaceDetail {
    contentid: string;
    title?: string;
    firstimage?: string;
    firstimage2?: string;
    addr1?: string;
}

interface Props {
    // FavoritesPage에서 만든 PlaceDetail[] 배열을 받음
    places: PlaceDetail[];
}

const FavoritesList: React.FC<Props> = ({ places }) => (
    <div className="favorites-list">
        {places.map((place) => (
            // ① key로 contentid 사용
            <FavoriteCard key={place.contentid} place={place} />
        ))}
    </div>
);

export default FavoritesList;
