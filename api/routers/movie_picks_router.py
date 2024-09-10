from fastapi import Depends, APIRouter, HTTPException, Query
from queries.movie_picks_queries import MoviePickQueries
from models.movie_picks import (
    MoviePickWithDetails,
    MoviePickCreate,
    MoviePickUpdate,
    MoviePickResponse,
    RandomMoviePick,
    MovieSearchResult,
)
from typing import List
from utils.exceptions import MoviePickDataBaseError
from models.users import UserResponse
from utils.authentication import try_get_jwt_user_data

router = APIRouter(tags=["Movie Picks"], prefix="/api/movie-picks")


async def auth_check(
    user: UserResponse | None = Depends(try_get_jwt_user_data),
):
    if not user:
        raise HTTPException(status_code=401, detail="Authentication required")


@router.get("/search", response_model=List[MovieSearchResult])
async def search_movies(
    query: str = Query(..., min_length=1),
    queries: MoviePickQueries = Depends(),
):
    try:
        return queries.search_movies(query)
    except MoviePickDataBaseError as e:
        raise HTTPException(status_code=400, detail=str(e))


@router.get("/")
async def all_movie_picks(
    queries: MoviePickQueries = Depends(),
    _: None = Depends(auth_check),
) -> list[MoviePickWithDetails]:
    try:
        return queries.get_all_movie_picks()
    except MoviePickDataBaseError as e:
        raise HTTPException(status_code=400, detail=str(e))


@router.post("/")
async def create_movie_pick(
    movie_pick: MoviePickCreate,
    queries: MoviePickQueries = Depends(),
    _: None = Depends(auth_check),
) -> MoviePickResponse:
    try:
        return queries.create_movie_pick(movie_pick)
    except MoviePickDataBaseError as e:
        raise HTTPException(status_code=400, detail=str(e))


@router.get("/random/{movie_nights_id}")
async def get_random_pick(
    movie_nights_id: int, queries: MoviePickQueries = Depends()
) -> RandomMoviePick | None:
    try:
        return queries.get_random_movie_pick(movie_nights_id)
    except MoviePickDataBaseError as e:
        raise HTTPException(status_code=400, detail=str(e))


@router.delete("/attendee/{attendee_id}")
async def delete_movie_picks_for_attendee(
    attendee_id: int,
    queries: MoviePickQueries = Depends(),
    _: None = Depends(auth_check),
) -> dict:
    try:
        deleted = queries.delete_movie_picks_for_attendee(attendee_id)
        return {"message": f"{deleted} movie picks deleted for attendee"}
    except MoviePickDataBaseError as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.get("/attendee/{attendee_id}")
async def get_movie_picks_for_attendee(
    attendee_id: int,
    queries: MoviePickQueries = Depends(),
    _: None = Depends(auth_check),
) -> List[MoviePickResponse]:
    try:
        return queries.get_picks_for_attendee(attendee_id)
    except MoviePickDataBaseError as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.put("/attendee/{attendee_id}")
async def update_movie_picks_for_attendee(
    attendee_id: int,
    movie_picks: List[MoviePickUpdate],
    queries: MoviePickQueries = Depends(),
    _: None = Depends(auth_check),
) -> List[MoviePickResponse]:
    try:
        return queries.update_picks_for_attendee(attendee_id, movie_picks)
    except MoviePickDataBaseError as e:
        raise HTTPException(status_code=500, detail=str(e))
