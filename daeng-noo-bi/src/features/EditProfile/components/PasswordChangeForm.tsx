import React, { useState, useEffect, useRef } from "react";
import { useAuth } from "../../../shared/context/AuthContext";

const PasswordChangeForm: React.FC = () => {
    const { updatePassword, reauthenticate } = useAuth();

    const [newPw, setNewPw] = useState("");
    const [confirmPw, setConfirmPw] = useState("");
    const [loading, setLoading] = useState(false);
    const lastPwRef = useRef<string>("");

    // 메시지 상태
    const [error, setError] = useState<string | null>(null);
    const [successMsg, setSuccessMsg] = useState<string | null>(null);

    // 버튼 보이기/감추기용 active 플래그
    const [showActive, setShowActive] = useState(false);
    const wrapperRef = useRef<HTMLDivElement>(null);


    const isLenOk = newPw.length >= 6;
    const isMatch = newPw !== "" && newPw === confirmPw;
    const isEnabled = isLenOk && isMatch && !loading;
    const isDifferent = newPw !== lastPwRef.current;

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
        if (!isDifferent && newPw) {
            setError("이전 비밀번호와 동일합니다.");
            return;
        }
        if (newPw && confirmPw && newPw === confirmPw) {
            setError(null);
            setSuccessMsg("새 비밀번호와 확인이 일치합니다.");
            return;
        }
        setError(null);
        setSuccessMsg(null);
    }, [newPw, confirmPw, isDifferent]);

    useEffect(() => {
        function handleClickOutside(e: MouseEvent) {
            if (
                wrapperRef.current &&
                !wrapperRef.current.contains(e.target as Node)
            ) {
                setShowActive(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    const handleChange = async () => {
        if (error) return;  // 검증 에러 있으면 중단
        setLoading(true);
        if (!isEnabled) return;
        setLoading(true);

        try {
            await reauthenticate(newPw);
            setError("새 비밀번호가 기존 비밀번호와 같습니다.");
            setNewPw("");
            setConfirmPw("");
            setShowActive(false);
            setLoading(false);
            return;
        } catch {
        }
        try {
            await updatePassword(newPw);
            setSuccessMsg("비밀번호가 성공적으로 변경되었습니다.");
            setNewPw("");
            setConfirmPw("");
        } catch (err: any) {
            console.error(err);
            setError(err.message || "비밀번호 변경 중 오류가 발생했습니다.");
            setSuccessMsg(null);
        } finally {
            setLoading(false);
            setShowActive(false);
        }
    };

    return (
        <form
            className="PasswordChangeForm"
            onSubmit={(e) => e.preventDefault()}
            noValidate
        >
            <input
                type="password"
                className="editProfile-input"
                placeholder="새 비밀번호"
                value={newPw}
                onChange={(e) => {
                    setNewPw(e.target.value);
                    setShowActive(true);
                }}
                onFocus={() => setShowActive(true)}
                disabled={loading}
            />

            <div className="verifyWrap" ref={wrapperRef}>
                <div className="verify-group">
                    <input
                        type="password"
                        className="verify-input"
                        placeholder="새 비밀번호 확인"
                        value={confirmPw}
                        onChange={(e) => {
                            setConfirmPw(e.target.value);
                            setShowActive(true);
                        }}
                        onFocus={() => setShowActive(true)}
                        disabled={loading}
                        aria-describedby="pw-msg"
                    />
                </div>
                <button
                    type="button"
                    className={`verify-btn ${isEnabled && showActive ? "active" : ""}`}
                    onClick={handleChange}
                    disabled={!(isEnabled && showActive)}
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
