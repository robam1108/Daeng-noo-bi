import "./Home.scss";
import Banner from "../components/Banner/Banner";
import PopularspotList from "../components/PopularspotList";
import RegionspotList from "../components/RegionspotList";
import ThemespotList from "../components/ThemespotList";

export default function Home() {
  return (
    <div className="Home">
      <Banner />
      <section className="home-section section-popular">
        <div className="home-header">
          <h2 className="home-title">인기 여행지</h2>
          <h2 className="home-subtitle">반려인들의 발길이 머문 전국 여행지</h2>
        </div>
        <PopularspotList />
      </section>
      <section className="home-section section-region">
        <div className="home-header">
          <h2 className="home-title">지역별 여행지</h2>
          <h2 className="home-subtitle">전국 방방곡곡, 반려동물과 함께!</h2>
        </div>
        <RegionspotList />
      </section>
      <section className="home-section section-category">
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
