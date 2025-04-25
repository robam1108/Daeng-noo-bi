import { useNavigate } from "react-router-dom"
import Footer from "../../components/Footer/Footer";

export default function Home() {
    const nav = useNavigate();
    var id = 1;
    return (
        <div>
            Home
            <button onClick={() => nav(`/login`)}>login</button>
            <button onClick={() => nav(`/signup`)}>signup</button>
            <button onClick={() => nav(`/favorites/${id}`)}>favorites</button>
            <button onClick={() => nav(`/popular`)}>popular</button>
            <button onClick={() => nav(`/region`)}>region</button>
            <button onClick={() => nav(`/theme`)}>theme</button>
            <Footer />
        </div>
    )
};