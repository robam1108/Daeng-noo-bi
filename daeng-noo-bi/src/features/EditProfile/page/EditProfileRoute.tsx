import { useNavigate } from "react-router-dom";
import { useAuth } from "../../../shared/context/AuthContext";
import RequirePassword from "../components/RequirePassword";
import EditProfile from "../components/EditProfile";
import EditProfileGoogle from "../components/EditProfileGoogle";
import "./EditProfileRoute.scss"

export default function EditProfileRoute() {
    const { user } = useAuth();
    const nav = useNavigate();

    const editProfileElement = <EditProfile password="" />;

    // 로그인 상태가 아니면 로그인 페이지로
    if (!user) {
        nav("/login", { replace: true });
        return null;
    }

    // providerData 중 google.com 이 있으면
    const isGoogle = user.providerData.some(
        (p) => p.providerId === "google.com"
    );

    if (isGoogle) {
        // 구글 로그인 유저는 비밀번호 확인 없이 구글 전용 폼
        return <EditProfileGoogle />;
    } else {
        // 이메일/비번 로그인 유저는 비밀번호 확인 후 일반 폼
        return (
            <RequirePassword>
                {editProfileElement}
            </RequirePassword>
        );
    }
}