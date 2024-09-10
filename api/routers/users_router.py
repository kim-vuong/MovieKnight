from fastapi import APIRouter, Depends, HTTPException, Response
from queries.user_queries import UserQueries
from models.users import (
    UserUpdate,
    UserDeleteResponse,
    UserResponse,
)
from models.jwt import JWTUserData
from utils.exceptions import UserDatabaseError
from utils.authentication import try_get_jwt_user_data, generate_jwt

router = APIRouter(tags=["Users"], prefix="/api/users")


@router.get("/")
def all_users(queries: UserQueries = Depends()) -> list[UserResponse]:
    users = queries.get_all_users()
    return users


@router.put("/update")
def update_auth_user(
    user_update: UserUpdate,
    user: JWTUserData = Depends(try_get_jwt_user_data),
    queries: UserQueries = Depends(),
    response: Response = None,
) -> UserResponse:
    try:
        updated_user = queries.update_user(user.id, user_update)
        new_token = generate_jwt(updated_user)
        response.set_cookie(
            key="fast_api_token",
            value=new_token,
            httponly=True,
            samesite="lax",
            secure=True,
        )
        return updated_user
    except UserDatabaseError as e:
        print(e)
        raise HTTPException(
            status_code=500,
            detail="Database error when attempting to update user",
        )


@router.get("/{user_id}")
def get_user(user_id: int, queries: UserQueries = Depends()) -> UserResponse:
    user = queries.get_by_id(user_id)
    if user is None:
        raise HTTPException(status_code=404, detail="User does not exist")
    return user


@router.delete("/{user_id}")
def delete_user(
    user_id: int, queries: UserQueries = Depends()
) -> UserDeleteResponse:
    try:
        queries.delete_user(user_id)
        return UserDeleteResponse(
            user_id=user_id, message="User has been deleted"
        )
    except UserDatabaseError as e:
        print(e)
        raise HTTPException(
            status_code=404,
            detail="User does not exist",
        )
