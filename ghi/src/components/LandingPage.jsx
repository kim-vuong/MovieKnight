import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { tryFetch } from '../utils'
import HeroStillSlide from './HeroStillSlide'
import About from './About'

import '../vanilla/landing-page.css'

export default function LandingPage() {
    const [movies, setMovies] = useState([])

    const API_HOST = import.meta.env.VITE_API_HOST
    if (!API_HOST) {
        throw new Error('BASE_URL is not defined')
    }

    useEffect(() => {
        const fetchMovies = async () => {
            const moviesUrl = `${API_HOST}/api/movies`
            const movieResponse = await tryFetch(moviesUrl)
            if (movieResponse instanceof Error) {
                console.error(`Failed to fetch movies: ${movieResponse}`)
            } else {
                setMovies(movieResponse)
            }
        }
        fetchMovies()
    }, [])

    return (
        <>
            <div className="main-containers lp-main">
                <h1 className="lp-main-h1 blur-[.7px] text-rose-500 mb-2">
                    Your&nbsp;
                    <span className="text-[#d52b1e] underline underline-offset-8 decoration-white">
                        Ultimate
                    </span>
                    &nbsp;Film Companion
                </h1>
                <p className="lp-main-subtitle text-neutral-300">
                    Curate, Review, and Celebrate Together
                </p>
                <p className="lp-main-descrip">
                    MovieKnight is your one-stop-shop to track movies watched,
                    curate watchlists, reviews, and host movie nights with
                    friends and family.
                </p>

                <Link to="/signup" className="lp-main-button">
                    Get Started
                </Link>
                {movies.length >= 10 ? (
                    <div
                        className="lp-scroll"
                        style={{
                            '--time': `${movies.length * 3}s`,
                        }}
                    >
                        <div>
                            {movies.map((movie) => {
                                return (
                                    <img
                                        key={movie.id}
                                        src={movie.image_url}
                                        alt={`${movie.title} Poster`}
                                        className="lp-mv-poster"
                                    />
                                )
                            })}
                            {movies.map((movie) => {
                                return (
                                    <img
                                        key={`${movie.id}-duplicate`}
                                        src={movie.image_url}
                                        alt={`${movie.title} Poster`}
                                        className="lp-mv-poster"
                                    />
                                )
                            })}
                        </div>
                    </div>
                ) : (
                    <HeroStillSlide />
                )}
            </div>
            <About />
        </>
    )
}
