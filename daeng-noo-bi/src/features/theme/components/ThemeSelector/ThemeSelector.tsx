import React from "react";
import { ThemeInfo, THEMES } from "../../constants/themeConstants";
import "./ThemeSelector.scss";

interface Props {
  selectedTheme: ThemeInfo["key"] | null;
  onSelect: (theme: ThemeInfo["key"]) => void;
}

export default function ThemeSelector({ selectedTheme, onSelect }: Props) {
  return (
    <section
      className="theme-selector-wrapper"
      aria-label="테마 여행지 선택 영역"
    >
      {THEMES.map(({ key, title, className }) => (
        <button
          key={key}
          className={`theme-selector-button ${className} ${
            selectedTheme === key ? "active" : ""
          }`}
          onClick={() => onSelect(key)}
          aria-label={title}
        >
          <div className="theme-title">{title}</div>
        </button>
      ))}
    </section>
  );
}
