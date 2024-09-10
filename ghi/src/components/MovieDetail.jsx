import { useLocation } from 'react-router-dom'
import { useEffect, useState } from 'react'
import useAuthService from '../hooks/useAuthService'
import { useNavigate } from 'react-router-dom'
import { Link } from 'react-router-dom'
import { tryFetch } from '../utils'

import '../vanilla/movie-detail.css'

const API_HOST = import.meta.env.VITE_API_HOST
if (!API_HOST) {
    throw new Error('VITE_API_HOST is not defined')
}

export default function MovieDetail() {
    const navigate = useNavigate()
    const location = useLocation()
    const { user, isLoggedIn } = useAuthService()
    const postURL = `${API_HOST}/api/rated-items/`
    let postBody = {
        user_id: 0,
        movie_id: 0,
        user_rating: 0,
        review: '',
        watched: false,
        tier: 'Z',
    }
    const URL = `${API_HOST}/api${location.pathname}`
    const [movie, setMovie] = useState(null)
    const fetchData = async () => {
        const response = await fetch(URL)
        if (response.ok) {
            const data = await response.json()
            setMovie(data)
        }
    }

    useEffect(() => {
        fetchData()
    }, [])

    const checkForExistingRI = async (userId, movieId) => {
        const ratedItemUrl = `${API_HOST}/api/rated-items/exists/users/${userId}/movies/${movieId}`
        const response = await tryFetch(ratedItemUrl)
        if (response instanceof Error) {
            return null
        }
        return response.exists
    }

    const getRatedItemDetails = async (userId, movieId) => {
        const ratedItemUrl = `${API_HOST}/api/rated-items/users/${userId}/movies/${movieId}`
        const response = await tryFetch(ratedItemUrl)
        if (response instanceof Error) {
            return null
        }
        return response
    }

    async function handleAddToWatchLater(e) {
        e.preventDefault()
        postBody.user_id = user.id
        postBody.movie_id = movie.id

        const existingRI = await checkForExistingRI(user.id, movie.id)

        const config = {
            method: existingRI ? 'PUT' : 'POST',
            body: JSON.stringify(postBody),
            headers: { 'Content-Type': 'application/json' },
        }

        try {
            const response = await fetch(
                existingRI
                    ? `${API_HOST}/api/rated-items/users/${user.id}/movies/${movie.id}`
                    : `${API_HOST}/api/rated-items`,
                config
            )
            if (response.ok) navigate('/profile')
        } catch (e) {
            console.error(`Error: ${e}`)
        }
    }

    const handleWatchedMovie = async (event) => {
        event.preventDefault()
        postBody.user_id = user.id
        postBody.movie_id = movie.id
        postBody.watched = true

        const existingRI = await checkForExistingRI(user.id, movie.id)

        if (existingRI) {
            const ratedItemDetails = await getRatedItemDetails(
                user.id,
                movie.id
            )

            if (ratedItemDetails.watched) {
                navigate('/profile')
                return
            }

            const updateUrl = `${API_HOST}/api/rated-items/users/${user.id}/movies/${movie.id}`
            const updateResponse = await tryFetch(updateUrl, {
                method: 'PUT',
                body: JSON.stringify(postBody),
                headers: { 'Content-Type': 'application/json' },
            })

            if (updateResponse instanceof Error) {
                console.error(`Failed to update Movie: ${movie.id}`)
            } else {
                navigate('/profile')
            }
        } else {
            const response = await tryFetch(postURL, {
                method: 'POST',
                body: JSON.stringify(postBody),
                headers: { 'Content-Type': 'application/json' },
            })

            if (response instanceof Error) {
                console.error(
                    `Failed to add Movie: ${movie.id} to watched list: ${response.message}`
                )
            } else navigate('/profile')
        }
    }

    if (movie === null) {
        return <div>Loading Movie Details</div>
    }

    const runtimeInHoursAndMinutes = (totalMin) => {
        const hours = Math.floor(totalMin / 60)
        const minutes = totalMin % 60
        return hours > 1
            ? `${hours} Hours ${minutes} Minutes`
            : `${hours} Hour ${minutes} Minutes`
    }

    return (
        <>
            <div className="main-containers mv-detail-container">
                <div className="row">
                    <div className="col-3">
                        <img
                            src={movie.image_url}
                            className="mv-detail-poster"
                        />
                    </div>
                    <div className="col ml-4 mv-detail-right">
                        <div className="mv-detail-words">
                            <h1 className="mv-detail-h1">
                                {movie.title} ({movie.release_date.slice(0, 4)})
                            </h1>
                            <div className="mv-descrip-container">
                                <div className="mv-detail-tagline">
                                    {movie.tagline}
                                </div>
                                <div>
                                    {runtimeInHoursAndMinutes(movie.runtime)}
                                </div>
                                <div>
                                    {' '}
                                    <div className="mv-detail-genres">
                                        {movie.genres.map((genre, index) => {
                                            return (
                                                <div key={genre.id}>
                                                    {genre.name}
                                                    {index <
                                                        movie.genres.length -
                                                            1 && ' | '}
                                                </div>
                                            )
                                        })}
                                    </div>
                                </div>
                                <div className="mv-detail-synopsis">
                                    {movie.synopsis}
                                </div>
                            </div>
                        </div>
                        <div className="mv-detail-btn-container">
                            {isLoggedIn || user ? (
                                <div className="mv-detail-buttons">
                                    <div>
                                        <button
                                            onClick={handleAddToWatchLater}
                                            className="
                                            mv-detail-button
                                            hover:bg-zinc-600 
                                            hover:text-white 
                                            hover:border-zinc-500
                                            transition-colors duration-300"
                                        >
                                            Add To Watch List
                                        </button>
                                    </div>
                                    <div>
                                        <Link to={`/profile`}>
                                            <button
                                                onClick={handleWatchedMovie}
                                                className="
                                                mv-detail-button
                                                hover:bg-zinc-600 
                                                hover:text-white 
                                                hover:border-zinc-500
                                                transition-colors duration-300"
                                            >
                                                Watched!
                                            </button>
                                        </Link>
                                    </div>
                                    <div>
                                        <Link to={`/movies/${movie.id}/review`}>
                                            <button
                                                className="
                                                mv-detail-button
                                                hover:bg-zinc-600
                                                hover:text-white
                                                hover:border-zinc-500
                                                transition-colors duration-300"
                                            >
                                                Add a Review
                                            </button>
                                        </Link>
                                    </div>
                                </div>
                            ) : (
                                ''
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}
