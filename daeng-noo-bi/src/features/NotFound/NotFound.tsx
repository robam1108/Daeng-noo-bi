import { useNavigate } from "react-router-dom"
import "./NotFound.scss"

export default function NotFound() {
    const nav = useNavigate();
    return (
        <div className="NotFound">
            <h1>잘못된 접근이에요!</h1>
            <button
                onClick={() => { nav('/') }}
            >메인으로 돌아가기</button>
        </div>
    )
}