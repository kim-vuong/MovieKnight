from unittest import TestCase
from fastapi.testclient import TestClient
from main import app
from queries.user_queries import UserQueries
from queries.rated_items_queries import RatedItemQueries
from models.rated_items import RatedItem
from models.users import UserResponse, UserWithPw
from typing import Optional
from utils.authentication import hash_password


example_user = {
    "id": 1,
    "username": "SWE_Ducky",
    "picture_url": "http://example.com",
}

example_password = "fakepassword"
hashed_example_password = hash_password(example_password)

example_user_with_password = {
    "id": 1,
    "username": "love2code",
    "password": hashed_example_password,
    "picture_url": "http://example.com",
}

example_rated_item = {
    "user_id": 1,
    "movie_id": 21,
    "user_rating": 0,
    "review": "",
    "watched": False,
    "tier": "Z",
    "id": 183,
}


# Fake / Mock query library
class EmptyUsersQueries:
    def get_all_users(self) -> list[UserResponse]:
        return []


class SingleUserQueries:
    def get_all_users(self) -> list[UserResponse]:
        return [UserResponse(**example_user)]


class EmptyRatedItemQueries:
    def get_all_rated_items(self) -> list[RatedItem]:
        return []


class SingleRatedItemQueries:
    def get_all_rated_items(self) -> list[RatedItem]:
        return [RatedItem(**example_rated_item)]


class UsersRatedItemQueries:
    def get_rated_items_by_user(self, user_id: int) -> list[RatedItem]:
        return [RatedItem(**example_rated_item)]


class ExampleUserQueries:
    def get_by_username(self, username: str) -> Optional[UserWithPw]:
        return UserWithPw(**example_user_with_password)


class TestUsers(TestCase):
    # Similar to a fetch library or requests (doesn't actually do requests)
    # Wires everything up so that client can call the app (FastAPI)
    def setUp(self):
        self.client = TestClient(app)

    def test_get_all_users(self):
        # Arrange
        # (Instead of injecting/checking the actual UserQueries class,
        # we tell FastAPI to inject the fake one instead - EmptyUserQueries)
        app.dependency_overrides[UserQueries] = EmptyUsersQueries
        # Act
        # (Do a get request on this url and give a response back)
        response = self.client.get("/api/users")
        # Assert (Test)
        # simple test to check if the status of our response is OK
        assert response.status_code == 200
        # test the output of the response and check if the JSON we got back was the correct JSON
        # response.json() converts the response to JSON and then checks if it is an empty list
        assert response.json() == []
        # Cleanup
        # Makes sure our fakes don't last past this test
        # so this test doesn't effect the other tests
        app.dependency_overrides = {}

    def test_get_single_user(self):
        # Arrange
        app.dependency_overrides[UserQueries] = SingleUserQueries
        # Arrange
        response = self.client.get("/api/users/")
        # Assert
        # assert response.status_code == 200
        self.assertEqual(200, response.status_code)
        # Using self.assertEqual is better to find where your mistakes are in the errors log
        # Test that first argument and second argument are equal. If the values do not compare equal,
        # the test will fail.
        self.assertEqual(response.json(), [example_user])
        # Cleanup
        app.dependency_overrides = {}

    def test_get_all_rated_items(self):
        app.dependency_overrides[RatedItemQueries] = EmptyRatedItemQueries
        response = self.client.get("/api/rated-items")
        self.assertEqual(200, response.status_code)
        app.dependency_overrides = {}

    def test_get_single_rated_item(self):
        app.dependency_overrides[RatedItemQueries] = SingleRatedItemQueries
        response = self.client.get("/api/rated-items")
        self.assertEqual(response.json(), [example_rated_item])
        app.dependency_overrides = {}

    def test_get_users_rated_item(self):
        # Arrange
        app.dependency_overrides[UserQueries] = ExampleUserQueries
        app.dependency_overrides[RatedItemQueries] = UsersRatedItemQueries
        # Login with the fake user (POST)
        self.client.post(
            "/api/auth/signin",
            json={
                "username": "love2code",
                "password": example_password,
            },
        )
        # Act
        response = self.client.get("/api/rated-items/users/1")

        # Assert
        self.assertEqual(200, response.status_code)
        self.assertEqual(response.json(), [example_rated_item])
        app.dependency_overrides = {}
