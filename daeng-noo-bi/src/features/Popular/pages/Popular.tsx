// src/pages/Popular.tsx
import React, { useEffect, useState } from "react";
import PopularCardList from "../components/PopularCardList";
import BlogSection from "../components/BlogSection";
import { fetchTopFavoritedPlaces, Place } from "../api/popularAPI";
import { fetchBlogPosts } from "../../../shared/api/kakaoBlogAPI";
import "./Popular.scss";

interface BlogPost {
  title: string;
  url: string;
  blogname: string;
  datetime: string;
}

export default function Popular() {
  const [places, setPlaces] = useState<Place[]>([]);
  const [blogs, setBlogs] = useState<Record<string, BlogPost[]>>({});
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // 1) 인기 스팟만 먼저 불러오기
  useEffect(() => {
    const loadPlaces = async () => {
      setLoading(true);
      setError(null);
      try {
        const data = await fetchTopFavoritedPlaces();
        setPlaces(data);
      } catch (e) {
        console.error("fetchTopFavoritedPlaces 에러:", e);
        setError("여행지 조회 중 문제가 발생했습니다.");
      } finally {
        setLoading(false);
      }
    };
    loadPlaces();
  }, []);

  useEffect(() => {
    if (places.length === 0) return;

    (async () => {
      const map: Record<string, BlogPost[]> = {};
      await Promise.all(
        places.map(async (place) => {
          try {
            map[place.contentid] = await fetchBlogPosts(place.title, 1);
          } catch (e) {
            console.error(`블로그 검색 실패 (id=${place.contentid}):`, e);
            map[place.contentid] = [];
          }
        })
      );
      setBlogs(map);
    })();
  }, [places]);

  return (
    <div className="popular-page">
      <div className="popular-title">
        <h1>
          전국 반려동물 인기 스팟 <span className="pointColor">TOP 9</span>
        </h1>
        <p>가장 많은 찜을 받은, 반려인들이 인정한 인기 명소를 소개합니다!</p>
      </div>

      {loading && <p className="loading">로딩 중...</p>}
      {error && <div className="error">⚠️ {error}</div>}

      {!loading && !error && <PopularCardList places={places} />}

      <BlogSection places={places} blogs={blogs} />
    </div>
  );
}
