import alien from '../assets/hero-mv/alien.webp'
import avengers from '../assets/hero-mv/avengers.webp'
import batman from '../assets/hero-mv/batman.webp'
import joker from '../assets/hero-mv/joker.webp'
import starwars from '../assets/hero-mv/sw.webp'
import toystory from '../assets/hero-mv/toystory.webp'
import '../vanilla/landing-page.css'

export default function HeroStillSlide() {
    return (
        <div className="hero-still-container">
            <img
                src={alien}
                alt="Alien Movie Poster"
                className="hero-still-poster"
            />
            <img
                src={avengers}
                alt="Avengers Movie Poster"
                className="hero-still-poster"
            />
            <img
                src={batman}
                alt="Batman Movie Poster"
                className="hero-still-poster"
            />
            <img
                src={joker}
                alt="Joker 2 Movie Poster"
                className="hero-still-poster"
            />
            <img
                src={starwars}
                alt="Star Wars Movie Poster"
                className="hero-still-poster"
            />
            <img
                src={toystory}
                alt="Toy Story Movie Poster"
                className="hero-still-poster"
            />
        </div>
    )
}
