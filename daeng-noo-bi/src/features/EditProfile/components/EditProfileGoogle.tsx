import InfoChangeForm from "./InfoChangeForm"
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../../shared/context/AuthContext"

const EditProfileGoogle = () => {
    const { user } = useAuth();
    const nav = useNavigate();

    if (!user) {
        nav("/login");
        return null;
    }

    return (
        <div className="EditProfileGoogle">
            <h1 className="title">회원 정보 수정</h1>
            <section className="info-section">
                <InfoChangeForm />
            </section>
        </div>
    )
}

export default EditProfileGoogle