import Map from "../placeDetail/Map"

export default function Home() {

    return (
        <div>
            <Map address="서울 송파구 잠실동 40-1" />
            {/* <RandomSpotBanner /> */}
            <div>
                <div>
                    <p>인기 여행지</p>
                    <p>반려동물과 함께하는 인기 여행지</p>
                </div>
                {/* <PopularspotList />  */}
            </div>
            <div>
                <div>
                    <p>지역별 여행지</p>
                    <p>이번엔 어디로 가볼까요?</p>
                </div>
                {/* <LegionList /> */}
            </div>
            <div>
                <div>
                    <p>키워드 여행지</p>
                    <p>키워드로 만나는 우리만의 여행</p>
                </div>
                {/* <categoryList /> */}
            </div>

        </div>
    )
};