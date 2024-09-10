# MovieKnight API endpoints

## Movies

### Search TMDB for movies

-   Endpoint path: `/movies/search`
-   Endpoint method: GET
-   Query Required: "string"
-   Response: a list of all movie objects
-   Response shape (JSON):

```json
{
    "movies": [
        {
            "title": string,
            "image_url": string,
            "tagline": string,
            "synopsis": string,
            "release_date": date,
            "runtime": int,
            "tmdb_id": int,
            "genres": [
                {
                    "id": int,
                    "tmdb_id": int,
                    "name": string
                }
            ]
        }
    ]
}
```

### Get list of movies

-   Endpoint path: `/movies`
-   Endpoint method: GET
-   Response: a list of all movie objects
-   Response shape (JSON):

```json
{
    [
        {
            "id": int,
            "title": string,
            "image_url": string,
            "tagline": string,
            "synopsis": string,
            "release_date": date,
            "runtime": int,
            "tmdb_id": int,
            "genres": [
                {
                    "id": int,
                    "tmdb_id": int,
                    "name": string
                }
            ]
        }
    ]
}
```

### POST a new movie

-   Endpoint path: `/movies`
-   Endpoint method: POST
-   Request shape (JSON):

```json
{
    "title": string,
    "image_url": string,
    "tagline": string,
    "synopsis": string,
    "release_date": date,
    "runtime": int,
    "tmdb_id": int,
    "genres": [
        {
            "id": int,
            "tmdb_id": int,
            "name": string
        }
    ]
}
```

-   Response: a message detailing the success or failure of the post
-   Response shape (JSON):

```json
{
    "title": string,
    "image_url": string,
    "tagline": string,
    "synopsis": string,
    "release_date": date,
    "runtime": int,
    "tmdb_id": int,
    "genres": [
        {
            "id": int,
            "tmdb_id": int,
            "name": string
        }
    ]
}
```

### Get all the details for one movie

-   Endpoint path: `/movie/<int:pk>`
-   Endpoint method: GET
-   Response: all details for one movie object selected by ID
-   Response shape (JSON):

```json
{
    "id": int,
    "title": string,
    "image_url": string,
    "tagline": string,
    "synopsis": string,
    "release_date": date,
    "runtime": int,
    "tmdb_id": int,
    "genres": [
        {
            "id": int,
            "tmdb_id": int,
            "name": string
        }
    ]
}
```

### Delete Movie

-   Endpoint path: `/movie/<int:pk>`
-   Endpoint method: DELETE
-   Response: a message detailing the success or failure of the delete operation
-   Response shape (JSON):

```json
{
  "movie_id": int,
  "message": string
}
```

### Get A Movie's Genres

-   Endpoint path: `/movie/<int:pk>/genres`
-   Endpoint method: GET
-   Response: Json representing a movie and its genres
-   Response shape (JSON):

```json
{
    "movie_id": int,
    "title": string,
    "genres": [
        string
    ]
}
```

## Genres

### Get all genres

-   Endpoint path: `/genres`
-   Endpoint method: GET
-   Response: a list of all genre objects
-   Response shape (JSON):

```json
{
    [
        {
            "id" : int,
            "tmdb_id" : int,
            "name" : string
        }
    ]
}
```

## Users

### Get the Details for all users

-   Endpoint path: `/users`
-   Endpoint method: GET
-   Response: the details for all user objects
-   Response shape (JSON):

```json
{
    [
        "id": int,
        "username": string,
        "picture_url": string
    ]
}
```

### Get the Details for one user

-   Endpoint path: `/users/<int:pk>`
-   Endpoint method: GET
-   Response: the details for one user object
-   Response shape (JSON):

```json
{
    "id": int,
    "username": string,
    "picture_url": string
}
```

### Post a new user

-   Endpoint path: `/auth/signup`
-   Endpoint method: POST
-   Request shape (JSON):

```json
{
    "username": string,
    "password": string,
    "picture_url": string
}
```

-   Response: the newly created user
-   Response shape (JSON):

```json
{
    "id": int,
    "username": string,
    "picture_url": string
}
```

### Update User

-   Endpoint path: `/users/update`
-   Endpoint method: PUT
-   Request shape (JSON):

```json
{
  "username": string,
  "password": string,
  "picture_url": string
}
```

-   Response: the new username and/or avatar image for the user
-   Response shape (JSON):

```json
{
    "id": int,
    "username": string,
    "picture_url": string
}
```

### Delete User

-   Endpoint path: `/users/<int:pk>`
-   Endpoint method: DELETE
-   Response: a message detailing the success or failure of the delete operation
-   Response shape (JSON):

```json
{
  "user_id": int,
  "message": boolean
}
```

### User Signin

-   Endpoint path: `/auth/signin`
-   Endpoint method: POST
-   Request shape (JSON):

```json
{
    "username": string,
    "password": string,
}
```

-   Response: the newly signed in user
-   Response shape (JSON):

```json
{
    "id": int,
    "username": string,
    "picture_url": string
}
```

### Authenticate a user is logged in

