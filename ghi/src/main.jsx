import React from 'react'
import ReactDOM from 'react-dom/client'
import { RouterProvider, createBrowserRouter } from 'react-router-dom'
import App from './App'
import SignInForm from './components/SignInForm'
import SignUpForm from './components/SignUpForm'
import AuthProvider from './components/AuthProvider'
import MovieDetail from './components/MovieDetail'
import MovieList from './components/MovieList'
import MovieSearch from './components/MovieSearch'
import MovieReviewForm from './components/MovieReviewForm'
import CreateMovieNightForm from './components/CreateMovieNightForm'
import MovieNightsList from './components/MovieNightsList'
import UserProfile from './components/UserProfile'
import TierListWithoutTrending from './components/TierListWithoutTrending'
import MovieNightDetail from './components/MovieNightDetail'
import DisplayTierList from './components/DisplayTierList'
import GetRandomMoviePick from './components/RandomMoviePickButton'
import LandingPage from './components/LandingPage'

import './index.css'
import 'antd/dist/reset.css'

const BASE_URL = import.meta.env.BASE_URL
if (!BASE_URL) {
    throw new Error('BASE_URL is not defined')
}

const router = createBrowserRouter(
    [
        {
            path: '/',
            element: <App />,
            children: [
                {
                    index: true,
                    element: <LandingPage />,
                },
                {
                    path: 'signup',
                    element: <SignUpForm />,
                },
                {
                    path: 'signin',
                    element: <SignInForm />,
                },
                {
                    path: '/movies/:pk',
                    element: <MovieDetail />,
                },
                {
                    path: '/movies',
                    element: <MovieList />,
                },
                {
                    path: '/movies/search',
                    element: <MovieSearch />,
                },
                {
                    path: '/movie-nights',
                    element: <MovieNightsList />,
                },
                {
                    path: '/create-movie-night',
                    element: <CreateMovieNightForm />,
                },
                {
                    path: '/movies/:pk/review/',
                    element: <MovieReviewForm />,
                },
                {
                    path: '/profile',
                    element: <UserProfile />,
                },
                {
                    path: '/tierlist',
                    element: <TierListWithoutTrending />,
                },
                {
                    path: '/movie-nights/:id',
                    element: <MovieNightDetail />,
                },
                {
                    path: '/displaytierlist',
                    element: <DisplayTierList />,
                },
                {
                    path: '/random-pick',
                    element: <GetRandomMoviePick />,
                },
            ],
        },
    ],
    {
        basename: BASE_URL,
    }
)

const rootElement = document.getElementById('root')
if (!rootElement) {
    throw new Error('root element was not found!')
}

// Log out the environment variables while you are developing and deploying
// This will help debug things
console.table(import.meta.env)

const root = ReactDOM.createRoot(rootElement)
root.render(
    <React.StrictMode>
        <AuthProvider>
            <RouterProvider router={router} />
        </AuthProvider>
    </React.StrictMode>
)
