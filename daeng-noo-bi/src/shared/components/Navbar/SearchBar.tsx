// src/components/NavBar/SearchBar.tsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { IconProp } from "@fortawesome/fontawesome-svg-core";
import { faMagnifyingGlass } from "@fortawesome/free-solid-svg-icons";
import "./SearchBar.scss";

export default function SearchBar() {
  const [query, setQuery] = useState("");
  const navigate = useNavigate();

  // 검색 실행 함수
  const handleSearch = () => {
    const trimmed = query.trim();
    if (!trimmed) return;
    navigate(`/search?keyword=${encodeURIComponent(trimmed)}`);
  };

  // 엔터 키 처리
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  return (
    <div className="SearchBarWrapper">
      <input
        type="search"
        className="SearchBar"
        placeholder="장소 검색..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        onKeyDown={handleKeyDown}
        aria-label="장소 검색"
      />
      <button
        type="button"
        aria-label="장소 검색 버튼"
        className="SearchButton"
        onClick={handleSearch}
      >
        <FontAwesomeIcon icon={faMagnifyingGlass as IconProp} />
      </button>
    </div>
  );
}
