import React, { useState, FormEvent } from 'react';
import { useAuth } from "../../../shared/context/AuthContext";

interface RequirePasswordProps {
  children: React.ReactNode;
}

const RequirePassword: React.FC<RequirePasswordProps> = ({ children }) => {
  const { reauthenticate } = useAuth();
  const [password, setPassword] = useState('');
  const [verified, setVerified] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      await reauthenticate(password);
      setVerified(true);
    } catch (err: any) {
      console.error(err);
      setError('비밀번호가 올바르지 않습니다.');
    } finally {
      setLoading(false);
    }
  };

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

  return <>{children}</>;
};

export default RequirePassword;
