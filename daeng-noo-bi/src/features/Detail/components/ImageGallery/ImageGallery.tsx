import { useState, useMemo } from "react";
import { useSwipeable } from 'react-swipeable';
import { PlaceImage } from "../../api/fetchImages";
import "./ImageGallery.scss"

interface Props {
    images: PlaceImage[] | null;
    title: string
    titleImgUrl: string;
}

const ImageGallery = ({ images, title, titleImgUrl }: Props) => {

    // images가 null인 경우 빈 배열로 처리
    const safeImages = useMemo(() => images ?? [], [images]);

    // 대표 이미지 + 추가 이미지 URL, 중복 제거
    const allImages = useMemo(() => {
        const urls = [
            titleImgUrl,
            ...safeImages.map(img => img.originimgurl || ''),
        ].filter(Boolean);
        return Array.from(new Set(urls));
    }, [titleImgUrl, safeImages]);

    const [currentIndex, setCurrentIndex] = useState(0);
    const total = allImages.length;

    // 다음/이전 슬라이드 함수
    const goNext = () => setCurrentIndex(i => (i + 1) % total);
    const goPrev = () => setCurrentIndex(i => (i - 1 + total) % total);
    const jumpTo = (idx: number) => setCurrentIndex(idx % total);

    // 스와이프 핸들러
    const handlers = useSwipeable({
        onSwipedLeft: () => goNext(),
        onSwipedRight: () => goPrev(),
        trackMouse: true,
        preventScrollOnSwipe: true,
    });

    // 이미지가 하나뿐일 때 (스와이퍼 비활성화)
    // 1152*500
    if (total === 1) {

        return (
            <div className="image-gallery image-gallery--single">
                <img
                    className={`${(allImages[0] === '/no-image.png') ? 'image-gallery__no-image' : 'image-gallery__single'}`}
                    src={allImages[0]}
                    alt={`${title} 사진`}
                    loading="lazy"
                />
            </div>
        );
    }

    // 보여줄 썸네일(타이틀 포함)이 1장 + images.length장
    const display = useMemo(
        () => allImages.slice(currentIndex).concat(allImages.slice(0, currentIndex)),
        [allImages, currentIndex]
    );


    return (
        <div className="image-gallery" {...handlers}>
            {/* 왼쪽 큰 이미지 */}
            {/* 762*500 */}
            <img
                className="image-gallery__big"
                alt={`${title} 사진(1)`}
                src={display[0]}
                loading="lazy"
            />

            {/* 오른쪽 썸네일들 */}
            {/* 382*119 */}
            <div className="image-gallery__thumbs">
                {display.slice(1).map((url, idx) => (
                    <div key={idx} className="image-gallery__thumb">
                        <img
                            src={url}
                            alt={`${title} 사진(${idx + 2})`}
                            loading="lazy"
                            onClick={() => jumpTo(currentIndex + idx + 1)}
                        />
                    </div>
                ))}
            </div>
        </div>
    );
}

export default ImageGallery