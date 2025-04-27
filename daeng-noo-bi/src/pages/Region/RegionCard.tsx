import "./scss/RegionCard.scss";
import { useEffect, useState, useRef } from "react";

const RegionCard = ({ place }: { place: any }) => {
  const [isVisible, setIsVisible] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, 100);

    return () => clearTimeout(timer);
  }, []);

  return (
    <div
      ref={cardRef}
      className={`card ${isVisible ? "show" : ""}`}
      style={{
        backgroundImage: `url(${place.finalImage})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      <div className="info">
        <h4>{place.title}</h4>
        <p>{place.addr1 || "주소 정보 없음"}</p>
      </div>
    </div>
  );
};

export default RegionCard;
