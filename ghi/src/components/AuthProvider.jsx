import { createContext, useEffect, useState } from 'react'
import { authenticate } from '../services/authService'

export const AuthContext = createContext(null)

export default function AuthProvider({ children }) {
    const [user, setUser] = useState()
    const [error, setError] = useState()
    const [isLoading, setIsLoading] = useState(true)

    // This calls our backend once when this component
    // renders to populate the user information
    // If the user is logged in
    useEffect(() => {
        authenticate().then((result) => {
            // If authenticate returns an error,
            // Set the user to undefined
            if (result instanceof Error) {
                setUser(undefined)
                setIsLoading(false)
                return
            }
            // Otherwise, set the user to the result we got from the backend
            setUser(result)
            setIsLoading(false)
        })
    }, [])

    return (
        <AuthContext.Provider
            value={{
                user,
                setUser,
                isLoading,
                setIsLoading,
                error,
                setError,
                // This is a helper property you can check in components
                // to determine if a user is logged in or not
                isLoggedIn: user ? true : false,
            }}
        >
            {isLoading ? <div>loading...</div> : children}
        </AuthContext.Provider>
    )
}
