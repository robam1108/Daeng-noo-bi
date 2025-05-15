// src/components/ProfileEdit/RequirePassword.tsx
import React, { useState, FormEvent } from 'react';
import { getAuth, reauthenticateWithCredential, EmailAuthProvider } from 'firebase/auth';
import { useAuth } from "../../../shared/context/AuthContext"

interface RequirePasswordProps {
  children: React.ReactNode;
}

const RequirePassword: React.FC<RequirePasswordProps> = ({ children }) => {
  const { user } = useAuth();
  const [password, setPassword] = useState('');
  const [verified, setVerified] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!user?.email) {
      setError('유저 정보를 불러올 수 없습니다.');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const auth = getAuth();
      const credential = EmailAuthProvider.credential(user.email, password);
      await reauthenticateWithCredential(auth.currentUser!, credential);
      setVerified(true);
    } catch (err: any) {
      console.error(err);
      setError('비밀번호가 올바르지 않습니다. 다시 시도해주세요.');
    } finally {
      setLoading(false);
    }
  };

  // 재인증 전에는 폼만 보여준다
  if (!verified) {
    return (
      <div className="RequirePassword">
        <h2 className='title'>비밀번호를 입력하세요</h2>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <input
              id="current-password"
              className="editProfile-input"
              type="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              required
            />
          </div>
          {error && <p className="error dup-msg">{error}</p>}
          <button type="submit" className='requirePassword-btn' disabled={loading}>
            {loading ? '확인 중...' : '확인'}
          </button>
        </form>
      </div>
    );
  }

  // 재인증 성공 시, 자식 컴포넌트 렌더
  return <>{children}</>;
};

export default RequirePassword;
