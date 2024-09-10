import { Link } from 'react-router-dom'

export default function MovieCard({
    movie,
    buttonHandler,
    buttonName,
    showdetailbutton,
}) {
    const movieLink = `/movies/${movie.id}`
    return (
        <div key={movie.tmdb_id} className="card">
            <img
                className="card-img-top"
                height="300"
                width="200"
                src={movie.image_url}
            />
            <div className="card-body">
                <h5 className="card-title">{movie.title}</h5>
                <p className="card-text">{movie.tagline}</p>
                <p className="card-text">{movie.release_date}</p>
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
            </div>
        </div>
    )
}
