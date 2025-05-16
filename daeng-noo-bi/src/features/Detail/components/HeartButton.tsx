import { faHeart as farHeart } from "@fortawesome/free-regular-svg-icons";
import { faHeart as fasHeart } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useState } from "react";

interface HeartButtonProps {
  isActive: boolean; // 즐겨찾기 상태만 받음
  onClick: () => void; // 토글 핸들러
}

const HeartButton = ({ isActive, onClick }: HeartButtonProps) => {
  const [hover, setHover] = useState(false);
  const [focusVisible, setFocusVisible] = useState(false);

  const handleFocus = (e: React.FocusEvent<HTMLButtonElement>) => {
    if (e.currentTarget.matches(":focus-visible")) {
      setFocusVisible(true);
    }
  };
  const handleBlur = () => {
    setFocusVisible(false);
  };

  const icon = isActive || hover || focusVisible ? fasHeart : farHeart;

  return (
    <button
      className="HeartButton"
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
        onClick();
      }}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      onFocus={handleFocus}
      onBlur={handleBlur}
      aria-label={isActive ? "즐겨찾기 해제" : "즐겨찾기 추가"}
      aria-pressed={isActive}
    >
      <FontAwesomeIcon icon={icon} />
    </button>
  );
};

export default HeartButton;
