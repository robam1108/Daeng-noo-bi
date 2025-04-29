import './RandomSpotBanner.scss';
import React, { useEffect, useState, CSSProperties, useMemo, useCallback } from 'react';
import { fetchPetFriendlyPlaces, fetchDetailCommon } from '../../api/tourApi';
import { compressImageFromUrl } from '../../utils/compressImageFromUrl';
import { throttle } from '../../utils/throttle';
import Loading from '../Loading/Loading';

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
    // const [name, setName] = useState<string>('');
    // const [description, setDescription] = useState<string>('');
    // const [imageUrl, setImageUrl] = useState<string>('');

    // // 스팟 데이터를 불러오는 함수
    // const loadRandomSpot = useCallback(async (): Promise<void> => {
    //     try {
    //         // 1. 리스트 조회
    //         const places: PetPlace[] = await fetchPetFriendlyPlaces(areaCode);
    //         if (places.length === 0) return;

    //         // 2. 랜덤 선택
    //         const random = places[Math.floor(Math.random() * places.length)];
    //         const details: PlaceDetail[] = await fetchDetailCommon(random.contentid);
    //         const detail = details[0];

    //         // 3. 이미지 압축 처리
    //         const rawImg = detail.firstimage2 || detail.firstimage;
    //         const compressed = rawImg ? await compressImageFromUrl(rawImg) : '';

    //         // 4. 상태 업데이트
    //         setName(detail.title);
    //         setDescription(detail.overview);
    //         setImageUrl(compressed);
    //     } catch (e) {
    //         console.error('스팟 로드 오류:', e);
    //     }
    // }, [areaCode]);

    // // throttle 적용 (10초 제한)
    // const throttledLoad = useMemo(() => throttle(loadRandomSpot, 10000), [loadRandomSpot]);

    // // 마운트 또는 지역 변경 시 호출
    // useEffect(() => {
    //     throttledLoad();
    // }, [throttledLoad]);

    // // 배경 이미지 스타일
    // const bannerStyle: CSSProperties = imageUrl
    //     ? { backgroundImage: `url(${imageUrl})` }
    //     : {};

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