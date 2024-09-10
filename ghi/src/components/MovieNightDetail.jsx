import { useState, useEffect, useCallback } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import useAuthService from '../hooks/useAuthService'
import { tryFetch } from '../utils'
import GetRandomMoviePick from './RandomMoviePickButton'
import MoviePickPopup from './MoviePickPopup'

function MovieNightDetail() {
    const [movieNight, setMovieNight] = useState(null)
    const [attendees, setAttendees] = useState([])
    const [showMoviePickPopup, setShowMoviePickPopup] = useState(false)
    const { id } = useParams()
    const navigate = useNavigate()
    const { user, isLoggedIn } = useAuthService()

    const fetchAttendees = useCallback(async (movieNightId) => {
        try {
            const attendeesResponse = await tryFetch(
                `${import.meta.env.VITE_API_HOST}/api/attendees/movie-night/${movieNightId}`,
                { credentials: 'include' }
            );

            if (!(attendeesResponse instanceof Error)) {
                const attendeesWithPicks = await Promise.all(
                    attendeesResponse.map(async (attendee) => {
                        const picksResponse = await tryFetch(
                            `${import.meta.env.VITE_API_HOST}/api/movie-picks/attendee/${attendee.id}`,
                            { credentials: 'include' }
                        );
                        return {
                            ...attendee,
                            movie_picks: picksResponse instanceof Error ? [] : picksResponse
                        };
                    })
                );
                setAttendees(attendeesWithPicks);
            } else {
                console.error('Failed to fetch attendees:', attendeesResponse);
            }
        } catch (error) {
            console.error('Error:', error);
        }
    }, []);

    const fetchMovieNightDetails = useCallback(async () => {
        try {
            const response = await tryFetch(
                `${import.meta.env.VITE_API_HOST}/api/movie-nights/${id}`,
                { credentials: 'include' }
            )
            if (!(response instanceof Error)) {
                setMovieNight(response)
                fetchAttendees(response.id)
            } else {
                console.error('Error fetching movie night details:', response)
            }
        } catch (error) {
            console.error('Error:', error)
        }
    }, [id, fetchAttendees])

    useEffect(() => {
        if (!isLoggedIn || !user) {
            navigate('/signin')
        } else {
            fetchMovieNightDetails()
        }
    }, [isLoggedIn, user, navigate, fetchMovieNightDetails])

    const handleDeleteMovieNight = async () => {
        if (window.confirm('Are you sure you want to delete this movie night?')) {
            try {
                const response = await tryFetch(
                    `${import.meta.env.VITE_API_HOST}/api/movie-nights/${id}`,
                    {
                        method: 'DELETE',
                        credentials: 'include',
                    }
                )

                if (!(response instanceof Error)) {
                    navigate('/movie-nights')
                } else {
                    console.error('Failed to delete movie night:', response)
                }
            } catch (error) {
                console.error('Error:', error)
            }
        }
    }

    if (!movieNight) {
        return <div className="text-center mt-5">Loading...</div>
    }

    return (
        <div className="container mt-5">
            <h1 className="mb-4">{movieNight.name}</h1>
            <GetRandomMoviePick movieNightId={movieNight.id} />
            <p>Date: {new Date(movieNight.date).toLocaleDateString()}</p>
            <p>Location: {movieNight.location}</p>
            <p>In Person: {movieNight.in_person ? 'Yes' : 'No'}</p>

            <h2 className="mt-4 mb-3">Attendees and Movie Picks</h2>
            <table className="table table-striped">
                <thead>
                    <tr>
                        <th>Attendee</th>
                        <th>Pick 1</th>
                        <th>Pick 2</th>
                        <th>Pick 3</th>
                    </tr>
                </thead>
                <tbody>
                    {attendees.map((attendee) => (
                        <tr key={attendee.id}>
                            <td>{attendee.username}</td>
                            {[0, 1, 2].map((index) => (
                                <td key={index}>
                                    {attendee.movie_picks[index]?.movie_title || '-'}
                                </td>
                            ))}
                        </tr>
                    ))}
                </tbody>
            </table>

            <button className="btn btn-primary mt-3" onClick={() => setShowMoviePickPopup(true)}>
                Attend
            </button>

            {isLoggedIn && (
                <button
                    className="btn btn-danger mt-3 ml-3"
                    onClick={handleDeleteMovieNight}
                >
                    Delete Movie Night
                </button>
            )}

            <MoviePickPopup
                show={showMoviePickPopup}
                onClose={() => setShowMoviePickPopup(false)}
                onSubmit={fetchAttendees}
                movieNightId={movieNight.id}
                userId={user.id}
            />
        </div>
    )
}

export default MovieNightDetail
