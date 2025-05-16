import React, { useState, useEffect, useRef } from "react";
import { useAuth } from "../../../shared/context/AuthContext";

const PasswordChangeForm: React.FC = () => {
    const { updatePassword, reauthenticate } = useAuth();

    const [newPw, setNewPw] = useState("");
    const [confirmPw, setConfirmPw] = useState("");
    const [loading, setLoading] = useState(false);

    // 메시지 상태
    const [error, setError] = useState<string | null>(null);
    const [successMsg, setSuccessMsg] = useState<string | null>(null);

    const btnRef = useRef<HTMLButtonElement>(null);

    // 실시간 검증
    useEffect(() => {
        if (!newPw && !confirmPw) {
            setError(null);
            return;
        }
        if (newPw && newPw.length < 6) {
            setError("비밀번호는 최소 6글자 이상이어야 합니다.");
            setSuccessMsg(null);
            return;
        }
        if (confirmPw && newPw !== confirmPw) {
            setError("새 비밀번호와 확인이 일치하지 않습니다.");
            setSuccessMsg(null);
            return;
        }
        if (newPw && confirmPw && newPw === confirmPw) {
            setError(null);
            setSuccessMsg("비밀번호가 일치합니다.");
            btnRef.current!.className = "verify-btn active";
            return;
        }
        setError(null);
        setSuccessMsg(null);
    }, [newPw, confirmPw]);

    const handleChange = async () => {
        if (error) return;  // 검증 에러 있으면 중단
        setLoading(true);

        try {
            await reauthenticate(newPw);
            setError("새 비밀번호가 기존 비밀번호와 같습니다.");
            btnRef.current!.className = "verify-btn";
            setNewPw("");
            setConfirmPw("");
            setLoading(false);
            return;
        } catch (reauthErr: any) {
            console.log(reauthErr);
        }
        try {
            await updatePassword(newPw);
            setSuccessMsg("비밀번호가 성공적으로 변경되었습니다.");
            if (btnRef.current) {
                btnRef.current.className = "verify-btn";
            }
            setNewPw("");
            setConfirmPw("");
        } catch (err: any) {
            console.error(err);
            setError(err.message || "비밀번호 변경 중 오류가 발생했습니다.");
            setSuccessMsg(null);
        } finally {
            setLoading(false);
        }
    };

    return (
        <form
            className="PasswordChangeForm"
            onSubmit={(e) => e.preventDefault()}
            noValidate
        >
            {/* 새 비밀번호 입력 */}
            <input
                type="password"
                className="editProfile-input"
                placeholder="새 비밀번호"
                value={newPw}
                onChange={(e) => setNewPw(e.target.value)}
                disabled={loading}
            />

            {/* 확인 입력 + 버튼 (이메일 verify 레이아웃과 동일) */}
            <div className="verifyWrap">
                <div className="verify-group">
                    <input
                        type="password"
                        className="verify-input"
                        placeholder="새 비밀번호 확인"
                        value={confirmPw}
                        onChange={(e) => setConfirmPw(e.target.value)}
                        disabled={loading}
                        aria-describedby="pw-msg"
                    />
                </div>
                <button
                    type="button"
                    ref={btnRef}
                    className="verify-btn"
                    onClick={handleChange}
                    disabled={
                        loading ||
                        !newPw ||
                        !confirmPw ||
                        !!error
                    }
                >
                    {loading ? "변경 중..." : "변경"}
                </button>
            </div>

            {/* 에러·성공 메시지 */}
            <p
                id="pw-msg"
                className={`pw-msg ${error ? "error" : successMsg ? "success" : ""}`}
            >
                {error ?? successMsg ?? "\u00A0"}
            </p>
        </form>
    );
};

export default PasswordChangeForm;
