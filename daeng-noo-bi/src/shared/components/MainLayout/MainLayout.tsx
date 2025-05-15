import { Outlet } from "react-router-dom";
import Navbar from "../Navbar/Navbar";
import Footer from "../Footer/Footer";
import "./MainLayout.scss";

export default function MainLayout() {
  return (
    <div className="MainLayout">
      <a href="#main" className="skip-link">
        본문으로 건너뛰기
      </a>
      <Navbar />
      <div className="layout-main" id="main">
        <Outlet />
      </div>
      <Footer />
    </div>
  );
}
