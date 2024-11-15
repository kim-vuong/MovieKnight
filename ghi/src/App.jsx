import { Outlet, useLocation } from 'react-router-dom'
import Nav from './components/NavBar'
import Footer from './components/Footer'

import './vanilla/app.css'

const API_HOST = import.meta.env.VITE_API_HOST
if (!API_HOST) {
    throw new Error('VITE_API_HOST is not defined')
}

function App() {
    const location = useLocation()
    const nonFooterPages =
        location.pathname === '/profile' ||
        location.pathname === '/signin' ||
        location.pathname === '/signup'

    return (
        <div className="App">
            <header>
                <Nav />
            </header>
            <div>
                <Outlet />
            </div>
            {!nonFooterPages && <Footer />}
        </div>
    )
}

export default App
