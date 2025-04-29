import React from 'react';
import { Link } from 'react-router-dom';
import './LoginButton.scss';

interface LoginButtonProps {
  isLoggedIn: boolean;
  userAvatarUrl?: string;
}

const LoginButton: React.FC<LoginButtonProps> = ({ isLoggedIn, userAvatarUrl }) => {
  if (isLoggedIn) {
    return (
      <div className="login-button">
        <img src={userAvatarUrl} alt="유저 아바타" className="avatar" />
      </div>
    );
  }

  return (
    <button className="login-button">
      <Link to="/login" className="login-link">로그인</Link>
    </button>
  );
};

export default LoginButton;