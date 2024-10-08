import { useState } from 'react'
import { Navigate, Link } from 'react-router-dom'

import useAuthService from '../hooks/useAuthService'
import '../vanilla/signup.css'

export default function SignInForm() {
    const [username, setUsername] = useState('')
    const [password, setPassword] = useState('')
    const [confirmedPassword, setConfirmedPassword] = useState('')
    const [passwordMismatch, setPasswordMismatch] = useState('')
    const { signup, user, error } = useAuthService()

    async function handleFormSubmit(e) {
        e.preventDefault()

        if (password === confirmedPassword) await signup({ username, password })
        else setPasswordMismatch('Passwords do not match')
    }

    if (user) {
        return <Navigate to="/" />
    }

    return (
        <div className="flex justify-center items-center h-[50vh] mt-44 main-containers su">
            <form
                onSubmit={handleFormSubmit}
                className="border-t-2 border-b-2 rounded-xl border-slate-500 py-10"
            >
                <div className="flex flex-col gap-3 px-20 py-10">
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
                            placeholder="Create a Username"
                            className="p-3 rounded text-black"
                            spellCheck="false"
                            minLength="4"
                        />
                        <input
                            type="password"
                            name="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="Create a Password"
                            className="p-3 rounded text-black"
                            spellCheck="false"
                        />
                        <input
                            type="password"
                            name="confirmedPassword"
                            value={confirmedPassword}
                            onChange={(e) =>
                                setConfirmedPassword(e.target.value)
                            }
                            placeholder="Confirm Password"
                            className="p-3 rounded text-black"
                        />
                    </div>
                    <button
                        type="submit"
                        className="border-2 rounded-md hover:bg-green-400 hover:text-white border-zinc-500 hover:border-green-600
                            transition-colors duration-200 h-12 mt-2"
                    >
                        Sign Up
                    </button>
                    {passwordMismatch && (
                        <div className="text-red-500 font-bold">
                            {passwordMismatch}
                        </div>
                    )}
                    <p className="mt-1">
                        Already have an account?{' '}
                        <Link
                            to="/signin"
                            className="text-white underline hover:text-zinc-500 transition-colors"
                        >
                            Sign In
                        </Link>
                    </p>
                </div>
            </form>
        </div>
    )
}
