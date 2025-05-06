import { useState } from "react";
import { useNavigate } from "react-router-dom";
import RegionSelector from "../../region/components/regionSelector/RegionSelector";



const RegionspotList = () => {
    const nav = useNavigate();
    const [selectedRegion, setSelectedRegion] = useState<number>(1);

    const handleChange = (code: number) => {
        setSelectedRegion(code);
        nav("/region", { state: { initialRegion: code } });
    };

    return (
        <div className="RegionspotList">
            <RegionSelector selected={selectedRegion} onChange={handleChange} />
        </div>
    )
}

export default RegionspotList