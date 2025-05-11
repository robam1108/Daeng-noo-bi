import { useAuth } from "../../../shared/context/AuthContext"
import InfoChangeForm from "../components/InfoChangeForm";
import EmailChangeForm from "../components/EmailChangeForm";
import PasswordChangeForm from "../components/PasswordChangeForm";
import "./EditProfile.scss"

export default function EditProfile() {
    const { user } = useAuth();

    return (
        <div className="EditProfile">
            <h1 className="title">회원 정보 수정</h1>
            <section className="info-section">
                <InfoChangeForm initialNicName={user!.nickname!} />
            </section>
            <section className="email-section">
                <EmailChangeForm initialEmail={user!.email!} />
            </section>
            <section className="password-section">
                <PasswordChangeForm />
            </section>
        </div>
    )
}