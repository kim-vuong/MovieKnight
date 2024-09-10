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
                    <div className="mv-card-options">
                        <button onClick={handleWatchedClick}>
                            <i
                                className="fa-solid fa-eye fa-xl"
                                style={{ color: '#c0c0c0' }}
                            ></i>
                        </button>
                        <button onClick={handleWatchListClick}>
                            <i
                                className="fa-solid fa-list-ul fa-xl"
                                style={{ color: '#c0c0c0' }}
                            ></i>
                        </button>
                        <Link to={`${movieLink}/review`}>
                            <i
                                className="fa-regular fa-pen-to-square fa-xl"
                                style={{ color: '#c0c0c0' }}
                            ></i>
                        </Link>
                    </div>
                </div>
            ) : (
                ''
            )}

            {buttonHandler ? (
                <div className="mv-card-search">
                    <div className="mv-search-card-poster">
                        <img
                            src={movie.image_url}
                            alt={`${movie.title} Poster`}
                        />
                        <p>
                            {movie.title} ({movie.release_date.slice(0, 4)})
                        </p>
                    </div>
                    <button
                        onClick={buttonHandler}
                        className="mv-search-card-button"
                    >
                        {buttonName}
                    </button>
                </div>
            ) : (
                ''
            )}

            {/* Dan Note: Commented out for testing */}
            {/* <div className="card-body">
                <h5 className="card-title">{movie.title}</h5>
                {showdetailbutton ? (
                    <Link to={movieLink} className="btn btn-primary">
                        Full Details
                    </Link>
                ) : (
                    ''
                )}
                {buttonHandler ? (
                    <button onClick={buttonHandler} className="btn btn-success">
                        {buttonName}
                    </button>
                ) : (
                    ''
                )}
            </div> */}
        </div>
    )
}
