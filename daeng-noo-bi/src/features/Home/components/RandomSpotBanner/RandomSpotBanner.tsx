import './RandomSpotBanner.scss';

// 반려동물 동반 가능한 관광지 간단 타입
interface PetPlace {
    contentid: string;
}

// 관광지 상세 정보 타입
interface PlaceDetail {
    title: string;
    overview: string;
    firstimage: string;
    firstimage2: string;
}

interface RandomSpotBannerProps {
    /** 지역 코드(기본값: 서울(1)) */
    areaCode?: string;
}

const RandomSpotBanner: React.FC<RandomSpotBannerProps> = ({ areaCode = '1' }) => {

    return (
        <section className="random-spot-banner"> {/* style={bannerStyle} */}
            <div className="overlay">
                {/* {!imageUrl ? (
                    <Loading />
                ) : (
                    <>
                        <h2 className="spot-name">{name}</h2>
                        <p className="spot-description">{description}</p>
                    </>
                )} */}
                <h2 className="spot-name">엄청난 장소</h2>
                <p className="spot-description">개쩌는 여행지를 누려보세요!</p>
            </div>
        </section>
    );
};

export default RandomSpotBanner;