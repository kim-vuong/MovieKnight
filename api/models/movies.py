from pydantic import BaseModel
from datetime import date


class Genre(BaseModel):
    """
    Represents a genre, with the name and tmdb id
    """

    id: int
    tmdb_id: int
    name: str


class MovieRequest(BaseModel):
    """
    Represents a movie when using POST
    """

    title: str
    image_url: str
    tagline: str
    synopsis: str
    release_date: date
    runtime: int
    tmdb_id: int
    genres: list[Genre]


class Movie(BaseModel):
    """
    Represents a movie
    """

    id: int
    title: str
    image_url: str
    tagline: str
    synopsis: str
    release_date: date
    runtime: int
    tmdb_id: int


class ExtendedMovie(BaseModel):
    """
    Represents a movie including genre list
    """

    id: int
    title: str
    image_url: str
    tagline: str
    synopsis: str
    release_date: date
    runtime: int
    tmdb_id: int
    genres: list[Genre]


class MovieWithGenre(BaseModel):
    """
    Represents a movie with its genres
    """

    movie_id: int
    title: str
    genres: list[str]


class MovieDeleteResponse(BaseModel):
    """
    Respresents the message shown when a movie at a specidfied ID is deleted
    """

    movie_id: int
    message: str
