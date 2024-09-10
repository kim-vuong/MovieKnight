import { useState } from 'react'
import { tryFetch } from '../utils'

function MoviePickPopup({ show, onClose, onSubmit, movieNightId, userId }) {
    const [movieChoices, setMovieChoices] = useState([null, null, null])
    const [searchResults, setSearchResults] = useState([])
    const [activeSearchIndex, setActiveSearchIndex] = useState(null)

    const handleMovieSearch = async (query, index) => {
        setActiveSearchIndex(index);

        const newMovieChoices = [...movieChoices];
        newMovieChoices[index] = { title: query };
        setMovieChoices(newMovieChoices);

        if (query.trim() === '') {
            setSearchResults([]);
            return;
        }

        try {
            const url = new URL(`${import.meta.env.VITE_API_HOST}/api/movie-picks/search`);
            url.searchParams.append('query', query);
            const response = await fetch(url, { credentials: 'include' });

            if (response.ok) {
                const data = await response.json();
                setSearchResults(data);
            } else {
                console.error('Failed to search movies:', await response.text());
                setSearchResults([]);
            }
        } catch (error) {
            console.error('Error:', error);
            setSearchResults([]);
        }
    };

    const handleMovieSelect = (index, movie) => {
        const newMovieChoices = [...movieChoices];
        newMovieChoices[index] = movie;
        setMovieChoices(newMovieChoices);
        setSearchResults([]);
        setActiveSearchIndex(null);
    };

    const handleSubmitAttendance = async () => {
        try {
            const attendeeResponse = await tryFetch(
                `${import.meta.env.VITE_API_HOST}/api/attendees/get-or-create`,
                {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        movie_nights_id: movieNightId,
                        user_id: userId,
                        host: false,
                    }),
                    credentials: 'include',
                }
            );

            if (attendeeResponse instanceof Error) {
                throw attendeeResponse;
            }

            const moviePicksToUpdate = movieChoices.filter(Boolean).map(movie => ({
                movies_id: movie.id,
            }));

            await tryFetch(
                `${import.meta.env.VITE_API_HOST}/api/movie-picks/attendee/${attendeeResponse.id}`,
                {
                    method: 'PUT',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(moviePicksToUpdate),
                    credentials: 'include',
                }
            );

            onClose();
            onSubmit(movieNightId);
        } catch (error) {
            console.error('Error submitting attendance:', error);
        }
    };

    if (!show) return null;

    return (
        <div className="modal" style={{ display: 'block', backgroundColor: 'rgba(0,0,0,0.5)' }} onClick={onClose}>
            <div className="modal-dialog" onClick={(e) => e.stopPropagation()}>
                <div className="modal-content">
                    <div className="modal-header">
                        <h5 className="modal-title">Make your picks!</h5>
                        <button type="button" className="close" onClick={onClose}>
                            <span>&times;</span>
                        </button>
                    </div>
                    <div className="modal-body">
                        {[0, 1, 2].map((index) => (
                            <div key={index} className="form-group mb-3">
                                <label>Movie Choice {index + 1}</label>
                                <input
                                    type="text"
                                    className="form-control"
                                    placeholder="Search for a movie"
                                    onChange={(e) => handleMovieSearch(e.target.value, index)}
                                    onFocus={() => setActiveSearchIndex(index)}
                                    value={movieChoices[index]?.title || ''}
                                />
                                {activeSearchIndex === index && searchResults.length > 0 && (
                                    <ul className="list-group mt-2">
                                        {searchResults.map((movie) => (
                                            <li
                                                key={movie.id}
                                                className="list-group-item"
                                                onClick={() => handleMovieSelect(index, movie)}
                                                style={{ cursor: 'pointer' }}
                                            >
                                                {movie.title}
                                            </li>
                                        ))}
                                    </ul>
                                )}
                            </div>
                        ))}
                    </div>
                    <div className="modal-footer">
                        <button type="button" className="btn btn-primary" onClick={handleSubmitAttendance}>
                            Attend
                        </button>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default MoviePickPopup
