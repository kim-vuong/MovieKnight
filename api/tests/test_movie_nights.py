from unittest import TestCase
from fastapi.testclient import TestClient
from main import app
from queries.movie_night_queries import MovieNightQueries
from models.movie_nights import MovieNight


client = TestClient(app)

fakeMovieNight = {
    "id": 5,
    "name": "Seb's Movie Night",
    "date": "2024-08-27",
    "in_person": True,
    "location": "Seb's House",
}


# fake query
class EmptyMovieNightQueries:
    def get_all_movie_nights(self) -> list[MovieNight]:
        return []


class SingleMovieNightQueries:
    def get_all_movie_nights(self) -> list[MovieNight] | None:
        return [MovieNight(**fakeMovieNight)]


class TestMovieNights(TestCase):
    def test_get_all_movie_nights(self) -> list[MovieNight] | None:
        # Arrange
        app.dependency_overrides[MovieNightQueries] = EmptyMovieNightQueries
        # Act
        response = client.get("/api/movie-nights")
        # Assert
        assert response.status_code == 200
        assert response.json() == []
        # Cleanup
        app.dependency_overrides = {}

    def test_get_single_movie_night(self) -> list[MovieNight] | None:
        # Arrange
        app.dependency_overrides[MovieNightQueries] = SingleMovieNightQueries
        # Act
        response = client.get("/api/movie-nights")
        # Assert
        assert response.status_code == 200
        self.assertEqual(response.json(), [fakeMovieNight])
        # Cleanup
        app.dependency_overrides = {}
