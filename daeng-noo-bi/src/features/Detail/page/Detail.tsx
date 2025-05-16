import { useLocation, useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { PlaceDetail } from "../../../shared/api/petTourApi";
import { DetailIntroResponse } from "../api/fetchDetailIntro";
import { PlaceImage } from "../api/fetchImages";
import { useFavorites } from "../../../shared/hooks/useFavorites";
import Error from "../../../shared/components/Error/Error";
import Loading from "../../../shared/components/Loading/Loading";
import DetailView from "../components/DetailView";
import "./Detail.scss";
import { doc, setDoc, increment } from "firebase/firestore";
import { db } from "../../../firebase";
import {
  getCachedPlaceDetail,
  getCachedPlaceImages,
  getCachedDetailIntro,
} from "../../../shared/api/cacheAPI";

interface DetailState {
  place?: PlaceDetail;
}

export default function Detail() {
  const nav = useNavigate();
  const location = useLocation();
  const { contentId } = useParams<{ contentId: string }>();
  const initialPlace = (location.state as DetailState)?.place;
  const [place, setPlace] = useState<PlaceDetail | null>(initialPlace ?? null);
  const [intro, setIntro] = useState<DetailIntroResponse | null>(null);
  const [imgs, setImgs] = useState<PlaceImage[] | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<boolean>(false);

  // 즐겨찾기 훅: 상태 조회, 추가·삭제 함수
  const { user, isFavorite, toggleFavorite } = useFavorites();

  // 토글 핸들러
  const handleToggle = async () => {
    if (!user) {
      // 로그인 유도
      const ok = window.confirm(
        "로그인이 필요합니다.\n로그인 페이지로 이동하시겠습니까?"
      );
      if (ok) {
        // 이동 후 돌아올 경로 보존
        nav("/login", { state: { from: location } });
      }
      return;
    }
    const currentlyFavorited = isFavorite(contentId!);

    try {
      // 1) 사용자 개인 즐겨찾기 토글
      await toggleFavorite(contentId!);

      // 2) 전역 favoriteCount 증감 (언제나 setDoc + merge:true)
      const placeRef = doc(db, "places", contentId!);
      const delta = currentlyFavorited ? -1 : 1;
      await setDoc(
        placeRef,
        {
          contentid: contentId!,
          title: place?.title ?? "",
          finalImage: place?.firstimage ?? place?.firstimage2 ?? "",
          addr1: place?.addr1 ?? "",
          favoriteCount: increment(delta),
        },
        { merge: true }
      );
    } catch (e) {
      console.error("찜 토글 중 에러:", e);
    }
  };

  useEffect(() => {
    const loadDetail = async () => {
      try {
        // 1) 상세 정보
        const detailPromise = getCachedPlaceDetail(contentId!);

        // 2) 이미지
        const imgsPromise = getCachedPlaceImages(contentId!);

        // detail이 필요한 intro 호출을 위해 먼저 받아오고,
        const detail = await detailPromise;
        setPlace(detail!);

        // 3) intro와 이미지 병렬 요청
        const introPromise = getCachedDetailIntro(
          contentId!,
          detail!.contentTypeId
        );
        const [imgs, intro] = await Promise.all([imgsPromise, introPromise]);

        setImgs(imgs!);
        setIntro(intro!);
      } catch (e: any) {
        console.error("loadDetail 에러:", e);
        setError(true);
      } finally {
        setLoading(false);
        // 데이터 로딩이 끝난 직후에 스크롤 초기화
        window.scrollTo(0, 0);
        document.body.scrollTop = 0; // Safari, older 웹킷
        document.documentElement.scrollTop = 0; // IE, 크롬 등
      }
    };

    loadDetail();
  }, [contentId]);

  useEffect(() => {
    if (!loading) {
      // 로딩이 끝났을 때만 실행
      window.scrollTo(0, 0);
      document.body.scrollTop = 0;
      document.documentElement.scrollTop = 0;
    }
  }, [loading]);

  if (error) return <Error />;
  if (loading) return <Loading />;

  return (
    <DetailView
      place={place!}
      intro={intro!}
      images={imgs!}
      isFavorited={isFavorite(contentId!)}
      onToggleFavorite={handleToggle}
    />
  );
}
