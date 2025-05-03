import { useLocation, useParams } from "react-router-dom"
import { useEffect, useState } from "react"
import { useTestAuth } from "../../../shared/context/TestAuthContext"
import { fetchPlaceDetail, PlaceDetail } from "../../../shared/api/petTourApi"
import Map from "../../Detail/components/Map"
import Error from "../../../shared/components/Error/Error"
import Loading from "../../../shared/components/Loading/Loading"
import "./Detail.scss";

interface DetailState {
    place?: PlaceDetail
}

export default function Detail() {
    const user = useTestAuth();
    const location = useLocation();
    const { contentId } = useParams<{ contentId: string }>();

    const initialPlace = (location.state as DetailState)?.place;
    const [place, setPlace] = useState<PlaceDetail | null>(initialPlace ?? null);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<boolean>(false);

    console.log(initialPlace);
    console.log(contentId);


    useEffect(() => {
        if (initialPlace) {
            console.log('state로 넘어온 데이터가 있으므로 fetch 생략');
            return;
        }

        if (!contentId) {
            console.log('유효한 constentId가 없습니다.');
            setError(true);
            setLoading(false);
            return;
        }

        const loadDetail = async () => {
            try {
                const detail = await fetchPlaceDetail(contentId);
                console.log('fetchPlaceDetail 실행');
                if (detail) {
                    setPlace(detail);
                } else {
                    console.log('해당 여행지 정보를 찾을 수 없습니다.'); 4
                    setError(true);
                }
            } catch (e: any) {
                console.error('fetchPlaceDetail 에러:', e);
                setError(true);
            } finally {
                setLoading(false);
            }
        };

        loadDetail();
    }, [initialPlace, contentId])

    if (!user)
        return <p className="err-msg">로그인이 필요합니다.</p>;
    if (!user.favorites)
        return <p className="err-msg">즐겨찾기 정보가 없습니다.</p>;
    if (loading) return <Loading />;
    if (error) return <Error />;

    console.log(place);

    return (
        <div className="PlaceDetail">
            <div className="detail-img-section">
                {place!.firstimage ?
                    <img src={place!.firstimage} alt={`${place!.title}의 사진`} />
                    :
                    <img src={place!.firstimage2} alt={`${place!.title}의 사진`} />}
            </div>
            <div className="detail-info-section">
                <div className="info1">
                    <p>{place!.title}</p>
                    <p>{place!.addr1}</p>
                    <p>{place!.overview}</p>
                </div>
                <div className="info2">
                    <div className="tel">
                        <p className="label">전화번호 : </p>
                        {place!.tel ? <p className="value">{place!.tel}</p> : <p className="value">없음</p>}
                    </div>
                    <div className="homepage">
                        <p className="label">홈페이지 :</p>
                        {place!.homepage ?
                            <div className="value" dangerouslySetInnerHTML={{ __html: place!.homepage! }} />
                            : <p className="value">없음</p>}
                    </div>
                    <div className="btn-box">
                        <button>찜</button>
                        <button>공유</button>
                    </div>
                </div>
            </div>
            <Map address={place!.addr1 as string} />
        </div>
    )
}