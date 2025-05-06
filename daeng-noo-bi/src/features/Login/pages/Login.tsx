// src/pages/LoginPage.tsx

import React, { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../../shared/context/AuthContext";
import "./Login.scss";

const LoginPage: React.FC = () => {
  const nav = useNavigate();
  const { login } = useAuth();

  // 1) ref 선언
  const emailRef = useRef<HTMLInputElement | null>(null);
  const pwRef = useRef<HTMLInputElement | null>(null);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    // 2) 빈 값 검사
    if (!email.trim()) {
      emailRef.current?.focus();
      setError("이메일을 입력해주세요.");
      return;
    }
    if (!password) {
      pwRef.current?.focus();
      setError("비밀번호를 입력해주세요.");
      return;
    }

    // 3) 이메일 형식 검사
    const pattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!pattern.test(email.trim())) {
      emailRef.current?.focus();
      setError("유효한 이메일 주소를 입력해주세요.");
      return;
    }

    // 4) 실제 로그인
    try {
      const userCredential = await login(email.trim(), password);
      console.log("🎉 로그인 성공:", userCredential);
      nav("/");
    } catch (err: any) {
      console.error("Login Error ▶", err.code, err.message);
      if (
        err.code === "auth/invalid-credential" ||
        err.code === "auth/wrong-password"
      ) {
        pwRef.current?.focus();
        setError("이메일 또는 비밀번호가 올바르지 않습니다.");
      } else {
        setError("로그인 중 오류가 발생했습니다.");
      }
    }
  };

  const onClickSignup = () => {
    nav("/signup");
  };

  return (
    <div className="login-page">
      <form className="login-form" noValidate onSubmit={handleSubmit}>
        <h1 className="login-title">로그인</h1>

        <p className="error-text">{error ?? "\u00A0"}</p>

        <input
          ref={emailRef}
          type="email"
          autoComplete="email"
          className="login-input"
          placeholder="이메일"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          onInvalid={(e) => {
            e.preventDefault();
            emailRef.current?.focus();
            setError("유효한 이메일 주소를 입력해주세요.");
          }}
        />

        <input
          ref={pwRef}
          type="password"
          autoComplete="current-password"
          className="login-input"
          placeholder="비밀번호"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          onInvalid={(e) => {
            e.preventDefault();
            pwRef.current?.focus();
            setError("비밀번호를 입력해주세요.");
          }}
        />

        <button type="submit" className="btn login">
          로그인
        </button>

        <button type="button" className="btn signup" onClick={onClickSignup}>
          회원가입
        </button>
        <button type="submit" className="btn social">
          연동 로그인
        </button>
      </form>
    </div>
  );
};

export default LoginPage;
