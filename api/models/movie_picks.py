from pydantic import BaseModel
from datetime import date
from typing import Optional


class MoviePick(BaseModel):
    """
    Represents a basicmovie pick for a movie night without username
    """

    id: int
    movies_id: int
    attendees_id: int


class MoviePickWithDetails(BaseModel):
    """
    Represents a movie pick with additional details and username
    """

    id: int
    movie_title: str
    attendees_id: int
    user_id: int
    username: str
    movie_night_name: Optional[str] = None
    movie_night_date: Optional[date] = None


class MoviePickCreate(BaseModel):
    """
    Represents the data needed to create a new movie pick
    """

    movies_id: int
    attendees_id: int


class MoviePickUpdate(BaseModel):
    """
    Represents the data that can be updated for a movie pick
    """

    movies_id: Optional[int] = None
    attendees_id: Optional[int] = None


class MoviePickResponse(BaseModel):
    id: int
    movie_title: str
    movie_id: int


class RandomMoviePick(BaseModel):
    """
    represents a movie pick returned by the random movie pick query
    """

    title: str


class MovieSearchResult(BaseModel):
    """
    Represents the data for a search result
    """

    id: int
    title: str
