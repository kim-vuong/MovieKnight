import { useState } from 'react'
import { Navigate, Link } from 'react-router-dom'

import useAuthService from '../hooks/useAuthService'
import '../vanilla/signup.css'

export default function SignInForm() {
    const [username, setUsername] = useState('')
    const [password, setPassword] = useState('')
    const { signup, user, error } = useAuthService()

    async function handleFormSubmit(e) {
        e.preventDefault()
        await signup({ username, password })
    }

    if (user) {
        return <Navigate to="/" />
    }

    return (
        <div className="flex justify-center items-center h-[50vh] mt-44 main-containers su">
            <form onSubmit={handleFormSubmit}>
                <div className="flex flex-col gap-3 border-5 px-20 py-10">
                    <div className="su-header">
                        <p className="text-sm">
                            Your Cinematic Adventure Awaits!
                        </p>
                        <p className="text-4xl fw-semibold -mt-2 text-white">
                            Sign Up to MovieKnight
                        </p>
                    </div>

                    {error && <div className="error">{error.message}</div>}

                    <div className="su-inputs flex flex-col gap-4">
                        <input
                            type="text"
                            name="username"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            placeholder="Enter Username"
                            className="p-3 rounded"
                        />
                        <input
                            type="text"
                            name="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="Enter Password"
                            className="p-3 rounded"
                        />
                    </div>
                    <button type="submit" className="border-4">
                        Sign Up
                    </button>
                    <p>
                        Already have an account?{' '}
                        <Link to="/signin" className="text-white underline">
                            Sign In
                        </Link>
                    </p>
                </div>
            </form>
        </div>
    )
}
