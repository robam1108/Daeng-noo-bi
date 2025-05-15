import { Outlet } from 'react-router-dom';
import Navbar from '../Navbar/Navbar';
import Footer from '../Footer/Footer';
import "./MainLayout.scss"

export default function MainLayout() {
    return (
        <div className='MainLayout'>
            <Navbar />
            <div className='layout-main'>
                <Outlet />
            </div>
            <Footer />
        </div>
    );
}