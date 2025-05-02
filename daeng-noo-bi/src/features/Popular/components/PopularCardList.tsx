import "./PopularCardList.scss";
import React from "react";
import type { Place } from "./PopularCard";
import RegionCard from "./PopularCard";

// API 레이어에서 보완된 Place 타입을 사용
const RegionCardList: React.FC<{ places: Place[] }> = ({ places }) => {
  return (
    <div className="card-list">
      {places.map((place, idx) => (
        <div key={place.contentid || idx}>
          <RegionCard place={place} />
        </div>
      ))}
    </div>
  );
};

export default RegionCardList;
