import { useEffect, useState } from 'react'
import MovieCard from './MovieCard'

import '../vanilla/movie-list.css'

const API_HOST = import.meta.env.VITE_API_HOST
if (!API_HOST) {
    throw new Error('BASE_URL is not defined')
}

function MovieList() {
    const [search, setSearch] = useState('')
    const [movies, setMovies] = useState([])
    const fetchData = async () => {
        const response = await fetch(`${API_HOST}/api/movies/`)
        if (response.ok) {
            const data = await response.json()
            setMovies(data)
        }
    }

    const searchHandler = (e) => {
        let upper = e.target.value.toUpperCase()
        setSearch(upper)
    }
    useEffect(() => {
        fetchData()
    }, [])
    return (
        <div className="main-containers">
            <h1 className="mv-list-title">Movies in our Database</h1>
            <div className="mv-list-searchbar-container">
                <form id="searchBar" className="mv-list-searchbar d-flex">
                    <input
                        onChange={searchHandler}
                        placeholder="Search By Title"
                        required
                        type="text"
                        name="title"
                        id="searchbar"
                        className="form-control search-term"
                    />
                </form>
            </div>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-5">
                {movies.map((movie) => {
                    if (search === '') {
                        return (
                            <MovieCard
                                key={movie.id}
                                movie={movie}
                                showdetailbutton={true}
                            />
                        )
                    } else if (movie.title.toUpperCase().includes(search)) {
                        return (
                            <MovieCard
                                key={movie.id}
                                movie={movie}
                                showdetailbutton={true}
                            />
                        )
                    }
                })}
            </div>
        </div>
    )
}

export default MovieList
