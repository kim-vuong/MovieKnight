import psycopg
from psycopg.rows import class_row
import os
from psycopg_pool import ConnectionPool
from utils.exceptions import DatabaseURLException, MoviePickDataBaseError
from models.movie_picks import (
    MoviePickWithDetails,
    MoviePickCreate,
    MoviePickUpdate,
    MoviePickResponse,
    RandomMoviePick,
    MovieSearchResult,
)
from typing import List

database_url = os.environ.get("DATABASE_URL")
if database_url is None:
    raise DatabaseURLException(
        "You forgot to define DATABASE_URL in your environment"
    )

pool = ConnectionPool(database_url)


class MoviePickQueries:
    def get_all_movie_picks(self) -> list[MoviePickWithDetails]:
        """Gets all movie picks with details"""
        try:
            with pool.connection() as conn:
                with conn.cursor(
                    row_factory=class_row(MoviePickWithDetails)
                ) as cur:
                    result = cur.execute(
                        """
                        SELECT
                            mp.id,
                            m.title AS movie_title,
                            mp.attendees_id,
                            u.id AS user_id,
                            u.username,
                            mn.name AS movie_night_name,
                            mn.date AS movie_night_date
                        FROM movie_picks mp
                        JOIN attendees a ON mp.attendees_id = a.id
                        JOIN users u ON a.user_id = u.id
                        JOIN movies m ON mp.movies_id = m.id
                        LEFT JOIN movie_nights mn ON a.movie_nights_id = mn.id;
                        """
                    )
                    return result.fetchall()
        except psycopg.Error as e:
            raise MoviePickDataBaseError(str(e))

    def create_movie_pick(
        self, movie_pick: MoviePickCreate
    ) -> MoviePickResponse:
        """Creates a new movie pick"""
        try:
            with pool.connection() as conn:
                with conn.cursor(
                    row_factory=class_row(MoviePickResponse)
                ) as cur:
                    result = cur.execute(
                        """
                        WITH inserted_pick AS (
                            INSERT INTO movie_picks (movies_id, attendees_id)
                            VALUES (%(movies_id)s, %(attendees_id)s)
                            RETURNING id, movies_id
                        )
                        SELECT
                            inserted_pick.id,
                            movies.title AS movie_title,
                            movies.id AS movie_id
                        FROM inserted_pick
                        JOIN movies ON inserted_pick.movies_id = movies.id
                        """,
                        movie_pick.model_dump(),
                    )
                    return result.fetchone()
        except psycopg.Error as e:
            raise MoviePickDataBaseError(str(e))

    def get_picks_for_attendee(
        self, attendee_id: int
    ) -> list[MoviePickResponse]:
        """Gets all movie picks for a specific attendee"""
        try:
            with pool.connection() as conn:
                with conn.cursor(
                    row_factory=class_row(MoviePickResponse)
                ) as cur:
                    result = cur.execute(
                        """
                        SELECT
                            mp.id,
                            m.title AS movie_title,
                            m.id AS movie_id
                        FROM movie_picks mp
                        JOIN movies m ON mp.movies_id = m.id
                        WHERE mp.attendees_id = %(attendee_id)s
                        """,
                        {"attendee_id": attendee_id},
                    )
                    return result.fetchall()
        except psycopg.Error as e:
            raise MoviePickDataBaseError(str(e))

    def get_random_movie_pick(
        self, movie_nights_id: int
    ) -> RandomMoviePick | None:
        """Generates a random movie pick"""
        try:
            with pool.connection() as conn:
                with conn.cursor(
                    row_factory=class_row(RandomMoviePick)
                ) as cur:
                    result = cur.execute(
                        """
                        SELECT m.title
                        FROM movie_picks p
                        JOIN movies m ON m.id = p.movies_id
                        JOIN attendees a ON a.id = p.attendees_id
                        WHERE a.movie_nights_id = %(movie_nights_id)s
                        ORDER BY random()
                        LIMIT 1
                        """,
                        {"movie_nights_id": movie_nights_id},
                    )
                    return result.fetchone()
        except psycopg.Error as e:
            raise MoviePickDataBaseError(str(e))

    def search_movies(self, query: str) -> List[MovieSearchResult]:
        """Searches for movies based on a query string"""
        try:
            with pool.connection() as conn:
                with conn.cursor() as cur:
                    cur.execute(
                        """
                        SELECT id, title
                        FROM movies
                        WHERE LOWER(title) LIKE LOWER(%s)
                        ORDER BY title
                        LIMIT 10
                        """,
                        (f"%{query}%",),
                    )
                    results = cur.fetchall()
                    return [
                        MovieSearchResult(id=row[0], title=row[1])
                        for row in results
                    ]
        except psycopg.Error as e:
            raise MoviePickDataBaseError(f"Error searching movies: {str(e)}")

    def delete_movie_picks_for_attendee(self, attendee_id: int) -> int:
        """Deletes all movie picks for a specific attendee"""
        try:
            with pool.connection() as conn:
                with conn.cursor() as cur:
                    result = cur.execute(
                        """
                        DELETE FROM movie_picks
                        WHERE attendees_id = %(attendee_id)s;
                        """,
                        {"attendee_id": attendee_id},
                    )
                    return result.rowcount
        except psycopg.Error as e:
            raise MoviePickDataBaseError(str(e))

    def update_picks_for_attendee(
        self, attendee_id: int, movie_picks: List[MoviePickUpdate]
    ) -> List[MoviePickResponse]:
        """Updates movie picks for a specific attendee"""
        try:
            with pool.connection() as conn:
                with conn.cursor() as cur:
                    cur.execute(
                        "DELETE FROM movie_picks WHERE attendees_id = %s",
                        (attendee_id,),
                    )

                    results = []
                    for pick in movie_picks:
                        cur.execute(
                            """
                            INSERT INTO movie_picks (movies_id, attendees_id)
                            VALUES (%s, %s)
                            RETURNING id
                            """,
                            (pick.movies_id, attendee_id),
                        )
                        pick_id = cur.fetchone()[0]

                        cur.execute(
                            """
                            SELECT m.title, m.id
                            FROM movies m
                            WHERE m.id = %s
                            """,
                            (pick.movies_id,),
                        )
                        movie_title, movie_id = cur.fetchone()

                        results.append(
                            MoviePickResponse(
                                id=pick_id,
                                movie_title=movie_title,
                                movie_id=movie_id,
                            )
                        )

                    return results
        except psycopg.Error as e:
            raise MoviePickDataBaseError(str(e))
