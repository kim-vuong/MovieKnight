import useAuthService from '../hooks/useAuthService'
import { useState, useEffect } from 'react'
import { tryFetch } from '../utils'
import { useNavigate } from 'react-router-dom'
import { Link } from 'react-router-dom'

import '../vanilla/user-profile.css'
import Slider from 'react-slick'

export default function UserMovies() {
    const [movies, setMovies] = useState([])
    const [ratedItems, setRatedItems] = useState([])
    const [isSwiping, setIsSwiping] = useState(false)
    const { user } = useAuthService()
    const navigate = useNavigate()

    const API_HOST = import.meta.env.VITE_API_HOST
    if (!API_HOST) {
        throw new Error('VITE_API_HOST is not defined')
    }

    useEffect(() => {
        if (!user) return

        const fetchMovies = async () => {
            const moviesUrl = `${API_HOST}/api/movies`
            const movieResponse = await tryFetch(moviesUrl)
            if (movieResponse instanceof Error) {
                console.error(`Failed to fetch all movies: ${movieResponse}`)
            } else {
                setMovies(movieResponse)
            }
        }

        const fetchRatedItems = async () => {
            const ratedItemsUrl = `${API_HOST}/api/rated-items/users/${user.id}`
            const ratedItemResponse = await tryFetch(ratedItemsUrl)
            if (ratedItemResponse instanceof Error) {
                console.error(
                    `Failed to fetch rated items: ${ratedItemResponse}`
                )
            } else {
                setRatedItems(ratedItemResponse)
            }
        }

        fetchMovies()
        fetchRatedItems()
    }, [user, API_HOST])

    const watchedMovies = ratedItems.reduce((acc, ratedItem) => {
        if (ratedItem.watched) {
            const movie = movies.find(
                (movie) => movie.id === ratedItem.movie_id
            )
            if (movie) acc.push(movie)
        }
        return acc
    }, [])

    const movieDups = [...watchedMovies]
    const noDups = []
    movieDups.forEach((movie) => {
        if (!noDups.includes(movie)) noDups.push(movie)
    })

    const unwatchedRatedItems = ratedItems.filter(
        (ratedItem) => !ratedItem.watched
    )
    const watchlistMovies = unwatchedRatedItems
        .map((ratedItem) => {
            return movies.find((movie) => movie.id === ratedItem.movie_id)
        })
        .filter((movie) => movie !== undefined)

    const slidesShown = (moviesList) => {
        if (moviesList.length >= 4) return 4
        if (moviesList.length === 3) return 3
        if (moviesList.length === 2) return 2
        return 1
    }

    const watchlistSettings = {
        speed: 600,
        arrows: watchlistMovies.length > 4,
        dots: watchlistMovies.length > 4,
        infinite: watchlistMovies.length === 1 ? false : true,
        slidesToShow: slidesShown(watchlistMovies),
        slidesToScroll: slidesShown(watchlistMovies),
        beforeChange: () => setIsSwiping(true),
        afterChange: () => setIsSwiping(false),
        autoplay: watchlistMovies.length > 4,
        autoplaySpeed: 6000,
        cssEase: 'linear',
        responsive: [
            {
                breakpoint: 1210,
                settings: {
                    arrows: watchlistMovies.length > 3,
                    infinite: watchlistMovies.length > 3,
                    autoplay: watchlistMovies.length > 3,
                    slidesToShow: 3,
                    slidesToScroll: 3,
                    centerPadding: '1rem',
                },
            },
            {
                breakpoint: 850,
                settings: {
                    arrows: watchlistMovies.length > 2,
                    infinite: watchlistMovies.length > 2,
                    autoplay: watchlistMovies.length > 2,
                    slidesToShow: 2,
                    slidesToScroll: 2,
                    centerPadding: '.5rem',
                },
            },
            {
                breakpoint: 500,
                settings: {
                    arrows: watchlistMovies.length > 1,
                    infinite: watchlistMovies.length > 1,
                    autoplay: watchlistMovies.length > 1,
                    slidesToShow: 1,
                    slidesToScroll: 1,
                    centerPadding: '.25rem',
                },
            },
        ],
    }

    const watchedSettings = {
        speed: 600,
        arrows: noDups.length > 4,
        dots: noDups.length > 4,
        infinite: noDups.length === 1 ? false : true,
        slidesToShow: slidesShown(noDups),
        slidesToScroll: slidesShown(noDups),
        beforeChange: () => setIsSwiping(true),
        afterChange: () => setIsSwiping(false),
        autoplay: noDups.length > 4,
        autoplaySpeed: 6000,
        cssEase: 'linear',
        responsive: [
            {
                breakpoint: 1210,
                settings: {
                    arrows: noDups.length > 3,
                    dots: noDups.length > 3,
                    infinite: noDups.length > 3,
                    autoplay: noDups.length > 3,
                    slidesToShow: 3,
                    slidesToScroll: 3,
                    centerPadding: '1rem',
                },
            },
            {
                breakpoint: 850,
                settings: {
                    arrows: noDups.length > 2,
                    infinite: noDups.length > 2,
                    autoplay: noDups.length > 2,
                    slidesToShow: 2,
                    slidesToScroll: 2,
                    centerPadding: '.5rem',
                },
            },
            {
                breakpoint: 500,
                settings: {
                    arrows: noDups.length > 1,
                    infinite: noDups.length > 1,
                    autoplay: noDups.length > 1,
                    slidesToShow: 1,
                    slidesToScroll: 1,
                    centerPadding: '.25rem',
                },
            },
        ],
    }

    const handleClick = (movieId) => {
        if (!isSwiping) navigate(`/movies/${movieId}`)
    }

    return (
        <div className="user-movies">
            <div className="user-movies mb-12">
                <div className="watchlist-movies">
                    <div className="carousel-word-top">
                        <h2 className="movies-2-watch mv-title">
                            Watch List Movies
                        </h2>
                        <p className="movie-subtitle">
                            Movies to Watch: <b>{watchlistMovies.length}</b>
                        </p>
                    </div>
                    {watchlistMovies.length ? (
                        <div className="slider-container">
                            <Slider {...watchlistSettings}>
                                {watchlistMovies.map((movie) => {
                                    return (
                                        <div
                                            key={movie.tmdb_id}
                                            className="horizontal-movie mt-2"
                                        >
                                            <img
                                                onClick={() =>
                                                    handleClick(movie.id)
                                                }
                                                src={movie.image_url}
                                                alt="Movie Poster"
                                                width="200"
                                                className="movie-cursor movie-hover rounded"
                                            />
                                            <h3 className="movie-carousel-title">
                                                {movie.title}
                                            </h3>
                                        </div>
                                    )
                                })}
                            </Slider>
                        </div>
                    ) : (
                        <div className="new-here">
                            Add some movies to your Watch List{' '}
                            <b>
                                <Link to="/movies">here!</Link>
                            </b>
                        </div>
                    )}
                </div>
                <div className="user-watched-movies mt-14">
                    <div className="carousel-word-top">
                        <h2 className="watchlist-movies mv-title">
                            Watched Movies
                        </h2>
                        <p className="movie-subtitle">
                            Movies Watched: <b>{noDups.length}</b>
                        </p>
                    </div>
                    {noDups.length ? (
                        <div className="slider-container">
                            <Slider {...watchedSettings}>
                                {noDups.map((movie) => {
                                    return (
                                        <div
                                            key={movie.id}
                                            className="horizontal-movie mt-2"
                                        >
                                            <img
                                                onClick={() =>
                                                    handleClick(movie.id)
                                                }
                                                src={movie.image_url}
                                                alt="Movie Poster"
                                                width="200"
                                                className="movie-cursor movie-hover rounded"
                                            />
                                            <h3 className="movie-carousel-title">
                                                {movie.title}
                                            </h3>
                                        </div>
                                    )
                                })}
                            </Slider>
                        </div>
                    ) : (
                        <div className="new-here">
                            Add all of your watched movies{' '}
                            <b>
                                <Link to="/movies">here!</Link>
                            </b>
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}
