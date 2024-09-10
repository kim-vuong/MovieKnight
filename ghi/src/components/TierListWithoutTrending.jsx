import { useState, useEffect } from 'react'
import './TierList.css'
import useAuthService from '../hooks/useAuthService'

const API_HOST = import.meta.env.VITE_API_HOST
if (!API_HOST) {
    throw new Error('VITE_API_HOST is not defined')
}

const postURL = `${API_HOST}/api/rated-items/`

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

const TierListWithoutTrending = () => {
    const [tiers, setTiers] = useState({
        S: [],
        A: [],
        B: [],
        C: [],
        D: [],
        F: [],
        Z: [],
    })
    const [ratedItems, setRatedItems] = useState([])
    const { user } = useAuthService()
    const [showConfetti, setShowConfetti] = useState(false)

    useEffect(() => {
        const fetchRatedItems = async () => {
            if (!user) return

            try {
                const response = await fetch(
                    `${API_HOST}/api/rated-items/users/${user.id}/with-movie-details`
                )

                if (!response.ok) {
                    throw new Error('Failed to fetch data')
                }

                const ratedItemsData = await response.json()

                const initialTiers = {
                    S: [],
                    A: [],
                    B: [],
                    C: [],
                    D: [],
                    F: [],
                    Z: [],
                }

                const formattedRatedItems = ratedItemsData.map((item) => ({
                    id: item.movie_id,
                    title: item.movie_title,
                    image_url: item.movie_image_url,
                    tier: item.tier,
                }))

                formattedRatedItems.forEach((item) => {
                    initialTiers[item.tier] = [...initialTiers[item.tier], item]
                })

                setRatedItems(formattedRatedItems)
                setTiers(initialTiers)
            } catch (error) {
                console.error('Error fetching data:', error)
            }
        }

        fetchRatedItems()
    }, [user])

    const updateTier = async (userId, movieId, newTier) => {
        try {
            const fetchResponse = await fetch(
                `${API_HOST}/api/rated-items/users/${userId}/movies/${movieId}`
            )

            if (!fetchResponse.ok) {
                const errorData = await fetchResponse.json()
                console.error('Error fetching rated item:', errorData)
                throw new Error('Failed to fetch rated item')
            }

            const ratedItem = await fetchResponse.json()

            const updatedRatedItem = {
                ...ratedItem,
                tier: newTier,
            }

            const updateResponse = await fetch(
                `${API_HOST}/api/rated-items/users/${userId}/movies/${movieId}`,
                {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(updatedRatedItem),
                }
            )

            if (!updateResponse.ok) {
                const errorData = await updateResponse.json()
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

        const draggedItem = ratedItems.find(
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
                setTimeout(() => setShowConfetti(false), 5000)
            }
        }
    }

    if (!user) return <p>Please log in to manage your tier list.</p>

    return (
        <div className="tierlist-container">
            {showConfetti && (
                <div className="confetti-container">
                    {[...Array(200)].map((_, index) => (
                        <div
                            key={index}
                            className={`confetti ${
                                ['red', 'green', 'blue', 'yellow'][index % 4]
                            }`}
                            style={{
                                left: `${Math.random() * 100}vw`,
                                top: `${Math.random() * 100}vh`,
                                animationDelay: `${Math.random() * 2}s`,
                                width: `${Math.random() * 15 + 10}px`,
                                height: `${Math.random() * 15 + 10}px`,
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
                        <h2 className="tierlist-header">
                            {tier === 'Z' ? 'Not Tiered' : `${tier} Tier`}
                        </h2>
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
                    {ratedItems.map((movie) => (
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
        </div>
    )
}

export default TierListWithoutTrending
