import useAuthService from '../hooks/useAuthService.js'
import { NavLink, useNavigate, Link } from 'react-router-dom'
import knightLogo from '../assets/kniz.png'

import '../vanilla/nav.css'

export default function Nav() {
    const { isLoggedIn, signout, user } = useAuthService()
    const navigate = useNavigate()

    let loginLinks
    let loggedInAdd

    async function handleSignout() {
        await signout()
        navigate('/signin')
    }

    if (isLoggedIn) {
        loginLinks = (
            <div className="right-menu">
                <div className="nav-avatar">
                    <NavLink to="/profile">
                        <img
                            src={user.picture_url}
                            alt="User Profile Picture"
                            className="nav-profile-pic"
                        />
                    </NavLink>
                </div>
                <NavLink to="/profile" className="your-profile all-nav-links">
                    <p>YOUR PROFILE</p>
                </NavLink>
                <NavLink
                    className="all-nav-links cursor-pointer"
                    onClick={handleSignout}
                >
                    LOG OUT
                </NavLink>
            </div>
        )
        loggedInAdd = (
            <Link to="/movies/search" className="all-nav-links">
                ADD A MOVIE
            </Link>
        )
    } else {
        loginLinks = (
            <div className="right-menu">
                <NavLink to="/signup" className="all-nav-links">
                    SIGN UP
                </NavLink>
                <NavLink to="/signin" className="all-nav-links">
                    SIGN IN
                </NavLink>
            </div>
        )
        loggedInAdd = <></>
    }

    return (
        <nav className="nav-bar navbar-dark text-white">
            <div className="nav-left-right">
                <div className="nav-blocks">
                    <div className="nav-logo-title">
                        <NavLink to="/">
                            <img
                                src={knightLogo}
                                alt="Knight Logo"
                                className="knight-logo"
                            />
                        </NavLink>
                        <NavLink className="fw-bold movie-knight-title" to="/">
                            MovieKnight
                        </NavLink>
                    </div>

                    <div className="nav-all-add-container">
                        <NavLink to="/movies" className="all-nav-links">
                            ALL MOVIES
                        </NavLink>
                        {loggedInAdd}
                        <NavLink
                            className="all-nav-links"
                            aria-current="page"
                            to="/movie-nights"
                        >
                            MOVIE NIGHTS
                        </NavLink>
                    </div>

                    {loginLinks}
                </div>
            </div>
        </nav>
    )
}
