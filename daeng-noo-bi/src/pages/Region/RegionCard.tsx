import "./scss/RegionCard.scss";
import { useEffect, useState, useRef } from "react";
import { compressImageFromUrl } from "../../utils/compressImageFromUrl";

const RegionCard = ({ place }: { place: any }) => {
  const [imageUrl, setImageUrl] = useState(place.finalImage);
  const cardRef = useRef<HTMLDivElement>(null);
  const [isCompressing, setIsCompressing] = useState(true);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const compressAndSetImage = async () => {
      try {
        const compressedUrl = await compressImageFromUrl(place.finalImage);
        setImageUrl(compressedUrl);
      } catch (error) {
        console.error("이미지 압축 실패:", error);
      } finally {
        setIsCompressing(false); // ✅ 압축 끝나면 blur 해제
      }
    };

    if (place.finalImage) {
      compressAndSetImage();
    }
  }, [place.finalImage]);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(true); // ✅ 부드럽게 등장시킴
    }, 100);

    return () => clearTimeout(timer);
  }, []);

  return (
    <div
      ref={cardRef}
      className={`card ${isVisible ? "show" : ""}`}
      style={{
        backgroundImage: `url(${imageUrl})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        filter: isCompressing ? "blur(10px)" : "none",
      }}
    >
      <div className="info">
        <h4>{place.title}</h4>
        <p>{place.addr1 || "주소 정보 없음"}</p>
      </div>
    </div>
  );
};

export default RegionCard;
