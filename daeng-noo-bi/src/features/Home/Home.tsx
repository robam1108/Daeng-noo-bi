import "./Home.scss"
import { useState } from "react";
import RandomSpotBanner from "../../components/RandomSpotBanner/RandomSpotBanner"
import PopularspotList from "../../components/PopularspotList/PopularspotList";
import RegionspotList from "../../components/RegionspotList/RegionspotList";

export default function Home() {


    return (
        <div className="Home">
            <RandomSpotBanner />
            <section className="home-section home-section--popular">
                <div className="home-header">
                    <h2 className="home-title">인기 여행지</h2>
                    <p className="home-subtitle">반려동물과 함께하는 인기 여행지</p>
                </div>
                <PopularspotList />
            </section>
            <section className="home-section home-section--region">
                <div className="home-header">
                    <h2 className="home-title">지역별 여행지</h2>
                    <p className="home-subtitle">이번엔 어디로 가볼까요?</p>
                </div>
                <RegionspotList />
            </section>
            <section className="home-section home-section--category">
                <div className="home-header">
                    <h2 className="home-title">키워드 여행지</h2>
                    <p className="home-subtitle">키워드로 만나는 우리만의 여행</p>
                </div>
                <div className="home-content"></div>{/* 임시 */}
                {/* <CategoryList /> */}
            </section>

        </div>
    )
};