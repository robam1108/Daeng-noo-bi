import RegionCard from "./RegionCard";
import "./scss/RegionCardList.scss";

const RegionCardList = ({
  places,
  lastCardRef,
}: {
  places: any[];
  lastCardRef: (node: any) => void;
}) => {
  return (
    <div className="card-list">
      {places.map((place, index) => (
        <div
          key={place.contentid || index}
          ref={index === places.length - 1 ? lastCardRef : null}
        >
          <RegionCard place={place} />
        </div>
      ))}
    </div>
  );
};

export default RegionCardList;
