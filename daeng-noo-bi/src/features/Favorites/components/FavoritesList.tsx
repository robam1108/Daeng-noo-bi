import { Link } from 'react-router-dom';
import { PlaceDetail } from '../../../shared/api/petTourApi';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrash } from '@fortawesome/free-solid-svg-icons';
import './FavoritesList.scss';

interface Props {
    places: PlaceDetail[];
    onDelete: (contentId: string) => void;
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
                                backgroundImage: place.finalImage
                                    ? `url(${place.finalImage})`
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
                            onDelete(place!.contentId!)
                        }}
                    >
                        <FontAwesomeIcon icon={faTrash} />
                    </button>
                </div>
            ))}
        </div>
    );
}
