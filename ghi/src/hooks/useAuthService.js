import { useContext } from 'react'
import { AuthContext } from '../components/AuthProvider'
import { signin, signup, signout } from '../services/authService'

// This is a custom hook that lets us get access to
// the info stored in the AuthContext
export default function useAuthService() {
    const authContext = useContext(AuthContext)
    // This is a sanity check just in case someone
    // tries to use this hook outside of <AuthProvider>
    if (!authContext) {
        throw new Error('useAuthService has to be used within <AuthProvider>')
    }
    // Let's destructure the values from the authContext
    const {
        error,
        setError,
        user,
        setUser,
        isLoading,
        setIsLoading,
        isLoggedIn,
    } = authContext

    // This is what the hook returns
    return {
        setUser,
        user,
        setError,
        error,
        isLoading,
        isLoggedIn,
        // These inline functions exist so we can move
        // out fetch code into the authService module
        // They handle setting the state based
        // on if signup/signin/signout was successful or not
        signup: async (userData) => {
            const newUser = await signup(userData)
            // If newUser is an error, set the Error and just return
            if (newUser instanceof Error) {
                setError(newUser)
                setIsLoading(false)
                return
            }
            // Otherwise set the user
            setUser(newUser)
            setIsLoading(false)
        },
        signin: async (userData) => {
            const user = await signin(userData)
            if (user instanceof Error) {
                setError(user)
                setIsLoading(false)
                return
            }
            setUser(user)
            setIsLoading(false)
        },
        signout: async () => {
            await signout()
            setUser()
            setIsLoading(false)
        },
    }
}
