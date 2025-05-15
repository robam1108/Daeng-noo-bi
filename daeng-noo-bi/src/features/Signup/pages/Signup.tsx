import React, { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getAuth, fetchSignInMethodsForEmail } from "firebase/auth";
import { useAuth } from "../../../shared/context/AuthContext";

import "./Signup.scss";

type FieldKey = "nickname" | "email" | "password" | "confirm";

// 커스텀 훅으로 ref 관리
function useFieldRefs<T extends Record<string, any>>() {
  const refs = useRef<Partial<Record<keyof T, HTMLInputElement | null>>>({});
  const setRef = (key: keyof T) => (el: HTMLInputElement | null) => {
    refs.current[key] = el;
  };
  return {
    refs: refs.current as Record<keyof T, HTMLInputElement | null>,
    setRef,
  };
}

const SignupPage: React.FC = () => {
  const navigate = useNavigate();
  const { sendVerificationCode, signup } = useAuth();
  const auth = getAuth();

  // 모든 input refs
  const { refs: fieldRefs, setRef } =
    useFieldRefs<Record<FieldKey, HTMLInputElement>>();

  // 입력 값 상태
  const [nickname, setNickname] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");

  // 인증 코드 상태
  const [verificationCode, setVerificationCode] = useState("");
  const [generatedCode, setGeneratedCode] = useState("");
  const [timeLeft, setTimeLeft] = useState(0);

  // 플래그 상태
  const [isMailSent, setIsMailSent] = useState(false);
  const [isVerified, setIsVerified] = useState(false);
  const [isExpired, setIsExpired] = useState(false);

  // 메시지 상태
  const [error, setError] = useState<string | null>(null);
  const [dupMsg, setDupMsg] = useState<string | null>(null);
  const [dupType, setDupType] = useState<"success" | "error" | null>(null);

  // 타이머 포맷 (MM:SS)
  const formatTime = (sec: number) =>
    `${String(Math.floor(sec / 60)).padStart(2, "0")}:
${String(sec % 60).padStart(2, "0")}`;

  // 이메일 인증 요청
  const handleEmailVerificationRequest = async () => {
    setError(null);
    setDupMsg(null);
    setIsExpired(false);

    if (!email.trim()) {
      fieldRefs.email?.focus();
      setDupMsg("이메일을 입력해주세요.");
      setDupType("error");
      return;
    }
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailPattern.test(email.trim())) {
      fieldRefs.email?.focus();
      setDupMsg("유효한 이메일을 입력해주세요.");
      setDupType("error");
      return;
    }
    try {
      // Auth로 이메일 중복 확인
      const methods = await fetchSignInMethodsForEmail(auth, email.trim());
      if (methods.length > 0) {
        fieldRefs.email?.focus();
        setDupMsg("이미 가입된 이메일입니다.");
        setDupType("error");
        return;
      }
    } catch (err: any) {
      console.error("❌ 이메일 중복 확인 오류:", err);
      setError("이메일 중복 확인 중 오류가 발생했습니다.");
      return;
    }

    const code = String(Math.floor(1000 + Math.random() * 9000));
    setGeneratedCode(code);
    try {
      await sendVerificationCode(email.trim(), code);
      setIsMailSent(true);
      setTimeLeft(300);
      setDupMsg("인증 코드를 발송했습니다.");
      setDupType("success");
    } catch {
      setError("인증 메일 발송 실패");
    }
  };

  // 타이머
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

  // 코드 확인
  const handleVerifyCode = () => {
    if (verificationCode === generatedCode) {
      setIsVerified(true);
      setError(null);
      setDupMsg("이메일 인증이 완료되었습니다.");
      setDupType("success");
    } else {
      setDupMsg("인증 코드가 일치하지 않습니다.");
      setDupType("error");
    }
  };

  // 폼 제출
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setDupMsg(null);
    setDupType(null);

    // 순서: 닉네임 → 이메일 빈칸 → 이메일 형식 → 인증 → 비밀번호 → 비밀번호 길이 → 재입력 → 일치
    if (!nickname.trim()) {
      fieldRefs.nickname?.focus();
      setError("닉네임을 입력해주세요.");
      return;
    }
    if (!email.trim()) {
      fieldRefs.email?.focus();
      setError("이메일을 입력해주세요.");
      return;
    }
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailPattern.test(email.trim())) {
      fieldRefs.email?.focus();
      setError("유효한 이메일을 입력해주세요.");
      return;
    }
    if (!isVerified) {
      fieldRefs.email?.focus();
      setError("이메일 인증이 필요합니다.");
      return;
    }
    if (!password.trim()) {
      fieldRefs.password?.focus();
      setError("비밀번호를 입력해주세요.");
      return;
    }
    if (password.length < 6) {
      fieldRefs.password?.focus();
      setError("비밀번호는 최소 6글자 이상이어야 합니다.");
      return;
    }
    if (!confirm.trim()) {
      fieldRefs.confirm?.focus();
      setError("비밀번호 재입력을 입력해주세요.");
      return;
    }
    if (password !== confirm) {
      fieldRefs.confirm?.focus();
      setError("비밀번호가 일치하지 않습니다.");
      return;
    }

    try {
      await signup(email.trim(), password, nickname.trim());
      alert("회원가입이 완료되었습니다. 로그인 페이지로 이동합니다.");
      navigate("/login");
    } catch (err: any) {
      console.error(err);
      const code = err.code || "";
      const msg = err.message || "";
      if (code === "auth/weak-password" || msg.includes("6 characters")) {
        fieldRefs.password?.focus();
        setError("비밀번호는 최소 6글자 이상이어야 합니다.");
      } else {
        setError(msg || "회원가입 중 오류가 발생했습니다.");
      }
    }
  };

  return (
    <section className="signup-page" role="signup" aria-labelledby="login-page">
      <form className="signup-form" onSubmit={handleSubmit} noValidate>
        <h1 className="signup-title">회원가입</h1>
        <p id="error-text" className="error-text" role="alert">
          {error ?? "\u00A0"}
        </p>

        {/* 닉네임 */}
        <input
          ref={setRef("nickname")}
          type="text"
          className="signup-input"
          placeholder="닉네임"
          required
          aria-describedby="error-text"
          aria-invalid={!!error}
          value={nickname}
          onChange={(e) => setNickname(e.target.value)}
        />

        {/* 이메일 + 인증 */}
        <div className="email-row">
          <div className="emailInputWrap">
            <input
              ref={setRef("email")}
              type="email"
              className="email-input"
              placeholder="이메일"
              required
              aria-describedby="error-text"
              aria-invalid={!!error}
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                setDupMsg(null);
                setDupType(null);
              }}
            />
            <button
              type="button"
              className="auth-btn"
              onClick={handleEmailVerificationRequest}
              disabled={isMailSent || isVerified}
            >
              {isExpired ? "인증코드 재발송" : "인증코드 발송"}
            </button>
          </div>
          <div className="verifyWrap">
            <div className="verify-group">
              <input
                type="text"
                className="verify-input"
                placeholder="인증코드를 입력해주세요."
                aria-describedby="dup-msg"
                value={verificationCode}
                onChange={(e) => setVerificationCode(e.target.value)}
                maxLength={4}
                disabled={!isMailSent || isVerified}
              />
              {isMailSent && !isVerified && (
                <span className="verify-timer">{formatTime(timeLeft)}</span>
              )}
            </div>
            <button
              type="button"
              className="verify-btn"
              onClick={handleVerifyCode}
              disabled={
                !isMailSent || isVerified || verificationCode.length < 4
              }
            >
              확인
            </button>
          </div>
        </div>
        <p id="dup-msg" className={`dup-msg ${dupType ?? ""}`}>
          {dupMsg ?? "\u00A0"}
        </p>

        {/* 비밀번호 */}
        <input
          ref={setRef("password")}
          type="password"
          className="signup-input"
          placeholder="비밀번호"
          required
          aria-describedby="error-text"
          aria-invalid={!!error}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <input
          ref={setRef("confirm")}
          type="password"
          className="signup-input"
          placeholder="비밀번호 재입력"
          required
          aria-describedby="error-text"
          aria-invalid={!!error}
          value={confirm}
          onChange={(e) => setConfirm(e.target.value)}
        />

        <button
          type="submit"
          className={`signup-btn ${!isVerified ? "disabled" : ""}`}
        >
          회원가입
        </button>
      </form>
    </section>
  );
};

export default SignupPage;
