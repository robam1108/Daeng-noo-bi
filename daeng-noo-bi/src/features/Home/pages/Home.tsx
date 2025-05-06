import "./Home.scss"
import Banner from "../components/Banner/Banner";
import PopularspotList from "../components/PopularspotList";
import RegionspotList from "../components/RegionspotList";
import ThemespotList from "../components/ThemespotList";

export default function Home() {


    return (
        <div className="Home">
            <Banner />
            <section className="home-section section-region">
                <div className="home-header">
                    <h2 className="home-title">지역별 여행지</h2>
                    <h2 className="home-subtitle">이번엔 어디로 가볼까요?</h2>
                </div>
                <RegionspotList />
            </section>
            <section className="home-section section-category">
                <div className="home-header">
                    <h2 className="home-title">테마 여행지</h2>
                    <h2 className="home-subtitle">힐링부터 모험까지 반려견과 함께</h2>
                </div>
                <ThemespotList />
            </section>
            <section className="home-section section-popular">
                <div className="home-header">
                    <h2 className="home-title">인기 여행지</h2>
                    <h2 className="home-subtitle">반려동물과 함께하는 인기 여행지</h2>
                </div>
                <PopularspotList />
            </section>
        </div>
    )
};