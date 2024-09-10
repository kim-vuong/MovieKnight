import { useState, useEffect } from 'react'
import './TierList.css'
import useAuthService from '../hooks/useAuthService'

const DisplayItem = ({ image_url }) => (
    <div className="draggable-item">
        <img
            src={image_url}
            alt="Movie Poster"
            style={{
                width: '100%',
                height: '100%',
                objectFit: 'cover',
                borderRadius: '8px',
            }}
        />
    </div>
)

const DisplayTierList = () => {
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
                    `http://localhost:8000/api/rated-items/users/${user.id}/with-movie-details`
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

    if (!user) return <p>Please log in to view your tier list.</p>

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
                    <div key={tier} className="drop-zone">
                        <h2 className="tierlist-header">
                            {tier === 'Z' ? 'Not Tiered' : `${tier} Tier`}
                        </h2>
                        {items.map((movie) => (
                            <DisplayItem
                                key={movie.id}
                                image_url={movie.image_url}
                            />
                        ))}
                    </div>
                ))}
            </div>
        </div>
    )
}

export default DisplayTierList
