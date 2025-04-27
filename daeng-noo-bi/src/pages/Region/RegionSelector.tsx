import { REGION_CODES } from "./regionConstants";
import "./scss/RegionSelector.scss";

const RegionSelector = ({
  selected,
  onChange,
}: {
  selected: number;
  onChange: (code: number) => void;
}) => (
  <div className="region-selector">
    {REGION_CODES.map((region) => (
      <button
        key={region.code}
        className={`region-button ${region.className} ${
          selected === region.code ? "active" : ""
        }`}
        onClick={() => onChange(region.code)}
        aria-label={region.name}
      >
        <div className="region-icon" />
        <span className="region-name">{region.name}</span>
      </button>
    ))}
  </div>
);

export default RegionSelector;
