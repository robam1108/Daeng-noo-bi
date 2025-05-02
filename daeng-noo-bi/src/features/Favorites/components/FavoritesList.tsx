import { Link } from 'react-router-dom';
import { PlaceDetail } from '../api/petTourApi';
import './FavoritesList.scss';

interface Props {
    places: PlaceDetail[];
    onDelete?: (contentId: string) => void;
}

export default function FavoritesList({ places, onDelete }: Props) {
    return (
        <div className="favorites-grid">
            {places.map(place => (
                <div key={place.contentId} className="card-wrapper">
                    <Link
                        to={`/place/${place.contentId}`}
                        state={{ place }}
                        className="card-link"
                    >
                        <div
                            className="card"
                            style={{
                                backgroundImage: place.firstimage
                                    ? `url(${place.firstimage})`
                                    : undefined,
                            }}
                        >
                            <div className="info">
                                <h3>{place.title}</h3>
                                <p>{place.addr1}</p>
                            </div>
                        </div>
                    </Link>

                    <button
                        className="delete-button"
                        onClick={e => {
                            e.preventDefault();
                            e.stopPropagation();
                            if (onDelete) onDelete(place.contentId);
                        }}
                    >
                        삭제
                    </button>
                </div>
            ))}
        </div>
    );
}
