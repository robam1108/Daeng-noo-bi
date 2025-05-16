// src/feacures/Login/components/ForgotModal/ForgotModal.tsx
import React, { useState } from "react";
import { sendPasswordResetEmail } from "firebase/auth";
import "./ForgotModal.scss";
import { auth } from "../../../firebase";

interface ForgotModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const ForgotModal: React.FC<ForgotModalProps> = ({ isOpen, onClose }) => {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleReset = async () => {
    setMessage(null);
    if (!email.trim()) {
      setMessage("이메일을 입력해주세요.");
      return;
    }

    setLoading(true);
    // const auth = getAuth();

    try {
      await sendPasswordResetEmail(auth, email.trim());
    } catch (err: any) {
      console.error("ForgotPassword Error ▶", err);
      setMessage("메일 전송 중 오류가 발생했습니다.");
    } finally {
      setMessage("이메일을 전송했습니다. 메일함을 확인해주세요.");
      setLoading(false);
    }
  };

  if (!isOpen) return null;
  return (
    <div className="forgot-modal-overlay" onClick={onClose}>
      <div className="forgot-modal" onClick={(e) => e.stopPropagation()}>
        <button className="close-btn" onClick={onClose}>
          ×
        </button>
        <h2>비밀번호 찾기</h2>
        <p>가입하신 이메일을 입력하시면 비밀번호 재설정 링크를 보내드립니다.</p>
        <input
          type="email"
          placeholder="이메일"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        {message && <p className="msg">{message}</p>}
        <button className="send-btn" onClick={handleReset} disabled={loading}>
          {loading ? "전송 중..." : "재설정 메일 보내기"}
        </button>
      </div>
    </div>
  );
};

export default ForgotModal;
