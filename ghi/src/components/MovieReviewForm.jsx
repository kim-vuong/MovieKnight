import useAuthService from '../hooks/useAuthService'
import { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { tryFetch } from '../utils'

import '../vanilla/movie-review.css'

export default function MovieReviewForm() {
    const [movie, setMovie] = useState(null)
    const [rating, setRating] = useState('')
    const [review, setReview] = useState('')
    const { user, isLoggedIn } = useAuthService()
    const { pk } = useParams()
    const navigate = useNavigate()

    const API_HOST = import.meta.env.VITE_API_HOST
    if (!API_HOST) {
        throw new Error('VITE_API_HOST is not defined')
    }

    useEffect(() => {
        if (!user || !isLoggedIn) {
            navigate('/signin')
            return
        }

        const fetchMovie = async () => {
            const movieUrl = `${API_HOST}/api/movies/${pk}`
            const movieResponse = await fetch(movieUrl)
            if (movieResponse.ok) {
                const data = await movieResponse.json()
                setMovie(data)
            }
        }
        fetchMovie()
    }, [user, isLoggedIn, pk, API_HOST, navigate])

    const checkForExistingRI = async (userId, movieId) => {
        const ratedItemUrl = `${API_HOST}/api/rated-items/exists/users/${userId}/movies/${movieId}`
        const response = await tryFetch(ratedItemUrl)
        if (response instanceof Error) {
            return null
        }
        return response.exists
    }

    const handleSubmit = async (event) => {
        event.preventDefault()

        const postBody = {
            user_id: user.id,
            movie_id: Number(pk),
            user_rating: Number(rating),
            review: review,
            watched: true,
            tier: 'F',
        }

        const existingRI = await checkForExistingRI(user.id, Number(pk))

        const config = {
            method: existingRI ? 'PUT' : 'POST',
            body: JSON.stringify(postBody),
            headers: { 'Content-Type': 'application/json' },
        }

        try {
            const response = await fetch(
                existingRI
                    ? `${API_HOST}/api/rated-items/users/${user.id}/movies/${pk}`
                    : `${API_HOST}/api/rated-items/`,
                config
            )

            if (response.ok) {
                navigate('/profile')
            }
        } catch (e) {
            console.error(`Error: ${e}`)
        }
    }

    if (!movie) return <p>Loading</p>

    return (
        <div className="review-main">
            <div className="col-6 review-container">
                <div className="shadow p-4 mt-4 center-content">
                    <div className="review-header">
                        <p className="now-reviewing">Now reviewing...</p>
                        <h1 className="review-title">{movie.title}</h1>
                    </div>
                    <div className="mv-img-review-flex">
                        <div>
                            <img
                                src={movie.image_url}
                                alt="Movie Poster"
                                width="350px"
                                className="mb-4 rounded-lg mv-review-img"
                            />
                        </div>
                        <form onSubmit={handleSubmit} id="review-form">
                            <div className="form-floating mb-3">
                                <input
                                    onChange={(e) => setRating(e.target.value)}
                                    type="number"
                                    className="user-rating-bar"
                                    id="rating"
                                    name="rating"
                                    min="1"
                                    max="5"
                                    maxLength={1}
                                    value={rating}
                                    required
                                />
                                <label htmlFor="rating" className="rating-1-5">
                                    Rating ( 1 - 5 )
                                </label>
                            </div>
                            <div className="form-floating mb-3">
                                <textarea
                                    onChange={(e) => setReview(e.target.value)}
                                    name="review"
                                    id="review"
                                    placeholder="Your review here!"
                                    value={review}
                                    rows="5"
                                    style={{ width: '100%' }}
                                    required
                                    className="review-text rounded"
                                ></textarea>
                            </div>
                            <div className="review-button-div">
                                <button
                                    type="submit"
                                    className="review-button
                                    submit
                                    hover:bg-zinc-600 hover:text-white hover:border-zinc-500
                                    transition-colors duration-300"
                                >
                                    Submit your Review
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    )
}
