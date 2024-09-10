"""
Database Queries for Users
"""

import os
import psycopg
from psycopg_pool import ConnectionPool
from psycopg.rows import class_row
from typing import Optional
from models.users import UserWithPw, UserResponse, UserUpdate
from utils.exceptions import (
    UserDatabaseException,
    UserDoesNotExist,
    UserDatabaseError,
)
from utils.authentication import hash_password

DATABASE_URL = os.environ.get("DATABASE_URL")
if not DATABASE_URL:
    raise ValueError("DATABASE_URL environment variable is not set")

pool = ConnectionPool(DATABASE_URL)


class UserQueries:
    """
    Class containing queries for the Users table

    Can be dependency injected into a route like so

    def my_route(userQueries: UserQueries = Depends()):
        # Here you can call any of the functions to query the DB
    """

    def get_by_username(self, username: str) -> Optional[UserWithPw]:
        """
        Gets a user from the database by username

        Returns None if the user isn't found
        """
        try:
            with pool.connection() as conn:
                with conn.cursor(row_factory=class_row(UserWithPw)) as cur:
                    cur.execute(
                        """
                            SELECT
                                *
                            FROM users
                            WHERE username = %s
                            """,
                        [username],
                    )
                    user = cur.fetchone()
                    if not user:
                        return None
        except psycopg.Error as e:
            print(e)
            raise UserDatabaseException(f"Error getting user {username}")
        return user

    def get_by_id(self, id: int) -> Optional[UserResponse]:
        """
        Gets a user from the database by user id

        Returns None if the user isn't found
        """
        try:
            with pool.connection() as conn:
                with conn.cursor(row_factory=class_row(UserResponse)) as cur:
                    cur.execute(
                        """
                            SELECT
                                *
                            FROM users
                            WHERE id = %s
                            """,
                        [id],
                    )
                    user = cur.fetchone()
                    if not user:
                        return None
        except psycopg.Error as e:
            print(e)
            raise UserDatabaseException(f"Error getting user with id {id}")

        return user

    def create_user(
        self,
        username: str,
        hashed_password: str,
        picture_url: Optional[str] = None,
    ) -> UserResponse:
        """
        Creates a new user in the database

        Raises a UserInsertionException if creating the user fails
        """

        try:
            with pool.connection() as conn:
                with conn.cursor(row_factory=class_row(UserWithPw)) as cur:

                    if picture_url == "":
                        picture_url = None

                    cur.execute(
                        """
                        INSERT INTO users (
                            username,
                            password,
                            picture_url
                        ) VALUES (
                            %s,
                            %s,
                            COALESCE(%s,
                            'https://t4.ftcdn.net/jpg/02/15/84/43/360_F_215844325_ttX9YiIIyeaR7Ne6EaLLjMAmy4GvPC69.jpg')
                        )
                        RETURNING *;
                        """,
                        [
                            username,
                            hashed_password,
                            picture_url,
                        ],
                    )
                    user = cur.fetchone()
                    if not user:
                        raise UserDatabaseException(
                            f"Could not create user with username {username}"
                        )
        except psycopg.Error:
            raise UserDatabaseException(
                f"Could not create user with username {username}"
            )
        return user

    def get_all_users(self) -> list[UserResponse]:
        """
        Gets all users in the database
        """
        try:
            with pool.connection() as conn:
                with conn.cursor(row_factory=class_row(UserResponse)) as cur:
                    cur.execute(
                        """--sql
                            SELECT * FROM users
                            ORDER BY id;
                        """
                    )
                    users = cur.fetchall()
        except psycopg.Error as e:
            print(e)
            raise UserDatabaseException("Failed to fetch users")
        return users

    def update_user(self, user_id: int, user: UserUpdate) -> UserResponse:
        """
        Updates a user at the specified ID
        """
        try:
            with pool.connection() as conn:
                with conn.cursor(row_factory=class_row(UserResponse)) as cur:

                    hashed_password = (
                        hash_password(user.password) if user.password else None
                    )

                    result = cur.execute(
                        """--sql
                        UPDATE users
                        SET
                            username = COALESCE(%s, username),
                            password = COALESCE(%s, password),
                            picture_url = COALESCE(%s, picture_url)
                        WHERE id = %s
                        RETURNING id, username, picture_url;
                        """,
                        [
                            user.username,
                            hashed_password,
                            user.picture_url,
                            user_id,
                        ],
                    )
                    updated_user = result.fetchone()
                    if updated_user is None:
                        raise UserDoesNotExist(f"Invalid user id: {user_id}")
                    return updated_user
        except psycopg.Error as e:
            print(e)
            raise UserDatabaseError(e)

    def delete_user(self, user_id: int) -> str:
        """
        Deletes a user at the specified ID
        """
        try:
            with pool.connection() as conn:
                with conn.cursor() as cur:
                    cur.execute(
                        """--sql
                        DELETE FROM users
                        WHERE id = %s;
                        """,
                        [user_id],
                    )
                    if cur.rowcount == 0:
                        raise UserDatabaseError(
                            f"User ID: {user_id} not found in the database"
                        )
                    conn.commit()
                    return f"User ID: {user_id} has been successfully deleted"
        except psycopg.Error as e:
            print(e)
            raise UserDatabaseError(f"Invalid user id: {user_id}")
