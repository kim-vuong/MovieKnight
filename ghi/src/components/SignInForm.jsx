import { useState } from 'react'
import { Navigate, Link, useNavigate } from 'react-router-dom'

import useAuthService from '../hooks/useAuthService'
import '../vanilla/signup.css'

export default function SignInForm() {
    const [username, setUsername] = useState('')
    const [password, setPassword] = useState('')
    const [passwordMismatch, setPasswordMismatch] = useState('')
    const { signin, user, error } = useAuthService()
    const navigate = useNavigate()

    async function handleFormSubmit(e) {
        e.preventDefault()

        if (!username || !password) {
            setPasswordMismatch('Please enter both username and password')
            return
        }

        const result = await signin({ username, password })
        navigate('/profile')

        {
            result.error
                ? setPasswordMismatch('Incorrect Credentials. Please try again')
                : setPasswordMismatch('')
        }
    }

    if (user) {
        return <Navigate to="/" />
    }

    return (
        <div className="flex justify-center items-center h-[50vh] mt-44 main-containers si">
            <form
                onSubmit={handleFormSubmit}
                className="border-t-2 border-b-2 rounded-xl border-slate-500 py-8 px-20"
            >
                <div className="flex flex-col gap-3 px-20 py-4">
                    <div className="si-header flex flex-col items-center">
                        <p className="text-sm">Welcome Back Knight!</p>
                        <p className="text-4xl fw-semibold -mt-2 text-white">
                            Login
                        </p>
                    </div>
                </div>

                <div className="si-inputs flex flex-col gap-4 -mt-6">
                    <input
                        type="text"
                        name="username"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        placeholder="Enter Username"
                        className="p-3 rounded text-black"
                    />
                    <input
                        type="password"
                        name="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="Enter Password"
                        className="p-3 rounded text-black"
                    />
                    <button
                        type="submit"
                        className="border-2 rounded-md hover:bg-green-400 hover:text-white border-zinc-500 hover:border-green-600
                            transition-colors duration-200 h-12 -mt-1"
                    >
                        Sign In
                    </button>
                    {!user && (
                        <div className="error text-red-500 font-bold">
                            {passwordMismatch}
                        </div>
                    )}
                    <p className="-mt-2">
                        Don't have an account?{' '}
                        <Link
                            to="/signup"
                            className="text-white underline hover:text-zinc-500 transition-colors"
                        >
                            Sign up now
                        </Link>
                    </p>
                </div>
            </form>
        </div>
    )
}
