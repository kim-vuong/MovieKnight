from unittest import TestCase
from fastapi.testclient import TestClient
from main import app
from models.rated_items import RatedItem, RatedItemBase
from queries.rated_items_queries import RatedItemQueries


fakeRatedItem = {
    "id": 1,
    "user_id": 1,
    "movie_id": 1,
    "user_rating": 5,
    "review": "Great movie!",
    "watched": True,
    "tier": "A",
}

fakeRatedItemWithMovieDetails = {
    "user_id": 1,
    "movie_id": 1,
    "user_rating": 5,
    "review": "Great movie!",
    "watched": True,
    "tier": "A",
    "movie_title": "Star Wars",
    "movie_image_url": "https://image.tmdb.org/t/p/w600_and_h900_bestv2/6FfCtAuVAW8XJjZ7eWeLibRLWTw.jpg",
}


class EmptyRatedItemQueries:
    def get_all_rated_items(self) -> list[RatedItem]:
        return []

    def get_rated_items_with_movie_details(self) -> list[dict] | None:
        return []

    def get_rated_items_by_user(self, user_id: int) -> list[RatedItem] | None:
        return []

    def get_rated_item_by_user_and_movie(
        self, user_id: int, movie_id: int
    ) -> RatedItem | None:
        return None

    def update_rated_item(
        self, user_id: int, movie_id: int, rated_item: RatedItemBase
    ) -> RatedItem | None:
        return None

    def delete_rated_item(self, user_id: int, movie_id: int) -> bool:
        return False


class SingleRatedItemQueries:
    def get_all_rated_items(self) -> list[RatedItem]:
        return [RatedItem(**fakeRatedItem)]

    def get_rated_items_with_movie_details(self) -> list[dict] | None:
        return [fakeRatedItemWithMovieDetails]

    def get_rated_items_by_user(self, user_id: int) -> list[RatedItem] | None:
        if user_id == 1:
            return [RatedItem(**fakeRatedItem)]
        return []

    def get_rated_item_by_user_and_movie(
        self, user_id: int, movie_id: int
    ) -> RatedItem | None:
        if user_id == 1 and movie_id == 1:
            return RatedItem(**fakeRatedItem)
        return None

    def update_rated_item(
        self, user_id: int, movie_id: int, rated_item: RatedItemBase
    ) -> RatedItem | None:
        if user_id == 1 and movie_id == 1:
            return RatedItem(
                id=1,
                user_id=user_id,
                movie_id=movie_id,
                user_rating=rated_item.user_rating,
                review=rated_item.review,
                watched=rated_item.watched,
                tier=rated_item.tier,
            )
        return None

    def delete_rated_item(self, user_id: int, movie_id: int) -> bool:
        return user_id == 1 and movie_id == 1


class TestRatedItems(TestCase):
    def setUp(self):
        self.client = TestClient(app)

    def test_get_all_rated_items(self):
        # Arrange
        app.dependency_overrides[RatedItemQueries] = EmptyRatedItemQueries
        # Act
        response = self.client.get("/api/rated-items/")
        # Assert
        assert response.status_code == 200
        assert response.json() == []
        # Cleanup
        app.dependency_overrides = {}

    def test_get_single_rated_item(self):
        # Arrange
        app.dependency_overrides[RatedItemQueries] = SingleRatedItemQueries
        # Act
        response = self.client.get("/api/rated-items/users/1/movies/1")
        # Assert
        assert response.status_code == 200
        assert response.json() == fakeRatedItem
        # Cleanup
        app.dependency_overrides = {}

    def test_get_rated_items_with_movie_details(self):
        # Arrange
        app.dependency_overrides[RatedItemQueries] = SingleRatedItemQueries
        # Act
        response = self.client.get("/api/rated-items/with-movie-details")
        # Assert
        assert response.status_code == 200
        assert response.json() == [fakeRatedItemWithMovieDetails]
        # Cleanup
        app.dependency_overrides = {}

    def test_get_rated_items_by_user(self):
        # Arrange
        app.dependency_overrides[RatedItemQueries] = SingleRatedItemQueries
        # Act
        response = self.client.get("/api/rated-items/users/1")
        # Assert
        assert response.status_code == 200
        assert response.json() == [fakeRatedItem]
        # Cleanup
        app.dependency_overrides = {}

    def test_create_rated_item(self):
        # Arrange
        new_rated_item = {
            "user_id": 1,
            "movie_id": 1,
            "user_rating": 4,
            "review": "Not bad!",
            "watched": True,
            "tier": "B",
        }

        class CreateRatedItemQueries:
            def create_rated_item(
                self, rated_item: RatedItemBase
            ) -> RatedItem | None:
                return RatedItem(id=1, **rated_item.model_dump())

        app.dependency_overrides[RatedItemQueries] = CreateRatedItemQueries
        # Act
        response = self.client.post("/api/rated-items/", json=new_rated_item)
        # Assert
        assert response.status_code == 200
        assert response.json() == {**new_rated_item, "id": 1}
        # Cleanup
        app.dependency_overrides = {}

    def test_delete_rated_item(self):
        # Arrange
        class DeleteRatedItemQueries:
            def delete_rated_item(self, user_id: int, movie_id: int) -> bool:
                return user_id == 1 and movie_id == 1

        app.dependency_overrides[RatedItemQueries] = DeleteRatedItemQueries
        # Act
        response = self.client.delete("/api/rated-items/users/1/movies/1")
        # Assert
        assert response.status_code == 200
        assert response.json() == {"detail": "Rated item deleted"}
        # Cleanup
        app.dependency_overrides = {}
