import UserDetail from './UserDetail'
import UserMovies from './UserMovies'
import UserReviews from './UserReviews'
import useAuthService from '../hooks/useAuthService'
import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

import '../vanilla/user-profile.css'

export default function UserProfile() {
    const { user, isLoggedIn } = useAuthService()
    const navigate = useNavigate()

    useEffect(() => {
        if (!user || !isLoggedIn) navigate('/signin')
    }, [user, isLoggedIn, navigate])

    return (
        <div className="profile">
            <div className="user-profile-container">
                <div className="flex flex-row flex-wrap py-4">
                    <aside className="w-full sm:w-1/3 md:w-1/4 px-2">
                        <div className="sticky top-0 w-full">
                            <UserDetail />
                        </div>
                    </aside>
                    <section
                        role="main"
                        className="user-movies-reviews-container w-full sm:w-2/3 md:w-3/4 pt-1 px-2"
                    >
                        <UserMovies />
                        <UserReviews />
                    </section>
                </div>
            </div>
        </div>
    )
}
