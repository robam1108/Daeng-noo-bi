import "./PopularCard.scss";
import React, { useEffect, useState, useRef } from "react";
import type { RawPlace } from "../api/popularAPI";
import { Link } from "react-router-dom";

// RawPlace에 finalImage, addr1을 추가한 타입
export interface Place extends RawPlace {
  finalImage: string;
  addr1: string;
}

const RegionCard: React.FC<{ place: Place }> = ({ place }) => {
  const [isVisible, setIsVisible] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), 100);
    return () => clearTimeout(timer);
  }, [place]);

  return (
    <Link to={`/place/${place.contentid}`}>
      <div
        ref={cardRef}
        className={`card ${isVisible ? "show" : ""}`}
        style={{
          backgroundImage: `url(${place.finalImage})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
        aria-labelledby="place"
      >
        <div className="info">
          <h2>{place.title}</h2>
          <p>{place.addr1}</p>
        </div>
      </div>
    </Link>
  );
};

export default RegionCard;
