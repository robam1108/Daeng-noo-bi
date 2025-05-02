import "./PopularCard.scss";
import React, { useEffect, useState, useRef } from "react";
import type { RawPlace } from "../api/popularAPI";

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
        <p>{place.addr1}</p>
      </div>
    </div>
  );
};

export default RegionCard;
