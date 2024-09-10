import { useState, useEffect } from 'react'
import './TierList.css'
import useAuthService from '../hooks/useAuthService'

const Draggable = ({ id, children, onDragStart, onDragEnd }) => {
    const [isDragging, setIsDragging] = useState(false)

    const handleDragStart = (e) => {
        e.dataTransfer.setData('text/plain', id)
        setIsDragging(true)
        e.dataTransfer.setDragImage(e.target, 0, 0)
        if (onDragStart) onDragStart(e)
    }

    const handleDragEnd = (e) => {
        setIsDragging(false)
        if (onDragEnd) onDragEnd(e)
    }

    return (
        <div
            draggable
            onDragStart={handleDragStart}
            onDragEnd={handleDragEnd}
            className={`draggable-item ${isDragging ? 'dragging' : ''}`}
            style={{ cursor: isDragging ? 'grabbing' : 'grab' }}
        >
            {children}
        </div>
    )
}

const DropZone = ({ id, onDrop, children }) => {
    const [isDragOver, setIsDragOver] = useState(false)

    const handleDragOver = (e) => {
        e.preventDefault()
        setIsDragOver(true)
    }

    const handleDrop = (e) => {
        e.preventDefault()
        const draggedId = e.dataTransfer.getData('text/plain')
        if (onDrop) onDrop(draggedId)
        setIsDragOver(false)
    }

    const handleDragLeave = (e) => {
        e.preventDefault()
        setIsDragOver(false)
    }

    return (
        <div
            onDragOver={handleDragOver}
            onDrop={handleDrop}
            onDragLeave={handleDragLeave}
            className={`drop-zone ${isDragOver ? 'drag-over' : ''}`}
        >
            {children}
        </div>
    )
}

