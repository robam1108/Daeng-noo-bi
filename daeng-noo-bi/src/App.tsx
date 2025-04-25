import './App.css'
import { Route, Routes } from 'react-router-dom'
import Home from './pages/Home'
import NotFound from './pages/NotFound'
import Region from './pages/Region'
import Popular from './pages/Popular'
import Theme from './pages/Theme'
import Login from './pages/Login'
import Signup from './pages/Signup'
import Favorites from './pages/Favorites'


function App() {

  return (
    <>
      <Routes>
        <Route path='/' element={<Home />} />
        <Route path='/popular' element={<Popular />} />
        <Route path='/region' element={<Region />} />
        <Route path='/theme' element={<Theme />} />
        <Route path='/login' element={<Login />} />
        <Route path='/signup' element={<Signup />} />
        <Route path='/login/:id' element={<Favorites />} />
        <Route path='*' element={<NotFound />} />
      </Routes>
    </>
  )
}

export default App
