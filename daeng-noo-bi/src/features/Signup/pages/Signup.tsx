// src/pages/SignupPage.tsx

import React, { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { getAuth } from "firebase/auth";
import { collection, query, where, getDocs } from "firebase/firestore";
import { db } from "../../../firebase";
import { useAuth } from "../../../shared/context/AuthContext";

import "./Signup.scss";

const SignupPage: React.FC = () => {
  const navigate = useNavigate();
  const authClient = getAuth();
  const { signup, logout } = useAuth();

  // refs
  const nicknameRef = useRef<HTMLInputElement | null>(null);
  const emailRef = useRef<HTMLInputElement | null>(null);
  const passwordRef = useRef<HTMLInputElement | null>(null);
  const confirmRef = useRef<HTMLInputElement | null>(null);

  // state
  const [nickname, setNickname] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [error, setError] = useState<string | null>(null);

  const [emailChecked, setEmailChecked] = useState(false);
  const [emailAvailable, setEmailAvailable] = useState(false);
  const [dupMsg, setDupMsg] = useState("");

  const handleDuplicateCheck = async () => {
    setError(null);

    // 1) 빈 값 검사
    if (!email.trim()) {
      emailRef.current?.focus();
      setDupMsg("이메일을 입력해주세요.");
      setEmailChecked(false);
      setEmailAvailable(false);
      return;
    }

    // 2) 이메일 형식 검사
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailPattern.test(email.trim())) {
      emailRef.current?.focus();
      setDupMsg("유효한 이메일 주소를 입력해주세요.");
      setEmailChecked(false);
      setEmailAvailable(false);
      return;
    }

    // 3) Firestore에서 중복 조회
    try {
      const q = query(
        collection(db, "users"),
        where("email", "==", email.trim())
      );
      const snap = await getDocs(q);

      if (snap.empty) {
        setEmailAvailable(true);
        setDupMsg("사용 가능한 이메일입니다.");
      } else {
        setEmailAvailable(false);
        setDupMsg("중복된 이메일입니다. 다른 이메일을 사용해주세요.");
      }
      setEmailChecked(true);
    } catch (err) {
      console.error(err);
      setDupMsg("⚠️ 이메일 확인 중 오류가 발생했습니다.");
      setEmailChecked(false);
      setEmailAvailable(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    // 1) 검증 룰 목록
    type ValidationRule = {
      cond: boolean;
      ref: React.RefObject<HTMLInputElement | null>;
      msg: string;
    };

    const validations: ValidationRule[] = [
      {
        cond: !nickname.trim(),
        ref: nicknameRef,
        msg: "닉네임을 입력해주세요.",
      },
      { cond: !email, ref: emailRef, msg: "이메일을 입력해주세요." },
      { cond: !password, ref: passwordRef, msg: "비밀번호를 입력해주세요." },
      { cond: !confirm, ref: confirmRef, msg: "비밀번호 확인을 입력해주세요." },
      {
        cond: password.length < 6,
        ref: passwordRef,
        msg: "비밀번호는 최소 6자 이상이어야 합니다.",
      },
      {
        cond: password !== confirm,
        ref: confirmRef,
        msg: "비밀번호가 일치하지 않습니다.",
      },
      {
        cond: !emailChecked,
        ref: emailRef,
        msg: "이메일 중복확인이 필요합니다.",
      },
      {
        cond: !emailAvailable,
        ref: emailRef,
        msg: "사용 가능한 이메일을 입력해주세요.",
      },
    ];

    // 2) 순회하면서 첫 번째 실패 항목에 포커스 및 에러 설정
    for (const { cond, ref, msg } of validations) {
      if (cond) {
        ref.current?.focus();
        setError(msg);
        return;
      }
    }

    // 3) 실제 회원가입
    try {
      await signup(email, password, nickname);
      await logout();
      navigate("/login");
    } catch (err: any) {
      // 에러별 분기처리
      const code = err.code;
      if (code === "auth/weak-password") {
        passwordRef.current?.focus();
        setError("비밀번호는 최소 6자 이상이어야 합니다.");
      } else if (code === "auth/email-already-in-use") {
        emailRef.current?.focus();
        setError("이미 사용 중인 이메일입니다.");
      } else if (code === "auth/invalid-email") {
        emailRef.current?.focus();
        setError("유효한 이메일 주소를 입력해주세요.");
      } else {
        setError("회원가입 중 예상치 못한 오류가 발생했습니다.");
      }
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
          <input
            ref={emailRef}
            type="email"
            className="email-input"
            placeholder="이메일"
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
              setEmailChecked(false);
              setEmailAvailable(false);
              setDupMsg("");
            }}
          />
          <button
            type="button"
            className="duplicate-btn"
            onClick={handleDuplicateCheck}
          >
            중복확인
          </button>
        </div>
        <p
          className={`dup-msg ${emailAvailable ? "available" : "unavailable"}`}
        >
          {dupMsg}
        </p>

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

        <button type="submit" className="signup-btn">
          회원가입
        </button>
      </form>
    </div>
  );
};

export default SignupPage;
