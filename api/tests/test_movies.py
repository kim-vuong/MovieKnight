from unittest import TestCase
from fastapi.testclient import TestClient
from main import app
from queries.movie_queries import MovieQueries
from models.movies import ExtendedMovie, MovieWithGenre, MovieDeleteResponse
from fastapi import HTTPException

fakeMovie = {
    "id": 1,
    "title": "Star Wars",
    "image_url": "https://image.tmdb.org/t/p/w600_and_h900_bestv2/6FfCtAuVAW8XJjZ7eWeLibRLWTw.jpg",
    "tagline": "A long time ago in a galaxy far, far away...",
    "synopsis": "The First Star Wars Movie",
    "release_date": "1977-05-25",
    "runtime": 121,
    "tmdb_id": 11,
    "genres": [
        {"id": 1, "tmdb_id": 28, "name": "Action"},
        {"id": 2, "tmdb_id": 12, "name": "Adventure"},
        {"id": 15, "tmdb_id": 878, "name": "Science Fiction"},
    ],
}
fakeMovieGenres = {
    "movie_id": 1,
    "title": "Star Wars",
    "genres": ["Action", "Adventure", "Science Fiction"],
}


class EmptyMovieQueries:
    def get_all_movies(self) -> list[ExtendedMovie]:
        return []


class SingleMovieQueries:
    def get_all_movies(self) -> list[ExtendedMovie]:
        return [ExtendedMovie(**fakeMovie)]


class SingleGenreQueries:
    def get_genres_movies(self, id: int) -> MovieWithGenre:
        return MovieWithGenre(**fakeMovieGenres)


# Andrew's Delete Test
class DeleteMovieQueries:
    def delete_movie(self, id: int):
        if id == 1:
            return "Movie at id: 1 has been successfully deleted"
        raise HTTPException(status_code=400, detail="Movie does not exist")


class TestMovies(TestCase):
    def setUp(self):
        self.client = TestClient(app)

    def test_get_all_movies(self):
        # Arrange
        app.dependency_overrides[MovieQueries] = EmptyMovieQueries
        # Act
        response = self.client.get("/api/movies/")
        # Assert
        assert response.status_code == 200
        assert response.json() == []
        # Cleanup
        app.dependency_overrides = {}

    def test_get_single_movie(self):
        # Arrange
        app.dependency_overrides[MovieQueries] = SingleMovieQueries
        # Act
        response = self.client.get("/api/movies/")
        # Assert
        assert response.status_code == 200
        self.assertEqual(
            response.json(),
            [fakeMovie],
        )
        # assert response.json() == [fakeMovie]
        # Cleanup
        app.dependency_overrides = {}

    def test_get_single_movie_genres(self):
        # Arrange
        app.dependency_overrides[MovieQueries] = SingleGenreQueries
        # Act
        response = self.client.get("/api/movies/1/genres")
        # Assert
        assert response.status_code == 200
        self.assertEqual(
            response.json(),
            fakeMovieGenres,
        )
        # Cleanup
        app.dependency_overrides = {}

    # Andrew's Delete Test
    def test_delete_movie_success(self):
        # Arrange
        app.dependency_overrides[MovieQueries] = DeleteMovieQueries
        # Act
        response = self.client.delete("/api/movies/1")
        # Assert
        assert response.status_code == 200
        expected_response = MovieDeleteResponse(
            movie_id=1, message="Movie has been deleted"
        )
        self.assertEqual(response.json(), expected_response.model_dump())
        # Cleanup
        app.dependency_overrides = {}

    def test_delete_movie_not_found(self):
        # Arrange
        app.dependency_overrides[MovieQueries] = DeleteMovieQueries
        # Act
        response = self.client.delete("/api/movies/999")
        # Assert
        assert response.status_code == 400
        self.assertEqual(response.json(), {"detail": "Movie does not exist"})
        # Cleanup
        app.dependency_overrides = {}
