import psycopg
from psycopg.rows import class_row
import os
from psycopg_pool import ConnectionPool
from rich import print
from utils.exceptions import (
    DatabaseURLException,
    MovieNightDoesNotExist,
    MovieNightDataBaseError,
    MovieNightCreationError,
)
from models.movie_nights import MovieNight, MovieNightRequest

database_url = os.environ.get("DATABASE_URL")
if database_url is None:
    raise DatabaseURLException(
        "You forgot to define DATABASE_URL in your environment"
    )

pool = ConnectionPool(database_url)


class MovieNightQueries:
    def get_all_movie_nights(self) -> list[MovieNight] | None:
        """
        Gets all movie nights
        """
        try:
            with pool.connection() as conn:
                with conn.cursor(row_factory=class_row(MovieNight)) as cur:
                    result = cur.execute(
                        """--sql
                            SELECT * FROM movie_nights;
                        """
                    )
                    movie_nights = result.fetchall()
                    return movie_nights
        except psycopg.Error as e:
            print(e)
            raise MovieNightDataBaseError(e)

    def get_movie_night(self, id: int) -> MovieNight:
        """
        Gets the details of a single movie night by its ID
        """
        try:
            with pool.connection() as conn:
                with conn.cursor(row_factory=class_row(MovieNight)) as cur:
                    result = cur.execute(
                        """--sql
                            SELECT *
                            FROM movie_nights
                            WHERE movie_nights.id = %s;
                        """,
                        (id,),
                    )
                    movie_night = result.fetchone()
                    if movie_night is None:
                        raise MovieNightDoesNotExist(
                            f"No movie night with id {id}"
                        )
                    return movie_night
        except psycopg.Error as e:
            print(e)
            raise MovieNightDataBaseError(e)

    def create_movie_night(self, movie_night: MovieNightRequest) -> MovieNight:
        """
        Creates a new movie night
        """
        try:
            with pool.connection() as conn:
                with conn.cursor(row_factory=class_row(MovieNight)) as cur:
                    result = cur.execute(
                        """--sql
                        INSERT INTO movie_nights (
                        name,
                        date,
                        in_person,
                        location
                        )
                        VALUES (
                        %(name)s,
                        %(date)s,
                        %(in_person)s,
                        %(location)s
                        )
                        RETURNING *;
                        """,
                        {
                            "name": movie_night.name,
                            "date": movie_night.date,
                            "in_person": movie_night.in_person,
                            "location": movie_night.location,
                        },
                    )
                    new_movie_night = result.fetchone()
                    if new_movie_night is None:
                        raise MovieNightCreationError(
                            "Error creating new movie night"
                        )
                    return new_movie_night
        except psycopg.Error as e:
            print(e)
            raise MovieNightDataBaseError(e)

    def delete_movie_night(self, id: int):
        """
        Deletes a single movie night by its ID
        """
        try:
            with pool.connection() as conn:
                with conn.cursor() as cur:
                    cur.execute(
                        """--sql
                        DELETE FROM movie_nights
                        WHERE movie_nights.id = %(id)s
                    """,
                        {"id": id},
                    )
                    if cur.rowcount == 0:
                        raise DatabaseURLException(
                            f"Movie night with ID:{id} not found"
                        )
                    conn.commit()
                    return f"Movie night ID: {id} has been deleted"
        except psycopg.Error as e:
            print(e)
            raise MovieNightDataBaseError(e)

    def update_movie_night(
        self, id: int, name: str, date, in_person: bool, location
    ) -> MovieNight:
        """
        Updates an existing movie_night
        """
        try:
            with pool.connection() as conn:
                with conn.cursor(row_factory=class_row(MovieNight)) as cur:
                    result = cur.execute(
                        """--sql
                        UPDATE movie_nights
                        SET name = %(name)s,
                            date = %(date)s,
                            in_person = %(in_person)s,
                            location = %(location)s
                        WHERE movie_nights.id = %(id)s
                        RETURNING *;
                        """,
                        {
                            "id": id,
                            "name": name,
                            "date": date,
                            "in_person": in_person,
                            "location": location,
                        },
                    )
                    updated_movie_night = result.fetchone()
                    if updated_movie_night is None:
                        raise MovieNightDoesNotExist(
                            "No movie night to update"
                        )
                    return updated_movie_night
        except psycopg.Error as e:
            print(e)
            raise MovieNightDataBaseError(e)
