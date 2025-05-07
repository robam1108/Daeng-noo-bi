import { Link } from 'react-router-dom';
import React, { useEffect, useState, useRef } from "react";
import type { RawPlace } from "../../../region/api/regionAPI";
import "./ThemeCard.scss";

// RawPlace에 finalImage, addr1을 추가한 타입
export interface Place extends RawPlace {
  finalImage: string;
  addr1: string;
}

const ThemeCard: React.FC<{ place: Place }> = ({ place }) => {
  const [isVisible, setIsVisible] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), 100);
    return () => clearTimeout(timer);
  }, [place]);

  return (
    <Link
      to={`/place/${place.contentid}`}
    >
      <div
        ref={cardRef}
        className={`theme-card ${isVisible ? "show" : ""}`}
        style={{
          backgroundImage: `url(${place.finalImage})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <div className="info">
          <h4>{place.title}</h4>
          <p>{place.addr1}</p>
        </div>
      </div>
    </Link>
  );
};

export default ThemeCard;
