# from unittest import TestCase
# from fastapi.testclient import TestClient
# from main import app
# from queries.movie_picks_queries import MoviePickQueries
# from models.movie_picks import RandomMoviePick


# client = TestClient(app)

# fakeRandomMoviePick = {"title": "Star Wars: A New Hope"}


# # fake query
# class EmptyMoviePickQueries:
#     def get_random_movie_pick(
#         self, movie_nights_id: int
#     ) -> RandomMoviePick | None:
#         return None


# class SingleMoviePickQueries:
#     def get_random_movie_pick(
#         self, movie_nights_id: int
#     ) -> RandomMoviePick | None:
#         return RandomMoviePick(**fakeRandomMoviePick)


# class TestRandomMoviePick(TestCase):
#     def test_get_random_movie_pick_empty(self):
#         # Arrange
#         app.dependency_overrides[MoviePickQueries] = EmptyMoviePickQueries
#         # Act
#         response = client.get("/api/movie-picks/random/1")
#         # Assert
#         assert response.status_code == 200
#         assert response.json() is None
#         # Cleanup
#         app.dependency_overrides = {}

#     def test_get_random_movie_pick_single(self):
#         # Arrange
#         app.dependency_overrides[MoviePickQueries] = SingleMoviePickQueries
#         # Act
#         response = client.get("/api/movie-picks/random/1")
#         # Assert
#         assert response.status_code == 200
#         self.assertEqual(response.json(), [fakeRandomMoviePick])
#         # Cleanup
#         app.dependency_overrides = {}

from unittest import TestCase
from fastapi.testclient import TestClient
from main import app
from queries.movie_picks_queries import MoviePickQueries
from models.movie_picks import RandomMoviePick

client = TestClient(app)

fakeRandomMoviePick = {"title": "Star Wars: A New Hope"}


class EmptyMoviePickQueries:
    def get_random_movie_pick(
        self, movie_nights_id: int
    ) -> RandomMoviePick | None:
        return None


class SingleMoviePickQueries:
    def get_random_movie_pick(
        self, movie_nights_id: int
    ) -> RandomMoviePick | None:
        return RandomMoviePick(**fakeRandomMoviePick)


class TestRandomMoviePick(TestCase):
    def setUp(self):
        self.client = TestClient(app)

    def test_get_random_movie_pick_empty(self):
        # Arrange
        app.dependency_overrides[MoviePickQueries] = EmptyMoviePickQueries
        # Act
        response = self.client.get("/api/movie-picks/random/1")
        # Assert
        assert response.status_code == 200
        assert response.json() is None
        # Cleanup
        app.dependency_overrides = {}

    def test_get_random_movie_pick_single(self):
        # Arrange
        app.dependency_overrides[MoviePickQueries] = SingleMoviePickQueries
        # Act
        response = self.client.get("/api/movie-picks/random/1")
        # Assert
        assert response.status_code == 200
        self.assertEqual(response.json(), fakeRandomMoviePick)
        # Cleanup
        app.dependency_overrides = {}
