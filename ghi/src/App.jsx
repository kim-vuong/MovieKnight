import { Outlet } from 'react-router-dom'
import Nav from './components/NavBar'

import './vanilla/app.css'

const API_HOST = import.meta.env.VITE_API_HOST
if (!API_HOST) {
    throw new Error('VITE_API_HOST is not defined')
}

function App() {
    return (
        <div className="App">
            <Nav />
            <header className="App-header"></header>
            <div>
                <Outlet />
            </div>
        </div>
    )
}

export default App
