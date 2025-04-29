import RegionCard from "./RegionCard";
import "./RegionCardList.scss";

const RegionCardList = ({ places }: { places: any[] }) => {
  return (
    <div className="card-list">
      {places.map((place, index) => (
        <div key={place.contentid || index}>
          <RegionCard place={place} />
        </div>
      ))}
    </div>
  );
};

export default RegionCardList;
