from pydantic import BaseModel


class Genres_Movies(BaseModel):
    """
    Join table between the genre table and movies table
    """

    movie_id: int
    genre_id: int
