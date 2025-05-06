import PopularCardList from "../../Popular/components/PopularCardList";
import { fetchPopularPlaces, Place } from "../../Popular/api/popularAPI";
import { useEffect, useState } from "react";
import Loading from "../../../shared/components/Loading/Loading";
import Error from "../../../shared/components/Error/Error";

const PopularspotList = () => {
    const [places, setPlaces] = useState<Place[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const load = async () => {
            setLoading(true);
            setError(null);
            try {
                const data = await fetchPopularPlaces(1);
                setPlaces(data);
            } catch (err) {
                console.error(err);
                setError("인기 여행지 조회 중 문제가 발생했습니다.");
            } finally {
                setLoading(false);
            }
        };
        load();
    }, []);

    return (
        <div>
            {loading && <Loading />}
            {error && <Error />}

            {!loading && !error && <PopularCardList places={places} />}
        </div>
    )
}

export default PopularspotList