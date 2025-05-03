import React from "react";
import type { Place } from "./ThemeCard";
import ThemeCard from "./ThemeCard";
import "./ThemeCardList.scss";

// Region과 동일하게 .card-list 클래스 사용
const ThemeCardList: React.FC<{ places: Place[] }> = ({ places }) => (
  <div className="card-list">
    {places.map((place, idx) => (
      <div key={place.contentid || idx}>
        <ThemeCard place={place} />
      </div>
    ))}
  </div>
);

export default ThemeCardList;
