// src/feacures/Login/components/ForgotModal/ForgotModal.tsx
import React, { useState } from "react";
import { getAuth, sendPasswordResetEmail } from "firebase/auth";
import "./ForgotModal.scss";

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
    try {
      const auth = getAuth();
      await sendPasswordResetEmail(auth, email.trim());
      setMessage("재설정 안내 메일을 보냈습니다. 메일함을 확인해주세요.");
    } catch (err: any) {
      console.error(err);
      if (err.code === "auth/user-not-found") {
        setMessage("등록된 계정이 없습니다. 이메일을 확인해주세요.");
      } else {
        setMessage("메일 전송 중 오류가 발생했습니다.");
      }
    } finally {
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
