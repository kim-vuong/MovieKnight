import knightLogo from '../assets/kniz.png'
import { Link } from 'react-router-dom'

export default function Footer() {
    return (
        <footer className="bg-neutral-700/20 mt-40 font-dmSans">
            <div className="main-containers flex items-center gap-80">
                <div className="nav-logo-title -mt-36">
                    <div>
                        <img
                            src={knightLogo}
                            alt="Knight Logo"
                            className="knight-logo"
                        />
                    </div>
                    <div className="fw-bold movie-knight-title">
                        MovieKnight
                    </div>
                </div>
                <div className="flex gap-20">
                    <div className="flex flex-col gap-3">
                        <p className="font-bold text-white mb-3">Company</p>
                        <Link to="/">About</Link>
                        <Link to="/">Careers</Link>
                        <Link to="/">Accessibility</Link>
                        <Link to="/">Copyright Info</Link>
                    </div>
                    <div className="flex flex-col gap-3">
                        <p className="font-bold text-white mb-3">Premium +</p>
                        <Link to="/">Go Premium</Link>
                        <Link to="/">MovieKnight+ Beta</Link>
                        <Link to="/">Perks</Link>
                        <Link to="/">Upgrade Now</Link>
                    </div>
                    <div className="flex flex-col gap-3">
                        <p className="font-bold text-white mb-3">Support</p>
                        <Link to="/">FAQ</Link>
                        <Link to="/">Contact us</Link>
                        <Link to="/">Privacy Policy</Link>
                        <Link to="/">Terms of Service</Link>
                    </div>
                    <div className="flex flex-col items-center gap-3">
                        <p className="font-bold text-white mb-3">Connect</p>
                        <Link to="/">
                            <i className="fa-brands fa-instagram"></i>
                        </Link>
                        <Link to="/">
                            <i className="fa-brands fa-x-twitter"></i>
                        </Link>
                        <Link to="/">
                            <i className="fa-brands fa-facebook"></i>
                        </Link>
                        <Link to="/">
                            <i className="fa-brands fa-youtube"></i>
                        </Link>
                    </div>
                </div>
            </div>
            <div className="main-containers flex gap-10 py-8 text-sm">
                <p>
                    Copyright{' '}
                    <span>
                        <i className="fa-regular fa-copyright"></i>
                    </span>
                    &nbsp;2024 MovieKnight
                </p>
                <Link>Privacy & Legal</Link>
                <Link>Manage Cookies</Link>
            </div>
        </footer>
    )
}
