import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import useAuthService from "../hooks/useAuthService";

const API_HOST = import.meta.env.VITE_API_HOST
if (!API_HOST) {
    throw new Error('BASE_URL is not defined')
}

export default function CreateMovieNightForm({onClose}) {
    const {user, isLoggedIn} = useAuthService()
    const [name, setName] = useState('')
    const [date, setDate] = useState('')
    const [in_person, setInPerson] = useState(false)
    const [location, setLocation] = useState("")
    const navigate = useNavigate();


    useEffect(() => {
      if (!isLoggedIn || !user) {
          navigate('/signin')
      }
  }, [isLoggedIn, user, navigate])

    async function handleSubmit(e) {
        e.preventDefault()
        const data = {
            name,
            date,
            in_person,
            location,
        }
        const movieNightUrl = `${API_HOST}/api/movie-nights/`;
        const fetchConfig = {
            credentials: "include",
            method: "POST",
            body: JSON.stringify(data),
            headers: {"Content-Type":"application/json"}
        };

        try {
            const response = await fetch(movieNightUrl, fetchConfig);
            if(response.ok) {
                const newMovieNight = await response.json();
                console.log(newMovieNight);
                setName("")
                setDate("")
                setInPerson(false)
                setLocation("")
                onClose()
                navigate('/movie-nights')

            } else {
                console.log(`Error: ${response.status} ${response.statusText}`)
            }

        }catch(error) {
            console.error("Fetch error", error);
        }
    }

    return (
        <div className="row">
      <div className="offset-3 col-6">
          <h1>Create a New Movie Night</h1>
          <form onSubmit={handleSubmit} id="create-movie-night-form">
            <div className="form-floating mb-3">
              <input
                placeholder="name"
                required
                type="text"
                name="name"
                id="name"
                className="form-control"
                onChange={(e) => setName(e.target.value)}
                value={name}
              />
              <label htmlFor="first_name">Name your Movie Night</label>
            </div>
            <div className="form-floating mb-3">
              <input
                placeholder="date"
                required
                type="date"
                name="date"
                id="date"
                className="form-control"
                onChange={(e) => setDate(e.target.value)}
                value={date}
              />
              <label htmlFor="date">Date</label>
            </div>
            <div className="form-check mb-3">
              <input
                placeholder="in_person"
                type="checkbox"
                name="in_person"
                id="in_person"
                className="form-check-input"
                onChange={() => setInPerson(!in_person)}
                checked={in_person}
              />
              <label className = "form-check-label" htmlFor="in_person">In Person?</label>
            </div>
            <div className="form-floating mb-3">
              <input
                placeholder="location"
                type="text"
                name="location"
                id="location"
                className="form-control"
                onChange={(e)=>setLocation(e.target.value)}
                value={location}
              />
              <label htmlFor="location">Location</label>
            </div>
            <button type="submit" className="btn btn-primary">Create</button>
          </form>
        </div>
      </div>
    )
}
