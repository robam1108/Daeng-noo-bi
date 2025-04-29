import { PlaceDetail } from './FavoritesList';  // FavoritesList에서 export한 타입을 import
import './FavoriteCard.scss';

interface Props {
    // 한 건의 장소 정보를 받음
    place: PlaceDetail;
}

const FavoriteCard: React.FC<Props> = ({ place }) => {
    // – 우선 firstimage, 없으면 firstimage2, 없으면 빈 문자열
    const imgSrc = place.firstimage || place.firstimage2 || '';

    return (
        <div className="favorite-card">
            {/* 이미지가 있을 때만 렌더링 */}
            {imgSrc && <img src={imgSrc} alt={place.title} />}
            <div className="favorite-card-content">
                {/* 제목과 주소 */}
                <h3>{place.title}</h3>
                <p>{place.addr1}</p>
            </div>
        </div>
    );
};

export default FavoriteCard;
