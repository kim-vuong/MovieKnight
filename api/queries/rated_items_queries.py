import psycopg
from psycopg.rows import class_row
from psycopg_pool import ConnectionPool
from models.rated_items import RatedItem, RatedItemBase
from utils.exceptions import DatabaseURLException
import os

database_url = os.environ.get("DATABASE_URL")
if database_url is None:
    raise DatabaseURLException(
        "You forgot to define DATABASE_URL in your environment"
    )

pool = ConnectionPool(database_url)


class RatedItemQueries:
    def create_rated_item(self, rated_item: RatedItemBase) -> RatedItem | None:
        """
        Creates a new rated item
        """
        try:
            with pool.connection() as conn:
                with conn.cursor() as cur:
                    cur.execute(
                        """--sql
                            INSERT INTO rated_items (
                                user_id,
                                movie_id,
                                user_rating,
                                review,
                                watched,
                                tier
                            ) VALUES (%(user_id)s, %(movie_id)s,
                            %(user_rating)s,
                            %(review)s, %(watched)s, %(tier)s)
                            RETURNING id;
                        """,
                        rated_item.model_dump(),
                    )
                    rated_item_id = cur.fetchone()[0]
                    return RatedItem(
                        id=rated_item_id,
                        **rated_item.model_dump(),
                    )
        except psycopg.Error as e:
            print(f"Database error: {e}")
            return None

    def get_rated_item_by_user_and_movie(
        self, user_id: int, movie_id: int
    ) -> RatedItem | None:
        """
        Gets a rated item by user_id and movie_id
        """
        try:
            with pool.connection() as conn:
                with conn.cursor(row_factory=class_row(RatedItem)) as cur:
                    cur.execute(
                        """--sql
                            SELECT * FROM rated_items
                            WHERE user_id = %(user_id)s
                            AND movie_id = %(movie_id)s;
                        """,
                        {"user_id": user_id, "movie_id": movie_id},
                    )
                    rated_item = cur.fetchone()
                    return rated_item
        except psycopg.Error as e:
            print(f"Database error: {e}")
            return None

    def update_rated_item(
        self, user_id: int, movie_id: int, rated_item: RatedItemBase
    ) -> RatedItem | None:
        """
        Updates a rated item by user_id and movie_id
        """
        try:
            with pool.connection() as conn:
                with conn.cursor() as cur:
                    cur.execute(
                        """--sql
                            UPDATE rated_items
                            SET user_rating = %(user_rating)s,
                                review = %(review)s,
                                watched = %(watched)s,
                                tier = %(tier)s
                            WHERE user_id = %(user_id)s
                            AND movie_id = %(movie_id)s
                            RETURNING id;
                        """,
                        {
                            **rated_item.model_dump(
                                exclude={"user_id", "movie_id"}
                            ),
                            "user_id": user_id,
                            "movie_id": movie_id,
                        },
                    )
                    updated_id = cur.fetchone()
                    if updated_id is None:
                        return None
                    return RatedItem(
                        id=updated_id[0],
                        user_id=user_id,
                        movie_id=movie_id,
                        **rated_item.model_dump(
                            exclude={"user_id", "movie_id"}
                        ),
                    )
        except psycopg.Error as e:
            print(f"Database error: {e}")
            return None

    def delete_rated_item(self, user_id: int, movie_id: int) -> bool:
        """
        Deletes a rated item by user_id and movie_id
        """
        try:
            with pool.connection() as conn:
                with conn.cursor() as cur:
                    cur.execute(
                        """--sql
                            DELETE FROM rated_items
                            WHERE user_id = %(user_id)s
                            AND movie_id = %(movie_id)s;
                        """,
                        {"user_id": user_id, "movie_id": movie_id},
                    )
                    return cur.rowcount > 0
        except psycopg.Error as e:
            print(f"Database error: {e}")
            return False

    def get_all_rated_items(self) -> list[RatedItem]:
        """
        Gets all rated items
        """
        try:
            with pool.connection() as conn:
                with conn.cursor(row_factory=class_row(RatedItem)) as cur:
                    cur.execute(
                        """--sql
                            SELECT * FROM rated_items;
                        """
                    )
                    rated_items = cur.fetchall()
                    return rated_items
        except psycopg.Error as e:
            print(f"Database error: {e}")
            return []

    def get_rated_items_with_movie_details(self) -> list[dict] | None:
        """
        Gets all rated items with movie details
        """
        try:
            with pool.connection() as conn:
                with conn.cursor() as cur:
                    cur.execute(
                        """--sql
                            SELECT
                                rated_items.user_id,
                                rated_items.movie_id,
                                rated_items.user_rating,
                                rated_items.review,
                                rated_items.watched,
                                rated_items.tier,
                                movies.title AS movie_title,
                                movies.image_url AS movie_image_url
                            FROM rated_items
                            JOIN movies ON rated_items.movie_id = movies.id;
                        """
                    )
                    rows = cur.fetchall()
                    rated_items_with_movie_details = [
                        {
                            "user_id": row[0],
                            "movie_id": row[1],
                            "user_rating": row[2],
                            "review": row[3],
                            "watched": row[4],
                            "tier": row[5],
                            "movie_title": row[6],
                            "movie_image_url": row[7],
                        }
                        for row in rows
                    ]
                    return rated_items_with_movie_details
        except psycopg.Error as e:
            print(f"Database error: {e}")
            return None

    def get_rated_items_by_user(self, user_id: int) -> list[RatedItem] | None:
        """
        Gets all rated items by a specific user_id
        """
        try:
            with pool.connection() as conn:
                with conn.cursor(row_factory=class_row(RatedItem)) as cur:
                    cur.execute(
                        """--sql
                            SELECT * FROM rated_items
                            WHERE user_id = %(user_id)s;
                        """,
                        {"user_id": user_id},
                    )
                    rated_items = cur.fetchall()
                    return rated_items
        except psycopg.Error as e:
            print(f"Database error: {e}")
            return None

    def get_rated_items_with_movie_details_by_user(
        self, user_id: int
    ) -> list[dict] | None:
        """
        Gets all rated items with movie details for a specific user
        """
        try:
            with pool.connection() as conn:
                with conn.cursor() as cur:
                    cur.execute(
                        """--sql
                            SELECT
                                rated_items.user_id,
                                rated_items.movie_id,
                                rated_items.user_rating,
                                rated_items.review,
                                rated_items.watched,
                                rated_items.tier,
                                movies.title AS movie_title,
                                movies.image_url AS movie_image_url
                            FROM rated_items
                            JOIN movies ON rated_items.movie_id = movies.id
                            WHERE rated_items.user_id = %(user_id)s;
                        """,
                        {"user_id": user_id},
                    )
                    rows = cur.fetchall()
                    rated_items_with_movie_details = [
                        {
                            "user_id": row[0],
                            "movie_id": row[1],
                            "user_rating": row[2],
                            "review": row[3],
                            "watched": row[4],
                            "tier": row[5],
                            "movie_title": row[6],
                            "movie_image_url": row[7],
                        }
                        for row in rows
                    ]
                    return rated_items_with_movie_details
        except psycopg.Error as e:
            print(f"Database error: {e}")
            return None