const TierList = () => {
    const [tiers, setTiers] = useState({
        S: [],
        A: [],
        B: [],
        C: [],
        D: [],
        F: [],
    })
    const [movieCards, setMovieCards] = useState([])
    const [ratedItems, setRatedItems] = useState([])
    const [popularMovies, setPopularMovies] = useState([])
    const { user } = useAuthService()
    const [showConfetti, setShowConfetti] = useState(false)

    useEffect(() => {
        const fetchMoviesAndRatedItems = async () => {
            try {
                const [moviesResponse, ratedItemsResponse] = await Promise.all([
                    fetch('http://localhost:8000/api/movies/'),
                    fetch(
                        'http://localhost:8000/api/rated-items/with-movie-details'
                    ),
                ])

                if (!moviesResponse.ok || !ratedItemsResponse.ok) {
                    throw new Error('Failed to fetch data')
                }

                const moviesData = await moviesResponse.json()
                const ratedItemsData = await ratedItemsResponse.json()

                const ratedItemsWithDetails = ratedItemsData.map((item) => {
                    const movie = moviesData.find(
                        (movie) => movie.id === item.movie_id
                    )
                    return {
                        ...item,
                        ...movie,
                    }
                })

                setTiers({
                    S: [],
                    A: [],
                    B: [],
                    C: [],
                    D: [],
                    F: [],
                })
                setMovieCards(moviesData)
                setRatedItems(ratedItemsWithDetails)

                const popularMoviesResponse = await fetch(
                    'https://api.themoviedb.org/3/movie/popular?language=en-US&page=1',
                    {
                        method: 'GET',
                        headers: {
                            Authorization:
                                'Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiIyZDhhMTU1OTU5Y2MxY2Q1OWFkZWQ0OGVlMGRlOWRlZSIsIm5iZiI6MTcyNDY5MzEzMy45OTc5ODQsInN1YiI6IjY2YTk0NGFlY2UwOGNiNWNkOGEzNzJmYSIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.L_MryoRIFGkCGFaPIr9_7vpPYOt-m48tD3iROqUoKtc',
                            Accept: 'application/json',
                        },
                    }
                )

                if (!popularMoviesResponse.ok) {
                    throw new Error('Failed to fetch trending movies')
                }

                const popularMoviesData = await popularMoviesResponse.json()
                setPopularMovies(popularMoviesData.results)
            } catch (error) {
                console.error('Error fetching data:', error)
            }
        }

        fetchMoviesAndRatedItems()
    }, [])

    const updateTier = async (userId, movieId, newTier) => {
        try {
            const response = await fetch(
                `http://localhost:8000/api/rated-items/users/${userId}/movies/${movieId}`,
                {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        user_id: userId,
                        movie_id: movieId,
                        user_rating: 0,
                        review: '',
                        watched: true,
                        tier: newTier,
                    }),
                }
            )
            if (!response.ok) {
                const errorData = await response.json()
                console.error('Error response:', errorData)
                throw new Error('Failed to update tier')
            }
        } catch (error) {
            console.error('Error updating tier:', error)
        }
    }

    const onDrop = async (tierId, draggedId) => {
        if (!user) {
            console.error('User not authenticated')
            return
        }

        const draggedItem = [...ratedItems, ...popularMovies].find(
            (item) => item.id === Number(draggedId)
        )

        if (draggedItem) {
            setTiers((prevTiers) => {
                const updatedTiers = { ...prevTiers }

                Object.keys(updatedTiers).forEach((tier) => {
                    updatedTiers[tier] = updatedTiers[tier].filter(
                        (item) => item.id !== Number(draggedId)
                    )
                })

                const newTier = [...updatedTiers[tierId], draggedItem]
                return {
                    ...updatedTiers,
                    [tierId]: newTier,
                }
            })

            await updateTier(user.id, draggedItem.id, tierId)

            if (tierId === 'S') {
                setShowConfetti(true)
                setTimeout(() => setShowConfetti(false), 3000)
            }
        }
    }

    if (!user) return <p>Please log in to manage your tier list.</p>

    return (
        <div className="tierlist-container">
            {showConfetti && (
                <div className="confetti-container">
                    {[...Array(100)].map((_, index) => (
                        <div
                            key={index}
                            className={`confetti ${
                                ['red', 'green', 'blue', 'yellow'][index % 4]
                            }`}
                            style={{
                                left: `${Math.random() * 100}vw`,
                                top: `${Math.random() * 100}vh`,
                                animationDelay: `${Math.random() * 2}s`,
                                width: `${Math.random() * 10 + 5}px`,
                                height: `${Math.random() * 10 + 5}px`,
                            }}
                        />
                    ))}
                </div>
            )}

            <div className="tierlist-flex-container">
                {Object.entries(tiers).map(([tier, items]) => (
                    <DropZone
                        key={tier}
                        id={tier}
                        onDrop={(draggedId) => onDrop(tier, draggedId)}
                    >
                        <h2 className="tierlist-header">{tier} Tier</h2>
                        {items.map((movie) => (
                            <Draggable key={movie.id} id={movie.id}>
                                <div className="flex items-center">
                                    <img
                                        src={movie.image_url}
                                        alt={movie.title}
                                        style={{
                                            width: '100%',
                                            height: '100%',
                                        }}
                                    />
                                </div>
                            </Draggable>
                        ))}
                    </DropZone>
                ))}
            </div>

            <div className="available-movies">
                <h2 className="available-movies-header">Rated Movies</h2>
                <DropZone
                    id="movie-cards"
                    onDrop={(draggedId) => onDrop('S', draggedId)}
                >
                    {movieCards.map((movie) => (
                        <Draggable key={movie.id} id={movie.id}>
                            <div className="flex items-center">
                                <img
                                    src={movie.image_url}
                                    alt={movie.title}
                                    style={{ width: '100%', height: '100%' }}
                                />
                            </div>
                        </Draggable>
                    ))}
                </DropZone>
            </div>

            <div className="popular-movies">
                <h2 className="popular-movies-header">Trending Movies</h2>
                <DropZone
                    id="popular-movies"
                    onDrop={(draggedId) => onDrop('S', draggedId)}
                >
                    {popularMovies.map((movie) => (
                        <Draggable key={movie.id} id={movie.id}>
                            <div className="flex items-center">
                                <img
                                    src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
                                    alt={movie.title}
                                    style={{ width: '100%', height: '100%' }}
                                />
                            </div>
                        </Draggable>
                    ))}
                </DropZone>
            </div>
        </div>
    )
}

export default TierList
