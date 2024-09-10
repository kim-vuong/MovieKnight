"""
Pydantic Models for Users.
"""

from pydantic import BaseModel
from typing import Optional


class UserRequest(BaseModel):
    """
    Represents a the parameters needed to create a new user
    """

    username: str
    password: str
    picture_url: Optional[str] = None


class UserResponse(BaseModel):
    """
    Represents a user, with the password not included
    """

    id: int
    username: str
    picture_url: Optional[str] = None


class UserWithPw(BaseModel):
    """
    Represents a user with password included
    """

    id: int
    username: str
    password: str
    picture_url: str


class UserUpdate(BaseModel):
    """
    Represents a user that has the option to update any of the fields:
    - username
    - password
    - picture_url
    """

    username: Optional[str] = None
    password: Optional[str] = None
    picture_url: Optional[str] = None


class UserLogin(BaseModel):
    """
    Represents a user that is attempting to login/signin
    """

    username: str
    password: str


class UserDeleteResponse(BaseModel):
    """
    Represents the message shown when a user at a specified ID is deleted
    """

    user_id: int
    message: str
