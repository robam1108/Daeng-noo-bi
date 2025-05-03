import { NavLink, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../../../shared/context/AuthContext";
import React from "react";
import LoginButton from "./LoginButton";
import "./Navbar.scss";

const Navbar: React.FC = () => {
  const { user, logout } = useAuth();
  const isLoggedIn = Boolean(user);
  const userAvatarUrl = "/images/avatar.png"; // 예시 URL
  const nav = useNavigate();

  const menuItems = [
    { to: "/popular", label: "인기 여행지" },
    { to: "/region", label: "지역별 여행지" },
    { to: "/theme", label: "테마 여행지" },
  ];

  const location = useLocation();
  const isSubPage = menuItems.some((item) => location.pathname === item.to);
  // const nav = useNavigate();

  const handleLogout = async () => {
    try {
      await logout();
      nav("/login");
    } catch (err) {
      console.error("Logout Error ▶", err);
    }
  };

  return (
    <nav>
      <div className="navbar">
        <NavLink to="/" className="logo">
          <img
            src="/dangnubiLogo.png"
            alt="댕누비 로고"
            className="logo-image"
          />
          <h1>댕누비</h1>
        </NavLink>
        <div className="menu">
          {menuItems.map(({ to, label }) => (
            <NavLink
              key={to}
              to={to}
              className={({ isActive }) =>
                isActive ? "active" : isSubPage ? "dimmed" : ""
              }
            >
              {label}
            </NavLink>
          ))}
        </div>
        {isLoggedIn ? (
          <button className="btn logout-btn" onClick={handleLogout}>
            로그아웃
          </button>
        ) : (
          <button className="btn login-btn" onClick={() => nav("/login")}>
            로그인
          </button>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
