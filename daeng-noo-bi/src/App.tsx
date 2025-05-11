import "./App.scss";
import { Route, Routes } from "react-router-dom";
import Home from "./features/Home/pages/Home";
import NotFound from "./features/NotFound/NotFound";
import Region from "./features/region/pages/Region";
import Popular from "./features/Popular/pages/Popular";
import Theme from "./features/theme/pages/Theme";
import Login from "./features/Login/pages/Login";
import Signup from "./features/Signup/pages/Signup";
import Favorites from "./features/Favorites/pages/Favorites";
import Navbar from "./shared/components/Navbar/Navbar";
import Footer from "./shared/components/Footer/Footer";
import Detail from "./features/Detail/page/Detail";
import SearchResults from "./features/SearchResults/SearchResults";
import EditProfile from "./features/EditProfile/page/EditProfile";
import RequirePassword from "./features/EditProfile/components/RequirePassword";

function App() {
  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/popular" element={<Popular />} />
        <Route path="/region" element={<Region />} />
        <Route path="/theme" element={<Theme />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/favorites" element={<Favorites />} />
        <Route path="/place/:contentId" element={<Detail />} />
        <Route path="*" element={<NotFound />} />
        <Route path="/search" element={<SearchResults />} />
        <Route path="/editprofile" element={<RequirePassword><EditProfile /></RequirePassword>} />
      </Routes>
      <Footer />
    </>
  );
}

export default App;
