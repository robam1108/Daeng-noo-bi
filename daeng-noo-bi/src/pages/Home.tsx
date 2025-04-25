import { useNavigate } from "react-router-dom"
import Map from "../api/Map"
import PetTravelList from "../components/PetTrevelList"

export default function Home() {
    const nav = useNavigate();
    return (
        <div>
            Home
            <PetTravelList/>
            <button onClick={() => nav(`/login`)}>login</button>
            <button>signup</button>
            <button>favorites</button>
            <button>popular</button>
            <button>region</button>
            <button>theme</button>
            <Map latitude={35.1587} longitude={129.1604} />
        </div>
    )
};