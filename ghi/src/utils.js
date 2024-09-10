const API_HOST = import.meta.env.VITE_API_HOST
if (!API_HOST) {
    throw new Error('VITE_API_HOST is not defined')
}

/** This helper function wraps itself around fetch
 *  And converts thrown errors into returned errors.
 */
export async function tryFetch(url, options) {
    // Wrap everything in a try catch
    try {
        const response = await fetch(url, options)
        // Check for non-200 response codes and throw an error about the response
        if (!response.ok) {
            // We can throw here because our catch will return it
            throw new Error(
                `Fetch Error - ${response.status} - ${response.statusText}`
            )
        }
        const data = await response.json()
        // If everything went well, we return the JSON parsed Data here
        return data
    } catch (e) {
        if (e instanceof Error) {
            // This is where we return any errors instead of throwing them
            return e
        }
        return new Error('Unknown error while fetching')
    }
}

// Reusable functions for Movies / Rated Items

export const checkForExistingRI = async (userId, movieId) => {
    const ratedItemUrl = `${API_HOST}/api/rated-items/exists/users/${userId}/movies/${movieId}`
    const response = await tryFetch(ratedItemUrl)
    if (response instanceof Error) return null
    return response.exists
}

export const getRatedItemDetails = async (userId, movieId) => {
    const ratedItemUrl = `${API_HOST}/api/rated-items/users/${userId}/movies/${movieId}`
    const response = await tryFetch(ratedItemUrl)
    if (response instanceof Error) return null
    return response
}

export const handleAddToWatchLater = async (event, user, movie) => {
    event.preventDefault()
    let postBody = {
        user_id: user.id,
        movie_id: movie.id,
        user_rating: 0,
        review: '',
        watched: false,
        tier: 'Z',
    }

    postBody.user_id = user.id
    postBody.movie_id = movie.id

    const existingRI = await checkForExistingRI(user.id, movie.id)

    const config = {
        method: existingRI ? 'PUT' : 'POST',
        body: JSON.stringify(postBody),
        headers: {
            'Content-Type': 'application/json',
        },
    }

    try {
        const response = await fetch(
            existingRI
                ? `${API_HOST}/api/rated-items/users/${user.id}/movies/${movie.id}`
                : `${API_HOST}/api/rated-items`,
            config
        )
        if (response.ok) return // navigate('/profile')
    } catch (e) {
        console.error(`Error: ${e}`)
    }
}

export const handleAddToWatched = async (event, user, movie) => {
    event.preventDefault()
    const postUrl = `${API_HOST}/api/rated-items`
    let postBody = {
        user_id: user.id,
        movie_id: movie.id,
        user_rating: 0,
        review: '',
        watched: true,
        tier: 'Z',
    }

    postBody.user_id = user.id
    postBody.movie_id = movie.id

    const existingRI = await checkForExistingRI(user.id, movie.id)

    if (existingRI) {
        const ratedItemDetails = await getRatedItemDetails(user.id, movie.id)

        if (ratedItemDetails.watched) {
            // navigate('/profile')
            return
        }

        const updateUrl = `${API_HOST}/api/rated-items/users/${user.id}/movies/${movie.id}`
        const updateResponse = await tryFetch(updateUrl, {
            method: 'PUT',
            body: JSON.stringify(postBody),
            headers: { 'Content-Type': 'application/json' },
        })

        if (updateResponse instanceof Error) {
            console.error(`Failed to update Movie: ${movie.id}`)
        } else {
            // navigate('/profile')
            return
        }
    } else {
        const response = await tryFetch(postUrl, {
            method: 'POST',
            body: JSON.stringify(postBody),
            headers: { 'Content-Type': 'application/json' },
        })

        if (response instanceof Error) {
            console.error(
                `Failed to add Movie: ${movie.id} to watched list: ${response.message}`
            )
        } else return // navigate('/profile')
    }
}
