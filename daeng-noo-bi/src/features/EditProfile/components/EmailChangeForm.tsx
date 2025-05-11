import React, { useState, useRef, useEffect } from "react";
import { collection, query, where, getDocs } from "firebase/firestore";
import { db } from "../../../firebase";
import { useAuth } from "../../../shared/context/AuthContext";

interface EmailChangeFormProps {
    initialEmail: string;
}

const EmailChangeForm: React.FC<EmailChangeFormProps> = ({ initialEmail }) => {
    const { sendVerificationCode, updateEmail } = useAuth();

    // ref
    const emailRef = useRef<HTMLInputElement | null>(null);

    // 입력 및 인증 상태
    const [email, setEmail] = useState(initialEmail);
    const [verificationCode, setVerificationCode] = useState("");
    const [generatedCode, setGeneratedCode] = useState("");
    const [timeLeft, setTimeLeft] = useState(0);

    const [isMailSent, setIsMailSent] = useState(false);
    const [isVerified, setIsVerified] = useState(false);
    const [isExpired, setIsExpired] = useState(false);

    // 메시지 상태
    const [error, setError] = useState<string | null>(null);
    const [dupMsg, setDupMsg] = useState<string | null>(null);
    const [dupType, setDupType] = useState<"success" | "error" | null>(null);

    // 타이머 포맷 (MM:SS)
    const formatTime = (sec: number) =>
        `${String(Math.floor(sec / 60)).padStart(2, "0")}:${String(
            sec % 60
        ).padStart(2, "0")}`;

    // 1) 인증코드 발송
    const handleEmailVerificationRequest = async () => {
        setError(null);
        setDupMsg(null);
        setIsExpired(false);

        if (!email.trim()) {
            emailRef.current?.focus();
            setDupMsg("이메일을 입력해주세요.");
            setDupType("error");
            return;
        }
        const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailPattern.test(email.trim())) {
            emailRef.current?.focus();
            setDupMsg("유효한 이메일을 입력해주세요.");
            setDupType("error");
            return;
        }

        // 중복 검사
        try {
            const q = query(
                collection(db, "users"),
                where("email", "==", email.trim())
            );
            const snap = await getDocs(q);
            if (!snap.empty) {
                emailRef.current?.focus();
                setDupMsg("이미 사용 중인 이메일입니다.");
                setDupType("error");
                return;
            }
        } catch {
            setError("이메일 중복 확인 중 오류가 발생했습니다.");
            return;
        }

        // 인증코드 생성 & 발송
        const code = String(Math.floor(1000 + Math.random() * 9000));
        setGeneratedCode(code);
        try {
            await sendVerificationCode(email.trim(), code);
            setIsMailSent(true);
            setTimeLeft(300);
            setDupMsg("인증 코드를 발송했습니다.");
            setDupType("success");
        } catch {
            setError("인증 메일 발송에 실패했습니다.");
        }
    };

    // 2) 타이머
    useEffect(() => {
        if (!isMailSent || isVerified) return;
        const timer = setInterval(() => {
            setTimeLeft((prev) => {
                if (prev <= 1) {
                    clearInterval(timer);
                    setIsMailSent(false);
                    setIsExpired(true);
                    setDupMsg("인증 시간이 만료되었습니다. 다시 요청해주세요.");
                    setDupType("error");
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);
        return () => clearInterval(timer);
    }, [isMailSent, isVerified]);

    // 3) 코드 확인 & 즉시 업데이트
    const handleVerifyAndUpdate = async () => {
        setError(null);

        if (verificationCode !== generatedCode) {
            setDupMsg("인증 코드가 일치하지 않습니다.");
            setDupType("error");
            return;
        }

        // 인증 성공
        setIsVerified(true);
        setDupMsg("이메일 인증이 완료되었습니다. 이메일을 변경 중입니다...");
        setDupType("success");

        // 즉시 이메일 변경 호출
        try {
            await updateEmail(email.trim());
            setDupMsg("이메일이 성공적으로 변경되었습니다.");
            setDupType("success");
        } catch (err: any) {
            console.error(err);
            setError(err.message || "이메일 변경 중 오류가 발생했습니다.");
        }
    };

    return (
        <form className="email-change-form" onSubmit={(e) => e.preventDefault()} noValidate>
            {/* <label className="form-label">이메일 변경</label> */}

            {/* 이메일 입력 & 인증코드 발송 */}
            <div className="email-row">
                <div className="emailInputWrap">
                    <input
                        ref={emailRef}
                        type="email"
                        className="email-input"
                        placeholder="새 이메일 입력"
                        value={email}
                        onChange={(e) => {
                            setEmail(e.target.value);
                            setDupMsg(null);
                            setDupType(null);
                            setIsVerified(false);
                        }}
                        disabled={isMailSent && !isExpired}
                    />
                    <button
                        type="button"
                        className="auth-btn"
                        onClick={handleEmailVerificationRequest}
                        disabled={(isMailSent && !isExpired) || email === initialEmail}
                    >
                        {isExpired ? "인증코드 재발송" : "인증코드 발송"}
                    </button>
                </div>

                {/* 인증코드 입력 & 확인 */}
                <div className="verifyWrap">
                    <div className="verify-group">
                        <input
                            type="text"
                            className="verify-input"
                            placeholder="인증코드 입력"
                            value={verificationCode}
                            onChange={(e) => setVerificationCode(e.target.value)}
                            maxLength={4}
                            disabled={!isMailSent || isVerified}
                            aria-describedby="dup-msg"
                        />
                        {isMailSent && !isVerified && (
                            <span className="verify-timer">{formatTime(timeLeft)}</span>
                        )}
                    </div>
                    <button
                        type="button"
                        className="verify-btn"
                        onClick={handleVerifyAndUpdate}
                        disabled={!isMailSent || isVerified || verificationCode.length < 4}
                    >
                        확인
                    </button>
                </div>
            </div>

            {/* 중복 & 에러 메시지 */}
            <p id="dup-msg" className={`dup-msg ${dupType ?? ""}`}>
                {dupMsg ?? "\u00A0"}
            </p>
            {error && (
                <p className="error-text" role="alert">
                    {error}
                </p>
            )}
        </form>
    );
};

export default EmailChangeForm;
