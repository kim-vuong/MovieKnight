import { useState } from 'react'
import { Navigate } from 'react-router-dom'

import useAuthService from '../hooks/useAuthService'

export default function SignInForm() {
    const [username, setUsername] = useState('')
    const [password, setPassword] = useState('')
    const { signin, user, error } = useAuthService()

    async function handleFormSubmit(e) {
        e.preventDefault()
        await signin({ username, password })
    }

    if (user) {
        return <Navigate to="/" />
    }

    return (
        <form onSubmit={handleFormSubmit}>
            {error && <div className="error">{error.message}</div>}

            <input
                type="text"
                name="username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Enter Username"
            />
            <input
                type="text"
                name="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter Password"
            />
            <button type="submit">Sign In</button>
        </form>
    )
}
