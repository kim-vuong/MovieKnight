import { Link } from 'react-router-dom'
import useAuthService from '../hooks/useAuthService'
import { handleAddToWatchLater, handleAddToWatched } from '../utils'

import '../vanilla/movie-card.css'

export default function MovieCard({
    movie,
    buttonHandler,
    buttonName,
    showdetailbutton,
}) {
    const { user } = useAuthService()
    const movieLink = `/movies/${movie.id}`

    const handleWatchListClick = async (event) => {
        handleAddToWatchLater(event, user, movie)
    }

    const handleWatchedClick = async (event) => {
        handleAddToWatched(event, user, movie)
    }

    return (
        <div key={movie.tmdb_id}>
            {showdetailbutton ? (
                <div className="mv-card">
                    <Link to={movieLink}>
                        <img
                            src={movie.image_url}
                            alt={`${movie.title} Poster`}
                        />
                    </Link>
                    {user ? (
                        <div className="mv-card-options">
                            <button onClick={handleWatchedClick}>
                                <i
                                    className="fa-solid fa-eye fa-lg icon-hover"
                                    style={{ color: '#c0c0c0' }}
                                ></i>
                            </button>
                            <button onClick={handleWatchListClick}>
                                <i
                                    className="fa-solid fa-bookmark fa-lg icon-hover"
                                    style={{ color: '#c0c0c0' }}
                                ></i>
                            </button>
                            <Link to={`${movieLink}/review`}>
                                <i
                                    className="fa-regular fa-pen-to-square fa-lg icon-hover"
                                    style={{ color: '#c0c0c0' }}
                                ></i>
                            </Link>
                        </div>
                    ) : (
                        ''
                    )}
                </div>
            ) : (
                ''
            )}

            {buttonHandler ? (
                <div className="mv-search-card" onClick={buttonHandler}>
                    <img src={movie.image_url} alt={`${movie.title} Poster`} />
                    <div className="overlay">
                        <i
                            className="fa-solid fa-plus fa-2xl"
                            style={{ color: '#fff' }}
                        ></i>
                        <p className="mv-search-card-poster-title mt-2">
                            {movie.title}
                        </p>
                        <p className="mv-search-card-poster-tagline text-sm -mt-4">
                            {movie.tagline}
                        </p>
                        <p>({movie.release_date.slice(0, 4)})</p>
                    </div>
                </div>
            ) : (
                ''
            )}
        </div>
    )
}
