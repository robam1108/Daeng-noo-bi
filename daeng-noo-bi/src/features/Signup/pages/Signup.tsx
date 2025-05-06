import React, { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { collection, query, where, getDocs } from "firebase/firestore";
import { db } from "../../../firebase";
import { useAuth } from "../../../shared/context/AuthContext";

import "./Signup.scss";

const SignupPage: React.FC = () => {
  const navigate = useNavigate();
  const { sendVerificationCode, signup } = useAuth();

  // refs
  const nicknameRef = useRef<HTMLInputElement>(null);
  const emailRef = useRef<HTMLInputElement>(null);
  const passwordRef = useRef<HTMLInputElement>(null);
  const confirmRef = useRef<HTMLInputElement>(null);

  // state
  const [nickname, setNickname] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [verificationCode, setVerificationCode] = useState("");
  const [generatedCode, setGeneratedCode] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [dupMsg, setDupMsg] = useState<string | null>(null);
  const [isMailSent, setIsMailSent] = useState(false);
  const [timeLeft, setTimeLeft] = useState(0);
  const [isVerified, setIsVerified] = useState(false);
  const [isExpired, setIsExpired] = useState(false);

  const formatTime = (sec: number) =>
    `${Math.floor(sec / 60)
      .toString()
      .padStart(2, "0")}:
${(sec % 60).toString().padStart(2, "0")}`;

  // 1) 인증 코드 발송
  const handleEmailVerificationRequest = async () => {
    setError(null);
    setIsExpired(false);
    if (!email.trim()) {
      emailRef.current?.focus();
      setDupMsg("이메일을 입력해주세요.");
      return;
    }
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailPattern.test(email.trim())) {
      emailRef.current?.focus();
      setDupMsg("유효한 이메일을 입력해주세요.");
      return;
    }

    try {
      const q = query(
        collection(db, "users"),
        where("email", "==", email.trim())
      );
      const snap = await getDocs(q);
      if (!snap.empty) {
        setDupMsg("이미 가입된 이메일입니다.");
        return;
      }
    } catch (err) {
      console.error(err);
      setError("이메일 중복 확인 중 오류가 발생했습니다.");
      return;
    }

    const code = Math.floor(1000 + Math.random() * 9000).toString();
    setGeneratedCode(code);
    try {
      await sendVerificationCode(email.trim(), code);
      setIsMailSent(true);
      setTimeLeft(300);
      setDupMsg("인증 코드를 발송했습니다.");
    } catch (err) {
      console.error(err);
      setError("인증 메일 발송 실패");
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
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [isMailSent, isVerified]);

  // 3) 코드 검증
  const handleVerifyCode = () => {
    if (verificationCode === generatedCode) {
      setIsVerified(true);
      setError(null);
      setDupMsg("이메일 인증이 완료되었습니다.");
    } else {
      setDupMsg("인증 코드가 일치하지 않습니다.");
    }
  };

  // 회원가입 제출
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!nickname.trim()) {
      nicknameRef.current?.focus();
      setError("닉네임을 입력해주세요.");
      return;
    }
    if (!isVerified) {
      emailRef.current?.focus();
      setError("이메일 인증이 필요합니다.");
      return;
    }
    if (!password.trim()) {
      passwordRef.current?.focus();
      setError("비밀번호를 입력해주세요.");
      return;
    }
    if (password !== confirm) {
      confirmRef.current?.focus();
      setError("비밀번호가 일치하지 않습니다.");
      return;
    }

    try {
      await signup(email.trim(), password, nickname.trim());
      alert("회원가입이 완료되었습니다. 로그인 페이지로 이동합니다.");
      navigate("/login");
    } catch (err: any) {
      console.error(err);
      setError(err.message || "회원가입 중 오류가 발생했습니다.");
    }
  };

  return (
    <div className="signup-page">
      <form className="signup-form" onSubmit={handleSubmit}>
        <h1 className="signup-title">회원가입</h1>
        <p className="error-text">{error ?? "\u00A0"}</p>

        <input
          ref={nicknameRef}
          type="text"
          className="signup-input"
          placeholder="닉네임"
          value={nickname}
          onChange={(e) => setNickname(e.target.value)}
        />

        <div className="email-row">
          <div className="emailInputWrap">
            <input
              ref={emailRef}
              type="email"
              className="email-input"
              placeholder="이메일"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                setDupMsg("");
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
        <p className="dup-msg">{dupMsg}</p>

        <input
          ref={passwordRef}
          type="password"
          className="signup-input"
          placeholder="비밀번호"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <input
          ref={confirmRef}
          type="password"
          className="signup-input"
          placeholder="비밀번호 재입력"
          value={confirm}
          onChange={(e) => setConfirm(e.target.value)}
        />

        <button type="submit" className="signup-btn" disabled={!isVerified}>
          회원가입
        </button>
      </form>
    </div>
  );
};

export default SignupPage;
