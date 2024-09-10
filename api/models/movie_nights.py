from pydantic import BaseModel
from datetime import date
from typing import Optional


class MovieNight(BaseModel):
    id: int
    name: str
    date: date
    in_person: bool
    location: Optional[str]


class MovieNightRequest(BaseModel):
    name: str
    date: date
    in_person: bool
    location: Optional[str]


class MovieNightDeleteResponse(BaseModel):
    """
    Represents the message shown when a movie night is deleted
    """

    movie_night_id: int
    message: str
