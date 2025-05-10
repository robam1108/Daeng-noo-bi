import { useState, useRef, useEffect } from "react";
import { NavLink, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../../../shared/context/AuthContext";
import React from "react";
// import LoginButton from "./LoginButton";
import SearchBar from "./SearchBar";
import "./Navbar.scss";

const Navbar: React.FC = () => {
  const { user, logout } = useAuth();
  // const isLoggedIn = Boolean(user);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const nav = useNavigate();

  const menuItems = [
    { to: "/popular", label: "실시간 인기" },
    { to: "/region", label: "지역별 여행지" },
    { to: "/theme", label: "테마 여행지" },
  ];

  const location = useLocation();
  const isSubPage = menuItems.some((item) => location.pathname === item.to);

  const handleLogout = async () => {
    try {
      await logout();
      nav("/login");
    } catch (err) {
      console.error("Logout Error ▶", err);
    }
  };

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target as Node)
      ) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

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
        <div className="search-section">
          <SearchBar />
        </div>
        <div className="auth-section">
          {user ? (
            <div className="user-info" ref={dropdownRef}>
              {/* <span className="welcome-message">
                <span className="userName">{user.nickname ?? user.email}</span>
                님 어서오세요!
              </span> */}
              <img
                src="/userIcon.png"
                alt="유저 프로필"
                className="user-avatar"
                onClick={() => setDropdownOpen(!dropdownOpen)}
              />
              {dropdownOpen && (
                <div className="dropdown-menu">
                  <button onClick={() => nav("/Favorites")}>찜목록</button>
                  <button onClick={() => nav("/EditProfile")}>회원정보</button>
                  <button onClick={handleLogout}>로그아웃</button>
                </div>
              )}
            </div>
          ) : (
            <button className="btn login-btn" onClick={() => nav("/login")}>
              로그인
            </button>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
