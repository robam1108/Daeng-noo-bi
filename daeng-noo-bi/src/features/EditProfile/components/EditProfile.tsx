import { useNavigate } from "react-router-dom";
import { useAuth } from "../../../shared/context/AuthContext"
import InfoChangeForm from "./InfoChangeForm";
import EmailChangeForm from "./EmailChangeForm";
import PasswordChangeForm from "./PasswordChangeForm";

export default function EditProfile() {
    const { user } = useAuth();
    const nav = useNavigate();

    if (!user) {
        nav("/login");
        return null;
    }

    return (
        <div className="EditProfile">
            <h1 className="title">회원 정보 수정</h1>
            <section className="info-section">
                <InfoChangeForm />
            </section>
            <section className="email-section">
                <EmailChangeForm />
            </section>
            <section className="password-section">
                <PasswordChangeForm />
            </section>
        </div>
    )
}