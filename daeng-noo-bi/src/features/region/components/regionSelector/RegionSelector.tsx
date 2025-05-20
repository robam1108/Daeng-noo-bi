// RegionSelector.tsx
// import "swiper/swiper-bundle.css";
import { REGION_CODES } from "../../constants/regionConstants";
import "./RegionSelector.scss";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { IconProp } from "@fortawesome/fontawesome-svg-core";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";
import { faArrowLeft, faArrowRight } from "@fortawesome/free-solid-svg-icons";

interface RegionSelectorProps {
  selected: number;
  onChange: (code: number) => void;
}

const RegionSelector = ({ selected, onChange }: RegionSelectorProps) => {
  // console.log("🔸 RegionSelector 렌더링, selected =", selected);
  return (
    <div className="region-selector-wrapper">
      <div className="region-selector">
        <div className="swiper-button-prev custom-arrow">
          <FontAwesomeIcon icon={faArrowLeft as IconProp} />
        </div>
        <Swiper
          modules={[Navigation]}
          loop={true}
          slidesPerView={6}
          spaceBetween={20}
          navigation={{
            nextEl: ".swiper-button-next",
            prevEl: ".swiper-button-prev",
          }}
          grabCursor={true}
          breakpoints={{
            390: {
              slidesPerView: 5,
              spaceBetween: 10,
            },
            430: {
              slidesPerView: 5,
              spaceBetween: 10,
            },
            767: {
              slidesPerView: 8,
              spaceBetween: 20,
            },
            1024: {
              slidesPerView: 9,
              spaceBetween: 20,
            },
            1440: {
              slidesPerView: 12,
              spaceBetween: 30,
            },
          }}
        >
          {REGION_CODES.map((region) => (
            <SwiperSlide key={region.code}>
              <button
                className={`region-button ${region.className} ${
                  selected === region.code ? "active" : ""
                }`}
                onClick={() => onChange(region.code)}
                aria-label={region.name}
              >
                <div className="region-icon" />
                <span className="region-name">{region.name}</span>
              </button>
            </SwiperSlide>
          ))}
        </Swiper>
        <div className="swiper-button-next custom-arrow">
          <FontAwesomeIcon icon={faArrowRight as IconProp} />
        </div>
      </div>
    </div>
  );
};

export default RegionSelector;
