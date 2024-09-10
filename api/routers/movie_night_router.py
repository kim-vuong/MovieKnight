from fastapi import Depends, APIRouter, HTTPException, status
from queries.movie_night_queries import (
    MovieNightQueries,
    MovieNightDataBaseError,
    MovieNightDoesNotExist,
    MovieNightCreationError,
    DatabaseURLException,
)

from models.movie_nights import (
    MovieNight,
    MovieNightRequest,
    MovieNightDeleteResponse,
)

from models.users import UserResponse
from utils.authentication import try_get_jwt_user_data


router = APIRouter(tags=["Movie Nights"], prefix="/api/movie-nights")


@router.get("/")
def all_movie_nights(
    queries: MovieNightQueries = Depends(),
) -> list[MovieNight] | None:
    """
    Gets a list of all movie nights from the database
    """
    try:
        movie_nights = queries.get_all_movie_nights()
        return movie_nights
    except MovieNightDataBaseError as e:
        print(e)
        raise HTTPException(
            status_code=400,
            detail="Database error trying to fetch list of movie nights",
        )


@router.post("/")
def create_movie_night(
    movie_night: MovieNightRequest,
    queries: MovieNightQueries = Depends(),
    user: UserResponse | None = Depends(try_get_jwt_user_data),
) -> MovieNight:
    """
    Creates a movie night, user must be logged in
    """
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Must be logged in to create a movie night",
        )
    try:
        new_movie_night = queries.create_movie_night(movie_night=movie_night)
        return new_movie_night
    except MovieNightCreationError as e:
        print(e)
        raise HTTPException(
            status_code=400, detail="Couldn't create movie night"
        )
    except MovieNightDataBaseError as e:
        print(e)
        raise HTTPException(
            status_code=400,
            detail="Database error trying to create movie night",
        )


@router.get("/{id}")
def get_movie_night(
    id: int,
    queries: MovieNightQueries = Depends(),
    user: UserResponse | None = Depends(try_get_jwt_user_data),
) -> MovieNight:
    """
    Gets a single movie_night by id.
    """
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Must be logged in to view a movie night",
        )
    try:
        return queries.get_movie_night(id)
    except MovieNightDoesNotExist as e:
        print(e)
        raise HTTPException(status_code=404, detail="No such movie night")
    except MovieNightDataBaseError as e:
        print(e)
        raise HTTPException(
            status_code=400, detail="Database error trying to get movie night"
        )


@router.delete("/{id}")
def delete_movie_night(
    id: int,
    queries: MovieNightQueries = Depends(),
    user: UserResponse | None = Depends(try_get_jwt_user_data),
) -> MovieNightDeleteResponse:
    """
    Deletes a single movie_night with specified id.
    """
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Must be logged in to delete a movie night",
        )
    try:
        queries.delete_movie_night(id)
        return MovieNightDeleteResponse(
            movie_night_id=id, message="Movie night has been deleted"
        )
    except DatabaseURLException as e:
        print(e)
        raise HTTPException(
            status_code=400, detail="Movie night does not exist"
        )


@router.put("/{id}")
def update_movie_night(
    id: int,
    movie_night: MovieNightRequest,
    queries: MovieNightQueries = Depends(),
    user: UserResponse | None = Depends(try_get_jwt_user_data),
) -> MovieNight:
    """
    Updates a single movie_night with specified id.
    """
    if user is None:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Must be logged in",
        )

    try:
        updated_movie_night = queries.update_movie_night(
            id=id,
            name=movie_night.name,
            date=movie_night.date,
            in_person=movie_night.in_person,
            location=movie_night.in_person,
        )
        return updated_movie_night
    except MovieNightDoesNotExist as e:
        print(e)
        raise HTTPException(
            status_code=404, detail=f"No movie night with id {id}"
        )
    except MovieNightDataBaseError as e:
        print(e)
        raise HTTPException(
            status_code=400,
            detail="Database error trying to update movie night",
        )
