import { useEffect, useState } from 'react'
import { Modal, Button } from 'antd'
import CreateMovieNightForm from './CreateMovieNightForm'
import { useNavigate } from 'react-router-dom'
import '../vanilla/movie-nights-list.css'


const API_HOST = import.meta.env.VITE_API_HOST
if (!API_HOST) {
    throw new Error('BASE_URL is not defined')
}

export default function MovieNightsList() {
    const [open, setOpen] = useState(false)
    const [movieNights, setMovieNights] = useState([])
    const navigate = useNavigate()

    const handleMovieNightClick = (movieNightId) => {
        navigate(`/movie-nights/${movieNightId}`)
    }

    const showModal = () => {
        setOpen(true)
    }

    const handleCancel = () => {
        setOpen(false)
    }
    const handleFormClose = () => {
        setOpen(false)
        fetchData()
    }
    const fetchData = async () => {
        const url = `${API_HOST}/api/movie-nights/`
        const response = await fetch(url)

        if (response.ok) {
            const data = await response.json()
            setMovieNights(data)
        }
    }
    useEffect(() => {
        fetchData()
    }, [])

    return (
        <>
            <div>
                <div className="d-flex justify-content-end align-items-center mb-3 mt-4">
                    <div className="col-3 p-3 mb-2 row">
                        <Button
                            type='primary'
                            onClick={showModal}>
                            Create a new movie night
                        </Button>
                        <Modal
                            open={open}
                            footer={null}
                            onCancel={handleCancel}
                        >
                            <CreateMovieNightForm onClose={handleFormClose} />
                        </Modal>
                    </div>
                </div>
                <div>
                    <table className="table table-dark table-hover table-sm">
                        <thead>
                            <tr>
                                <th>Movie Nights</th>
                                <th></th>
                            </tr>
                        </thead>
                        <tbody className="table-group-divider">
                            {movieNights.map((movieNight) => {
                                return (
                                    <tr
                                        key={movieNight.id}
                                        onClick={() =>
                                            handleMovieNightClick(movieNight.id)
                                        }
                                    >
                                        <td>{movieNight.name}</td>
                                        <td>{movieNight.date}</td>
                                    </tr>
                                )
                            })}
                        </tbody>
                    </table>
                </div>
            </div>
        </>
    )
}
