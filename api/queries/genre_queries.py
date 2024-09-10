import psycopg
from psycopg.rows import class_row
import os
from psycopg_pool import ConnectionPool
from rich import print
from models.movies import Genre
from utils.exceptions import DatabaseURLException

database_url = os.environ.get("DATABASE_URL")
if database_url is None:
    raise DatabaseURLException(
        "You forgot to define DATABASE_URL in your environment"
    )

pool = ConnectionPool(database_url)


class GenreQueries:
    def get_all_genres(self) -> list[Genre] | None:
        """
        Gets all genres
        """
        try:
            with pool.connection() as conn:
                with conn.cursor(row_factory=class_row(Genre)) as cur:
                    result = cur.execute(
                        """--sql
                            SELECT * FROM genres;
                        """
                    )
                    genres = result.fetchall()
                    return genres
        except psycopg.Error as e:
            print(e)
            pass
