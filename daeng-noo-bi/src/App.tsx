import './App.scss'
import { Route, Routes } from 'react-router-dom'
import Home from './pages/Home/Home'
import NotFound from './pages/NotFound/NotFound'
import Region from './pages/Region/Region'
import Popular from './pages/Popular/Popular'
import Theme from './pages/Theme/Theme'
import Login from './pages/Login/Login'
import Signup from './pages/Signup/Signup'
import Favorites from './pages/Favorites/Favorites'
import Navbar from './components/Navbar/Navbar'



function App() {

  return (
    <>
      <Navbar />
      <Routes>
        <Route path='/' element={<Home />} />
        <Route path='/popular' element={<Popular />} />
        <Route path='/region' element={<Region />} />
        <Route path='/theme' element={<Theme />} />
        <Route path='/login' element={<Login />} />
        <Route path='/signup' element={<Signup />} />
        <Route path='/favorites/:id' element={<Favorites />} />
        <Route path='*' element={<NotFound />} />
      </Routes>
    </>
  )
}

export default App