-   Endpoint path: `/auth/authenticate`
-   Endpoint method: GET
-   Response: the details for the signed in user
-   Response shape (JSON):

```json
{
    "id": int,
    "username": string,
    "picture_url": string
}
```

-   if there is no logged in user

```json
{
    "detail": "Not logged in"
}
```

### Sign out the user

-   Endpoint path: `/auth/signout`
-   Endpoint method: DELETE
-   Response: a message detailing the success or failure of the delete operation
-   Response shape (JSON):

```json
{
    null
}
```

## Rated

### List of all rated items

-   Endpoint path: `/rated-items`
-   Endpoint method: GET
-   Response: a list of all rated items
-   Response shape (JSON):

```json
{
    [
        {
            "user_id": int,
            "movie_id": int,
            "user_rating": int,
            "review": string,
            "watched": boolean,
            "tier": string,
            "id": int
        }
    ]
}
```

### List of one users rated items

-   Endpoint path: `/rated-items/users/<ink:pk>`
-   Endpoint method: GET
-   Response: a list of one users rated items rated items
-   Response shape (JSON):

```json
{
    [
        {
            "user_id": int,
            "movie_id": int,
            "user_rating": int,
            "review": string,
            "watched": boolean,
            "tier": string,
            "id": int
        }
    ]
}
```

### Post a new rated item

-   Endpoint path: `/rated-items`
-   Endpoint method: POST
-   Request shape (JSON):

```json
{
    "user_id": int,
    "movie_id": int,
    "user_rating": int(OPTIONAL),
    "review": string(OPTIONAL),
    "watched": boolean,
    "tier": string
}
```

-   Response: The newly created rated item
-   Response shape (JSON):

```json
{
    "user_id": int,
    "movie_id": int,
    "user_rating": int(OPTIONAL),
    "review": string(OPTIONAL),
    "watched": boolean,
    "tier": string
}
```

### Get a single rated item

-   Endpoint path: `/rated-items/users/<int:pk>/movies/<int:pk>`
-   Endpoint method: get
-   Response: A single rated item
-   Response shape (JSON):

```json
{
    "user_id": int,
    "movie_id": int,
    "user_rating": int(OPTIONAL),
    "review": string(OPTIONAL),
    "watched": boolean,
    "tier": string
}
```

### Edit the rating and/or review of a rated item

-   Endpoint path: `/rated-items/users/<int:pk>/movies/<int:pk>`
-   Endpoint method: PUT
-   Request shape (JSON):

```json
{
    "user_id": int,
    "movie_id": int,
    "user_rating": int(OPTIONAL),
    "review": string(OPTIONAL),
    "watched": boolean,
    "tier": string
}
```

-   Response: The newly updated rated item
-   Response shape (JSON):

```json
{
    "user_id": int,
    "movie_id": int,
    "user_rating": int(OPTIONAL),
    "review": string(OPTIONAL),
    "watched": boolean,
    "tier": string
}
```

### Delete rated item

-   Endpoint path: `/rated-items/users/<int:pk>/movies/<int:pk>`
-   Endpoint method: DELETE
-   Response: a message detailing the success or failure of the delete operation
-   Response shape (JSON):

```json
{
    boolean
}
```

### Get a single rated item

-   Endpoint path: `/rated-items/with-movie-details`
-   Endpoint method: get
-   Response: A single rated item with its movie details
-   Response shape (JSON):

```json
{
    "user_id": int,
    "movie_id": int,
    "user_rating": int(OPTIONAL),
    "review": string(OPTIONAL),
    "watched": boolean,
    "tier": string,
    "movie_title" : string,
    "movie_image_url" : string
}
```

### Check the existence of a user's rated item

-   Endpoint path: `/rated-items/exists/users/<int:pk>/movies/<int:pk>`
-   Endpoint method: get
-   Response: A boolean value indicating whether a rated item exists for a user
-   Response shape (JSON):

```json
{
    "exists": boolean
}
```

## Movie nights

### get a list of all movie night objects

-   Endpoint path: `/movie-nights`
-   Endpoint method: GET
-   Response shape (JSON):

```json
{
    [
        {
            "id": int,
            "name": string,
            "date": date,
            "in_person": boolean,
            "location": string
        }
    ]
}
```

### Post a new movie night object

-   Endpoint path: `/movie-nights`
-   Endpoint method: POST
-   Request shape (JSON):

```json
{
    "name": string,
    "date": date,
    "in_person": boolean,
    "location": string
}
```

-   Response: the newly created movie night object
-   Response shape (JSON):

```json
{
    "id": int,
    "name": string,
    "date": date,
    "in_person": boolean,
    "location": string
}
```

### Get a single movie night object

-   Endpoint path: `/movie-nights/<int:pk>`
-   Endpoint method: GET
-   Response shape (JSON):

```json
{
    "id": int,
    "name": string,
    "date": date,
    "in_person": boolean,
    "location": string
}
```

### Update a single movie night object

-   Endpoint path: `/movie-nights/<int:pk>`
-   Endpoint method: PUT
-   Request shape (JSON):

```json
{
    "name": string,
    "date": date,
    "in_person": boolean,
    "location": string
}
```

