// src/pages/KakaoCallback.tsx

import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { auth } from "../../../firebase";
import { signInWithCustomToken } from "firebase/auth";

const KakaoCallback: React.FC = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const code = new URLSearchParams(window.location.search).get("code");
    if (!code) {
      console.error("인가 코드가 없습니다.");
      return;
    }

    (async () => {
      try {
        // 4단계 Cloud Function 호출
        const res = await fetch(`/kakaoAuthRest?code=${code}`);
        if (!res.ok) throw new Error(await res.text());
        const { token } = await res.json();
        await signInWithCustomToken(auth, token);
        navigate("/");
      } catch (err) {
        console.error("카카오 로그인 실패:", err);
      }
    })();
  }, [navigate]);

  return <p>로그인 중입니다… 잠시만 기다려주세요.</p>;
};

export default KakaoCallback;
