import { useState } from "react";
import { useNavigate } from "react-router-dom";
<<<<<<< HEAD:daeng-noo-bi/src/features/Home/components/RegionspotList/RegionspotList.tsx
import RegionSelector from "../../../region/components/regionSelector/RegionSelector";
=======
import RegionSelector from "../../features/region/components/regionSelector/RegionSelector";
>>>>>>> 99f628fec8d6c9708ac8ed5052f95373f2df60f5:daeng-noo-bi/src/components/RegionspotList/RegionspotList.tsx



const RegionspotList = () => {
    const nav = useNavigate();
    const [selectedRegion, setSelectedRegion] = useState<number>(1);

    const handleChange = (code: number) => {
        setSelectedRegion(code);
        nav("/region", { state: { initialRegion: code } });
    };

    return (
        <div>
            <RegionSelector selected={selectedRegion} onChange={handleChange} />
        </div>
    )
}

export default RegionspotList