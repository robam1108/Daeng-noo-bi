import { useState, useRef, useEffect } from "react";
import { NavLink, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../../../shared/context/AuthContext";
import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { IconProp } from "@fortawesome/fontawesome-svg-core";
import {
  faBars,
  faXmark,
  faRightFromBracket,
  faCircleInfo,
  faHeart,
  faInfoCircle,
} from "@fortawesome/free-solid-svg-icons";
import SearchBar from "./SearchBar";
import "./Navbar.scss";

const Navbar: React.FC = () => {
  const { user, logout } = useAuth();
  // const isLoggedIn = Boolean(user);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const drawerRef = useRef<HTMLDivElement>(null);
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
    const onClick = (e: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target as Node)
      ) {
        setDropdownOpen(false);
      }

      if (
        drawerOpen &&
        drawerRef.current &&
        !drawerRef.current.contains(e.target as Node)
        // hamburgerRef.current &&
        // !hamburgerRef.current.contains(e.target as Node)
      ) {
        setDrawerOpen(false);
      }
    };
    document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, [drawerOpen]);

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

      {/* 햄버거 버튼 */}
      <button
        type="button"
        className="hamburger-btn"
        aria-label={drawerOpen ? "메뉴 닫기" : "메뉴 열기"}
        aria-expanded={drawerOpen}
        onClick={() => setDrawerOpen((open) => !open)}
      >
        <FontAwesomeIcon icon={faBars as IconProp} />
      </button>

      {drawerOpen && (
        <div className="backdrop" onClick={() => setDrawerOpen(false)} />
      )}

      {/* 모바일용 nav */}
      <aside
        ref={drawerRef}
        className={`side-drawer${drawerOpen ? " open" : ""}`}
      >
        <button
          type="button"
          className="drawer-close-btn"
          aria-label="메뉴 닫기"
          onClick={() => setDrawerOpen(false)}
        >
          <FontAwesomeIcon icon={faXmark as IconProp} />
        </button>
        <div className="nav-intro">
          {user ? (
            <div className="user-info">
              <img
                src="/userIcon.png"
                alt="유저 프로필"
                className="user-avatar"
                onClick={() => setDropdownOpen(!dropdownOpen)}
              />
              <span className="welcome-message">
                <span className="userName">{user.nickname ?? user.email}</span>
                님 반갑습니다!
              </span>
            </div>
          ) : (
            <div>어서오세요!</div>
          )}
        </div>

        <div className="auth-mobile">
          {user ? (
            <>
              <button
                onClick={() => {
                  setDrawerOpen(false);
                  nav("/Favorites");
                }}
              >
                <FontAwesomeIcon className="icon" icon={faHeart as IconProp} />
                <p>찜목록</p>
              </button>
              <button
                onClick={() => {
                  setDrawerOpen(false);
                  nav("/EditProfile");
                }}
              >
                <FontAwesomeIcon
                  className="icon"
                  icon={faInfoCircle as IconProp}
                />
                <p>회원정보</p>
              </button>
              <button
                onClick={() => {
                  setDrawerOpen(false);
                  handleLogout();
                }}
              >
                <FontAwesomeIcon
                  className="icon"
                  icon={faRightFromBracket as IconProp}
                />
                <p>로그아웃</p>
              </button>
            </>
          ) : (
            <button
              onClick={() => {
                setDrawerOpen(false);
                nav("/login");
              }}
            >
              로그인
            </button>
          )}
        </div>

        <ul className="menu mobile">
          {menuItems.map(({ to, label }) => (
            <li key={to}>
              <NavLink
                to={to}
                onClick={() => setDrawerOpen(false)}
                className={({ isActive }) =>
                  isActive ? "active" : isSubPage ? "dimmed" : ""
                }
              >
                {label}
              </NavLink>
            </li>
          ))}
        </ul>
      </aside>
    </nav>
  );
};

export default Navbar;
