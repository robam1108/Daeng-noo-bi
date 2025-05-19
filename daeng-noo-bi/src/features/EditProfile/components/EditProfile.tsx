import { useNavigate } from "react-router-dom";
import { useAuth } from "../../../shared/context/AuthContext";
import InfoChangeForm from "./InfoChangeForm";
import PasswordChangeForm from "./PasswordChangeForm";

interface EditProfileProps {
  password: string;
}

const EditProfile: React.FC<EditProfileProps> = ({ password }) => {
  const { user } = useAuth();
  const nav = useNavigate();

  if (!user) {
    nav("/login");
    return null;
  }

  return (
    <div className="EditProfile" aria-labelledby="title">
      <h1 className="title">회원 정보 수정</h1>
      <section className="info-section">
        <InfoChangeForm />
      </section>
      <section className="password-section">
        <PasswordChangeForm currentPw={password} />
      </section>
    </div>
  );
}

export default EditProfile;
