import psycopg
from psycopg.rows import class_row
from psycopg_pool import ConnectionPool
from models.attendees import (
    Attendee,
    AttendeeWithNames,
    AttendeeCreate,
    AttendeeUpdate,
)
from utils.exceptions import DatabaseURLException, AttendeeDataBaseError
import os

database_url = os.environ.get("DATABASE_URL")
if database_url is None:
    raise DatabaseURLException(
        "You forgot to define DATABASE_URL in your environment"
    )

pool = ConnectionPool(database_url)


class AttendeeQueries:
    def get_all_attendees(self) -> list[Attendee]:
        """Gets all attendees"""
        try:
            with pool.connection() as conn:
                with conn.cursor(row_factory=class_row(Attendee)) as cur:
                    result = cur.execute("""SELECT * FROM attendees;""")
                    return result.fetchall()
        except psycopg.Error as e:
            print(e)
            raise AttendeeDataBaseError(e)

    def get_attendees_for_movie_night(
        self, movie_night_id: int
    ) -> list[AttendeeWithNames]:
        """Gets all attendees for a specific movie night"""
        try:
            with pool.connection() as conn:
                with conn.cursor(
                    row_factory=class_row(AttendeeWithNames)
                ) as cur:
                    result = cur.execute(
                        """
                        SELECT
                            attendees.id,
                            movie_nights.name AS movie_night_name,
                            users.username,
                            attendees.host
                        FROM attendees
                        JOIN movie_nights ON attendees.movie_nights_id = movie_nights.id
                        JOIN users ON attendees.user_id = users.id
                        WHERE attendees.movie_nights_id = %(movie_night_id)s;
                        """,
                        {"movie_night_id": movie_night_id},
                    )
                    return result.fetchall()
        except psycopg.Error as e:
            print(e)
            raise AttendeeDataBaseError(e)

    def create_attendee(self, attendee: AttendeeCreate) -> Attendee:
        """Creates a new attendee"""
        try:
            with pool.connection() as conn:
                with conn.cursor(row_factory=class_row(Attendee)) as cur:
                    result = cur.execute(
                        """
                        INSERT INTO attendees (movie_nights_id, user_id, host)
                        VALUES (%(movie_nights_id)s, %(user_id)s, %(host)s)
                        RETURNING *;
                        """,
                        attendee.model_dump(),
                    )
                    return result.fetchone()
        except psycopg.Error as e:
            print(e)
            raise AttendeeDataBaseError(e)

    def update_attendee(
        self, id: int, attendee: AttendeeUpdate
    ) -> Attendee | None:
        """Updates an existing attendee"""
        try:
            with pool.connection() as conn:
                with conn.cursor(row_factory=class_row(Attendee)) as cur:
                    result = cur.execute(
                        """
                        UPDATE attendees
                        SET host = COALESCE(%(host)s, host)
                        WHERE id = %(id)s
                        RETURNING *;
                        """,
                        {"id": id, **attendee.model_dump(exclude_unset=True)},
                    )
                    return result.fetchone()
        except psycopg.Error as e:
            print(e)
            raise AttendeeDataBaseError(e)

    def get_attendee_by_user_and_movie_night(
        self, user_id: int, movie_night_id: int
    ) -> Attendee | None:
        """Gets an attendee by user_id and movie_night_id"""
        try:
            with pool.connection() as conn:
                with conn.cursor(row_factory=class_row(Attendee)) as cur:
                    result = cur.execute(
                        """
                        SELECT * FROM attendees
                        WHERE user_id = %(user_id)s AND movie_nights_id = %(movie_night_id)s;
                        """,
                        {"user_id": user_id, "movie_night_id": movie_night_id},
                    )
                    return result.fetchone()
        except psycopg.Error as e:
            print(e)
            raise AttendeeDataBaseError(e)
