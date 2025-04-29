import { NavLink, useLocation } from "react-router-dom"
import React from 'react';
import LoginButton from './LoginButton';
import './Navbar.scss';

const Navbar: React.FC = () => {
  const isLoggedIn = false; // 나중엔 전역 상태로 대체
  const userAvatarUrl = '/images/avatar.png'; // 예시 URL

  const menuItems = [
    { to: '/popular', label: '인기 여행지' },
    { to: '/region', label: '지역별 여행지' },
    { to: '/theme', label: '테마 여행지' },
  ];
  
  const location = useLocation();
  const isSubPage = menuItems.some(item => location.pathname === item.to);
  // const nav = useNavigate();

  return (
    <nav>
      <div className="navbar">
        <NavLink to="/" className="logo">
          <img src="/dangnubiLogo.png" alt="댕누비 로고" className="logo-image" />
          <h1>댕누비</h1>
        </NavLink>
      <div className="menu">
        {menuItems.map(({ to, label }) => (
          <NavLink
            key={to}
            to={to}
            className={({ isActive }) =>
              isActive
                ? 'active'
                : isSubPage
                ? 'dimmed'
                : ''
            }
          >
            {label}
          </NavLink>
        ))}
      </div>
      <LoginButton isLoggedIn={isLoggedIn} userAvatarUrl={userAvatarUrl} />
      </div>
    </nav>
  );
};

export default Navbar;