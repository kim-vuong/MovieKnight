from pydantic import BaseModel
from typing import Optional


class Attendee(BaseModel):
    """
    Represents an attendee of a movie night
    """

    id: int
    movie_nights_id: int
    user_id: int
    host: bool


class AttendeeWithNames(BaseModel):
    """
    Represents a single attendee with strings instead of IDs
    """

    id: int
    movie_night_name: str
    username: str
    host: bool


class AttendeeCreate(BaseModel):
    """
    Represents the data needed to create a new attendee
    """

    movie_nights_id: int
    user_id: int
    host: bool


class AttendeeUpdate(BaseModel):
    """
    Represents the data that can be updated for an attendee
    """

    host: Optional[bool] = None
