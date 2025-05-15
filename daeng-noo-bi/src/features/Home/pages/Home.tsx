import "./Home.scss";
import { useRef, useEffect } from "react";
import Banner from "../components/Banner/Banner";
import PopularspotList from "../components/PopularspotList";
import RegionspotList from "../components/RegionspotList";
import ThemespotList from "../components/ThemespotList";

export default function Home() {
  const popularRef = useRef<HTMLElement>(null);

  useEffect(() => {
    popularRef.current?.focus();
  }, []);

  return (
    <div className="Home" id="home" role="home" aria-label="메인 홈페이지">
      <Banner />
      <section
        className="home-section section-popular"
        ref={popularRef}
        tabIndex={-1}
        aria-labelledby="popular-places"
      >
        <div className="home-header">
          <h2 className="home-title">인기 여행지</h2>
          <h2 className="home-subtitle">반려인들의 발길이 머문 전국 여행지</h2>
        </div>
        <PopularspotList />
      </section>
      <section
        className="home-section section-region"
        aria-labelledby="region-selector"
      >
        <div className="home-header">
          <h2 className="home-title">지역별 여행지</h2>
          <h2 className="home-subtitle">전국 방방곡곡, 반려동물과 함께!</h2>
        </div>
        <RegionspotList />
      </section>
      <section
        className="home-section section-category"
        aria-labelledby="theme-selector"
      >
        <div className="home-header">
          <h2 className="home-title">테마 여행지</h2>
          <h2 className="home-subtitle">
            오늘의 여행 기분은? 테마로 골라보세요
          </h2>
        </div>
        <ThemespotList />
      </section>
    </div>
  );
}
