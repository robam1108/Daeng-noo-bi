import { PlaceDetail } from '../../../shared/api/petTourApi';
import HeartButton from '../components/HeartButton';
import Map from '../components/Map';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faLink } from "@fortawesome/free-solid-svg-icons"

interface Props {
    place: PlaceDetail;
    isFavorited: boolean;
    onToggleFavorite: () => void;
}

export default function DetailView({ place, isFavorited, onToggleFavorite }: Props) {
    return (
        <div className="PlaceDetail">
            <div className="detail-img-section">
                <img src={place.finalImage} alt={place.title} />
            </div>
            <div className="detail-info-section">
                <div className="info1">
                    <p>{place!.title}</p>
                    <p>{place!.addr1}</p>
                    <p>{place!.overview}</p>
                </div>
                <div className="info2">
                    <div className="tel">
                        <p className="label">전화번호 : </p>
                        {place!.tel ? <p className="value">{place!.tel}</p> : <p className="value">없음</p>}
                    </div>
                    <div className="homepage">
                        <p className="label">홈페이지 :</p>
                        {place!.homepage ?
                            <div className="value" dangerouslySetInnerHTML={{ __html: place!.homepage! }} />
                            : <p className="value">없음</p>}
                    </div>
                    <div className="btn-box">
                        <HeartButton
                            isActive={isFavorited}
                            onClick={onToggleFavorite}
                        />
                        <button className="share-button"><FontAwesomeIcon icon={faLink} /></button>
                    </div>
                </div>
            </div>
            <Map address={place.addr1!} />
        </div>
    );
}
