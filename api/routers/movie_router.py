from fastapi import (
    Depends,
    APIRouter,
    HTTPException,
    status,
)
from utils.exceptions import DatabaseURLException
from queries.movie_queries import MovieQueries

from models.movies import (
    MovieWithGenre,
    ExtendedMovie,
    MovieRequest,
    MovieDeleteResponse,
)

from models.rated_items import RatedItem

router = APIRouter(tags=["Movies"], prefix="/api/movies")


@router.get("/search")
def search_movies(query: str, queries: MovieQueries = Depends()):
    try:
        return queries.search_movies(query)
    except Exception as e:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=e)


@router.get("/")
def all_movies(
    queries: MovieQueries = Depends(),
) -> list[ExtendedMovie] | None:
    movies = queries.get_all_movies()
    return movies


@router.get("/{id}")
def single_movie(
    id: int,
    queries: MovieQueries = Depends(),
) -> ExtendedMovie | None:
    movie = queries.get_single_movie(id)
    return movie


@router.delete("/{id}")
def delete_movie(
    id: int, queries: MovieQueries = Depends()
) -> MovieDeleteResponse:
    try:
        queries.delete_movie(id)
        return MovieDeleteResponse(
            movie_id=id, message="Movie has been deleted"
        )
    except DatabaseURLException as e:
        print(e)
        raise HTTPException(status_code=400, detail="Movie does not exist")


@router.get("/{id}/genres")
def movie_genres(
    id: int, queries: MovieQueries = Depends()
) -> MovieWithGenre | None:
    genres = queries.get_genres_movies(id=id)
    return genres


@router.post("/")
def movie_create(
    movie: MovieRequest, queries: MovieQueries = Depends()
) -> ExtendedMovie | None:
    try:
        new_movie = queries.create_movie(movie=movie)
        return new_movie
    except DatabaseURLException as e:
        print(e)
        raise HTTPException(status_code=400, detail="Couldn't create Movie")


@router.get("/{id}/reviews")
def get_movie_reviews(
    id: int, queries: MovieQueries = Depends()
) -> list[RatedItem] | None:
    reviews = queries.get_reviews_for_movie(id)
    return reviews