-   Response: the newly update movie night object
-   Response shape (JSON):

```json
{
    "id": int,
    "name": string,
    "date": date,
    "in_person": boolean,
    "location": string
}
```

### Delete a single movie night object

-   Endpoint path: `/movie-nights/<int:pk>`
-   Endpoint method: DELETE
-   Response: the newly update movie night object
-   Response shape (JSON):

```json
{
    "movie_night_id": int,
    "message": string
}
```

## Attendees

### Get All Attendees

-   Endpoint path: `/attendees/`
-   Endpoint method: GET
-   Response: A liist of all attendees
-   Response shape (JSON):

```json
[
  {
    "id": int,
    "movie_nights_id": int,
    "user_id": int,
    "host": bool
  }
]
```

### Get Attendee

-   Endpoint path: `/api/attendees/{attendee_id}`
-   Endpoint method: GET
-   Response: Details of a specific attendee
-   Response shape (JSON):

```json
{
  "id": int,
  "movie_night_name": string,
  "username": string,
  "host": bool
}
```

### Create Attendee

-   Endpoint path: `/api/attendees/`
-   Endpoint method: POST
-   Request shape (JSON):

```json
{
  "movie_nights_id": int,
  "user_id": int,
  "host": bool
}
```

-   Response: The created attendee
-   Response shape (JSON):

```json
{
  "id": int,
  "movie_nights_id": int,
  "user_id": int,
  "host": bool
}
```

### Update Attendee

-   Endpoint path: `/api/attendees/{attendee_id}`
-   Endpoint method: PUT
-   Request shape (JSON):

```json
{
  "host": bool
}
```

- Response: The updated attendee
- Response shape (JSON):

```json
{
  "id": int,
  "movie_nights_id": int,
  "user_id": int,
  "host": bool
}
```

### Delete Attendee

-   Endpoint path: `/api/attendees/{attendee_id}`
-   Endpoint method: DELETE
-   Response: A message confirming delete
-   Response shape (JSON):

```json
{
  "message": string
}
```

### Get Attendees for Movie Night

-   Endpoint path: `/api/attendees/movie-night/{movie_night_id}`
-   Endpoint method: GET
-   Response: A list of attendees for the specified movie night
-   Response shape (JSON):

```json
[
  {
    "id": int,
    "movie_night_name": string,
    "username": string,
    "host": bool
  }
]
```

### Get or Create Attendee

-   Endpoint path: `/api/attendees/get-or-create`
-   Endpoint method: POST
-   Request shape (JSON):

```json
{
  "movie_nights_id": int,
  "user_id": int,
  "host": bool
}
```

-   Response: The existing or newly created attendee
-   Response shape (JSON):

```json
{
  "id": int,
  "movie_nights_id": int,
  "user_id": int,
  "host": bool
}
```

## Movie Picks

### Search Movies

-   Endpoint path: `/api/movie-picks/search`
-   Endpoint method: GET
-   Query parameters: `query` (string, required)
-   Response: A list of movie search results
-   Response shape (JSON):

```json
{
"id": int,
"title": string
}
```

### Get All Movie Picks

-   Endpoint path: `/api/movie-picks/`
-   Endpoint method: GET
-   Response: A list of all movie picks with details
-   Response shape (JSON):

```json
[
  {
    "id": int,
    "movie_title": string,
    "attendees_id": int,
    "user_id": int,
    "username": string,
    "movie_night_name": string,
    "movie_night_date": string
  }
]
```

### Get Movie Picks for Attendee

-   Endpoint path: `/api/movie-picks/attendee/{attendee_id}`
-   Endpoint method: GET
-   Response: A list of movie picks for the specific attendee
-   Response shape (JSON):

```json
[
  {
    "id": int,
    "movie_title": string,
    "movie_id": int
  }
]
```

### Create Movie Pick

-   Endpoint path: `/api/movie-picks/`
-   Endpoint method: POST
-   Request shape (JSON):

```json
{
  "movies_id": int,
  "attendees_id": int
}
```

-   Response: The created movie pick
-   Response shape (JSON):

```json
{
  "id": int,
  "movie_title": string,
  "movie_id": int
}
```

### Get Random Movie Pick

-   Endpoint path: `/api/movie-picks/random/{movie_nights_id}`
-   Endpoint method: GET
-   Response: A random movie pick for the specific movie night
-   Response shape (JSON):

```json
{
  "title": string
}
```

### Delete Movie Picks for Attendee

-   Endpoint path: `/api/movie-picks/attendee/{attendee_id}`
-   Endpoint method: DELETE
-   Response: A message confirming delete
-   Response shape (JSON):

```json
{
  "message": string
}
```

### Update Movie Picks for Attendee

-   Endpoint path: `/api/movie-picks/attendee/{attendee_id}`
-   Endpoint method: PUT
-   Request shape (JSON):

```json
[
  {
    "movies_id": int
  }
]
```

-   Response: The updated list of movie picks for the attendee
-   Response shape (JSON):

```json
[
  {
    "id": int,
    "movie_title": string,
    "movie_id": int
  }
]
```

<!-- small change -->
