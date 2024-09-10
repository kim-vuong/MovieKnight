from fastapi import (
    Depends,
    APIRouter,
)
from queries.genre_queries import GenreQueries

from models.movies import Genre


router = APIRouter(tags=["Genres"], prefix="/api/genres")


@router.get("/")
def all_genres(queries: GenreQueries = Depends()) -> list[Genre] | None:
    genres = queries.get_all_genres()
    return genres
