from typing import List
from fastapi import APIRouter, Depends, HTTPException
from queries.rated_items_queries import RatedItemQueries
from models.rated_items import RatedItem, RatedItemBase

router = APIRouter(tags=["RatedItems"], prefix="/api/rated-items")


@router.post("/", response_model=RatedItem)
def create_rated_item(
    rated_item: RatedItemBase,
    queries: RatedItemQueries = Depends(),
):
    created_item = queries.create_rated_item(rated_item)
    if created_item is None:
        raise HTTPException(
            status_code=400, detail="Failed to create rated item"
        )
    return created_item


@router.get("/", response_model=list[RatedItem])
def all_rated_items(
    queries: RatedItemQueries = Depends(),
):
    rated_items = queries.get_all_rated_items()
    return rated_items


@router.get("/with-movie-details", response_model=List[dict])
async def get_rated_items_with_movie_details(
    queries: RatedItemQueries = Depends(),
):
    rated_items_with_movie_details = (
        queries.get_rated_items_with_movie_details()
    )
    if rated_items_with_movie_details is None:
        raise HTTPException(
            status_code=500,
            detail="Failed to fetch rated items with movie details",
        )
    return rated_items_with_movie_details


@router.get("/users/{user_id}", response_model=List[RatedItem])
async def get_rated_items_by_user(
    user_id: int,
    queries: RatedItemQueries = Depends(),
):
    rated_items = queries.get_rated_items_by_user(user_id)
    if rated_items is None:
        raise HTTPException(
            status_code=404, detail="Rated items not found for user"
        )
    return rated_items


@router.get("/users/{user_id}/movies/{movie_id}", response_model=RatedItem)
def get_rated_item(
    user_id: int,
    movie_id: int,
    queries: RatedItemQueries = Depends(),
):
    rated_item = queries.get_rated_item_by_user_and_movie(user_id, movie_id)
    if rated_item is None:
        raise HTTPException(status_code=404, detail="Rated item not found")
    return rated_item


@router.put("/users/{user_id}/movies/{movie_id}", response_model=RatedItem)
def update_rated_item(
    user_id: int,
    movie_id: int,
    rated_item: RatedItemBase,
    queries: RatedItemQueries = Depends(),
):
    updated_item = queries.update_rated_item(user_id, movie_id, rated_item)
    if updated_item is None:
        raise HTTPException(status_code=404, detail="Rated item not found")
    return updated_item


@router.delete("/users/{user_id}/movies/{movie_id}", response_model=dict)
def delete_rated_item(
    user_id: int,
    movie_id: int,
    queries: RatedItemQueries = Depends(),
):
    success = queries.delete_rated_item(user_id, movie_id)
    if not success:
        raise HTTPException(status_code=404, detail="Rated item not found")
    return {"detail": "Rated item deleted"}


@router.get("/users/{user_id}/with-movie-details", response_model=List[dict])
async def get_rated_items_with_movie_details_by_user(
    user_id: int,
    queries: RatedItemQueries = Depends(),
):
    rated_items_with_movie_details = (
        queries.get_rated_items_with_movie_details_by_user(user_id)
    )
    if rated_items_with_movie_details is None:
        raise HTTPException(
            status_code=500,
            detail="Failed to fetch rated items with movie details for user",
        )
    return rated_items_with_movie_details


@router.get("/exists/users/{user_id}/movies/{movie_id}", response_model=dict)
async def check_rated_item_existence(
    user_id: int,
    movie_id: int,
    queries: RatedItemQueries = Depends(),
):
    rated_item = queries.get_rated_item_by_user_and_movie(user_id, movie_id)
    does_exist = rated_item is not None
    return {"exists": does_exist}
