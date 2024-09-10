import useAuthService from '../hooks/useAuthService'
import { useState, useEffect } from 'react'
import { tryFetch } from '../utils'
import { Link } from 'react-router-dom'

export default function UserReviews() {
    const [movies, setMovies] = useState([])
    const [ratedItems, setRatedItems] = useState([])
    const { user } = useAuthService()

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

    const userMovies = ratedItems
        .map((ratedItem) => {
            if (
                ratedItem.watched &&
                (ratedItem.review || ratedItem.user_rating)
            ) {
                const movie = movies.find(
                    (movie) => movie.id === ratedItem.movie_id
                )
                return movie ? { ...movie, ...ratedItem } : undefined
            }
            return
        })
        .filter((movie) => movie !== undefined)

    return (
        <div className="user-reviews mt-32 review-border-top">
            <h2 className="my-reviews-title">My Reviews:</h2>
            {userMovies.length ? (
                <div className="reviews-container">
                    {userMovies.map((movie) => {
                        return (
                            <div key={movie.movie_id} className="movie-key">
                                <div className="user-review">
                                    <Link
                                        to={`/movies/${movie.movie_id}`}
                                        className="movie-review-poster-a"
                                    >
                                        <img
                                            src={movie.image_url}
                                            alt="Movie Poster"
                                            className="movie-review-poster"
                                        />
                                    </Link>
                                    <div className="review-word-content">
                                        <Link
                                            to={`/movies/${movie.movie_id}`}
                                            className="movie-review-title"
                                        >
                                            {movie.title}
                                        </Link>
                                        <div className="rating-review">
                                            <p className="movie-rating">
                                                Rating:{' '}
                                                <b>
                                                    <span className="user-num-review">
                                                        {movie.user_rating}
                                                    </span>{' '}
                                                    / 5
                                                </b>
                                            </p>
                                            <p className="movie-review">
                                                Review:{' '}
                                                <span className="user-actual-review">
                                                    {movie.review}
                                                </span>
                                            </p>
                                        </div>
                                    </div>
                                </div>
                                <hr className="break-zone" />
                            </div>
                        )
                    })}
                </div>
            ) : (
                <div className="new-here">
                    Get your write on! Add reviews for movies you've watched!
                </div>
            )}
        </div>
    )
}
