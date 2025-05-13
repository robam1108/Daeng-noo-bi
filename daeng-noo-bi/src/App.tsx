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
import Detail from "./features/Detail/page/Detail";
import SearchResults from "./features/SearchResults/SearchResults";
import EditProfileRoute from "./features/EditProfile/page/EditProfileRoute";
import MainLayout from "./shared/components/MainLayout/MainLayout";

function App() {
  return (
    <Routes>
      <Route element={<MainLayout />}>
        <Route path="/" element={<Home />} />
        <Route path="/popular" element={<Popular />} />
        <Route path="/region" element={<Region />} />
        <Route path="/theme" element={<Theme />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/favorites" element={<Favorites />} />
        <Route path="/place/:contentId" element={<Detail />} />
        <Route path="/search" element={<SearchResults />} />
        <Route path="/editprofile" element={<EditProfileRoute />} />
      </Route>

      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}

export default App;
