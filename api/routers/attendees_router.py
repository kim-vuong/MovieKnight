from fastapi import APIRouter, Depends, HTTPException
from queries.attendees_queries import AttendeeQueries
from models.attendees import (
    Attendee,
    AttendeeWithNames,
    AttendeeCreate,
    AttendeeUpdate,
)
from models.users import UserResponse
from utils.authentication import try_get_jwt_user_data
from utils.exceptions import AttendeeDataBaseError

router = APIRouter(tags=["Attendees"], prefix="/api/attendees")


async def auth_check(
    user: UserResponse | None = Depends(try_get_jwt_user_data),
):
    if not user:
        raise HTTPException(status_code=401, detail="Authentication required")


@router.get("/")
async def all_attendees(
    queries: AttendeeQueries = Depends(),
    _: None = Depends(auth_check),
) -> list[Attendee]:
    try:
        return queries.get_all_attendees()
    except AttendeeDataBaseError as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.get("/{attendee_id}")
async def get_attendee(
    attendee_id: int,
    queries: AttendeeQueries = Depends(),
    _: None = Depends(auth_check),
) -> AttendeeWithNames:
    try:
        attendee = queries.get_attendee_by_id(attendee_id)
        if attendee is None:
            raise HTTPException(status_code=404, detail="Attendee not found")
        return attendee
    except AttendeeDataBaseError as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.post("/")
async def create_attendee(
    attendee: AttendeeCreate,
    queries: AttendeeQueries = Depends(),
    _: None = Depends(auth_check),
) -> Attendee:
    try:
        return queries.create_attendee(attendee)
    except AttendeeDataBaseError as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.put("/{attendee_id}")
async def update_attendee(
    attendee_id: int,
    attendee: AttendeeUpdate,
    queries: AttendeeQueries = Depends(),
    _: None = Depends(auth_check),
) -> Attendee:
    try:
        updated_attendee = queries.update_attendee(attendee_id, attendee)
        if updated_attendee is None:
            raise HTTPException(status_code=404, detail="Attendee not found")
        return updated_attendee
    except AttendeeDataBaseError as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.delete("/{attendee_id}")
async def delete_attendee(
    attendee_id: int,
    queries: AttendeeQueries = Depends(),
    _: None = Depends(auth_check),
) -> dict:
    try:
        deleted = queries.delete_attendee(attendee_id)
        if not deleted:
            raise HTTPException(status_code=404, detail="Attendee not found")
        return {"message": "Attendee successfully deleted"}
    except AttendeeDataBaseError as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.get("/movie-night/{movie_night_id}")
async def get_attendees_for_movie_night(
    movie_night_id: int,
    queries: AttendeeQueries = Depends(),
    _: None = Depends(auth_check),
) -> list[AttendeeWithNames]:
    try:
        return queries.get_attendees_for_movie_night(movie_night_id)
    except AttendeeDataBaseError as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.post("/get-or-create")
async def get_or_create_attendee(
    attendee: AttendeeCreate,
    queries: AttendeeQueries = Depends(),
    _: None = Depends(auth_check),
) -> Attendee:
    try:
        existing_attendee = queries.get_attendee_by_user_and_movie_night(
            attendee.user_id, attendee.movie_nights_id
        )
        if existing_attendee:
            return existing_attendee
        return queries.create_attendee(attendee)
    except AttendeeDataBaseError as e:
        raise HTTPException(status_code=500, detail=str(e))
