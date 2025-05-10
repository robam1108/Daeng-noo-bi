import { useAuth } from "../../../shared/context/AuthContext"
import PotoSelector from "../components/PotoSelector";
import ProfileForm from "../components/ProfileForm";
import PasswordChangeForm from "../components/PasswordChangeForm";
import "./EditProfile.scss"

export default function EditProfile() {
    const { user } = useAuth();

    return (
        <div className="EditProfile">
            <h1 className="title">회원 정보 수정</h1>
            <section className="poto-section">
                <PotoSelector />
            </section>
            <section className="email-section">
                <ProfileForm initialEmail={user.email!} />
            </section>
            <section className="password-section">
                <PasswordChangeForm />
            </section>
        </div>
    )
}