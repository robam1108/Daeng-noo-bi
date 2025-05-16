import { PlaceDetail } from "../../../shared/api/petTourApi";
import { PlaceImage } from "../api/fetchImages";
import { DetailIntroResponse } from "../api/fetchDetailIntro";
import ActionButtons from "./ActionButtons/ActionButtons";
import Map from "../components/Map";
import IntroSection from "./IntroSection";
import ImageGallery from "./ImageGallery/ImageGallery";

interface Props {
    place: PlaceDetail;
    images: PlaceImage[];
    intro: DetailIntroResponse;
    isFavorited: boolean;
    onToggleFavorite: () => void;
}

const DetailView = ({
    place,
    images,
    intro,
    isFavorited,
    onToggleFavorite,
}: Props) => {
    return (
        <div className="PlaceDetail" role="PlaceDetail" aria-label="상세 페이지">
            <div className="detail-img-section">
                <ImageGallery
                    images={images}
                    title={place!.title!}
                    titleImgUrl={place!.finalImage!}
                />
            </div>
            <div className="detail-info-section">
                <div className="info1">
                    <p>{place!.title}</p>
                    <p>{place!.addr1}</p>
                    <p>{place!.overview}</p>
                </div>
                <div className="info2">
                    <IntroSection
                        intro={intro}
                        tel={place!.tel!}
                        homepage={place!.homepage!}
                    />
                    <div className="btn-box">
                        <ActionButtons
                            isActive={isFavorited}
                            onToggleFavorite={onToggleFavorite}
                        />
                    </div>
                </div>
            </div>
            <Map address={place.addr1!} />
        </div>
    );
};
export default DetailView;
