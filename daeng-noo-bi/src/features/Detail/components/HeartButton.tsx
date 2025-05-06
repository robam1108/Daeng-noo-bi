import { faHeart as farHeart } from "@fortawesome/free-regular-svg-icons";
import { faHeart as fasHeart } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useState } from "react";

interface HeartButtonProps {
    contentId: string;
    userFavorites: string[];
    onToggleFavorite: (id: string) => void;
}

const HeartButton = ({ contentId, userFavorites, onToggleFavorite }: HeartButtonProps) => {
    const isFavorite = userFavorites.includes(contentId);
    const [hover, setHover] = useState(false);

    const icon = isFavorite || hover ? fasHeart : farHeart;

    return (
        <button
            className="HeartButton"
            onClick={e => {
                e.preventDefault();
                e.stopPropagation();
                onToggleFavorite(contentId);
            }}
            onMouseEnter={() => setHover(true)}
            onMouseLeave={() => setHover(false)}
            aria-label={isFavorite ? "즐겨찾기 해제" : "즐겨찾기 추가"}
        >
            <FontAwesomeIcon icon={icon} />
        </button>
    )
}

export default HeartButton