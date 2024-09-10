import psycopg
from psycopg.rows import class_row
import os
import json
import requests_cache

from psycopg_pool import ConnectionPool
from rich import print
from pydantic import BaseModel
from models.genres_movies import Genres_Movies
from models.movies import (
    Movie,
    MovieWithGenre,
    ExtendedMovie,
    MovieRequest,
    Genre,
)
from utils.exceptions import (
    DatabaseURLException,
    MovieNotFoundException,
    MovieCreateException,
    GenreMovieCreateException,
)


session = requests_cache.CachedSession()


database_url = os.environ.get("DATABASE_URL")
if database_url is None:
    raise DatabaseURLException(
        "You forgot to define DATABASE_URL in your environment"
    )


class MovieAPIIDS(BaseModel):
    id: int


class MovieAPIGenre(BaseModel):
    id: int
    name: str


class MovieAPIResponse(BaseModel):
    title: str
    image_url: str
    tagline: str
    synopsis: str
    release_date: str
    runtime: int
    tmdb_id: int
    genres: list[MovieAPIGenre]


pool = ConnectionPool(database_url)

TMDB_API_KEY = os.environ.get("API_KEY")
search_url = "https://api.themoviedb.org/3/search/movie"


def create_image_url(poster_path):
    return f"https://image.tmdb.org/t/p/w600_and_h900_bestv2{poster_path}"


def createURL(id) -> str:
    return f"https://api.themoviedb.org/3/movie/{id}?api_key={TMDB_API_KEY}"


class MovieQueries:
    def search_movies(self, query) -> list[ExtendedMovie] | None:
        params = {"query": query, "api_key": TMDB_API_KEY}
        try:
            search_response = session.get(search_url, params)
            search_results = json.loads(search_response.content).get("results")
            all_ids = [MovieAPIIDS(**movie) for movie in search_results]
            if len(all_ids) < 10:
                all_ids = all_ids[:10]
            all_movies = []
            for id in all_ids:
                detail_response = session.get(createURL(id.id))
                detail_results = json.loads(detail_response.text)
                all_movies.append(
                    MovieAPIResponse(
                        title=detail_results["title"],
                        image_url=create_image_url(
                            detail_results["poster_path"]
                        ),
                        synopsis=detail_results["overview"],
                        tagline=detail_results["tagline"],
                        release_date=detail_results["release_date"],
                        runtime=detail_results["runtime"],
                        tmdb_id=detail_results["id"],
                        genres=detail_results["genres"],
                    )
                )
            return all_movies
        except Exception as e:
            print(e)
            raise Exception(e)

    def get_all_movies(self) -> list[ExtendedMovie] | None:
        """
        Gets all movies
        """
        try:
            with pool.connection() as conn:
                with conn.cursor(row_factory=class_row(ExtendedMovie)) as cur:
                    result = cur.execute(
                        """--sql
                            SELECT
                                movies.id as id,
                                movies.title as title,
                                movies.image_url,
                                movies.tagline,
                                movies.synopsis,
                                movies.release_date,
                                movies.runtime,
                                movies.tmdb_id,
                                JSON_AGG(genres.*) as genres
                            FROM movies
                            JOIN genres_movies
                            ON movies.id = genres_movies.movie_id
                            JOIN genres ON genres_movies.genre_id = genres.id
                            GROUP BY movies.id
                            ORDER BY movies.title;
                        """
                    )
                    movies = result.fetchall()
                    return movies
        except psycopg.Error as e:
            print(e)
            pass

    def get_genres_movies(self, id: int) -> MovieWithGenre | None:
        """
        Gets all genres for a movie
        """
        try:
            with pool.connection() as conn:
                with conn.cursor(row_factory=class_row(MovieWithGenre)) as cur:
                    result = cur.execute(
                        """--sql
                        SELECT
                            movies.id as movie_id,
                            movies.title as title,
                            JSON_AGG(genres.name) as genres
                        FROM movies
                        JOIN genres_movies
                        ON movies.id = genres_movies.movie_id
                        JOIN genres ON genres_movies.genre_id = genres.id
                        WHERE movies.id = %(id)s
                        GROUP BY movies.id;
                        """,
                        {"id": id},
                    )
                    movie = result.fetchone()
                    if movie is None:
                        raise MovieNotFoundException(
                            f"Movie: {id} not found in the database"
                        )
                    return movie
        except psycopg.Error as e:
            print(e)
            pass

    def get_single_movie(self, id: int) -> ExtendedMovie | None:
        """
        Gets all details for a single movie
        """
        try:
            with pool.connection() as conn:
                with conn.cursor(row_factory=class_row(ExtendedMovie)) as cur:
                    result = cur.execute(
                        """--sql
                            SELECT
                                movies.id,
                                movies.title,
                                movies.image_url,
                                movies.tagline,
                                movies.synopsis,
                                movies.release_date,
                                movies.runtime,
                                movies.tmdb_id,
                                JSON_AGG(genres.*) as genres
                            FROM movies
                            JOIN genres_movies
                            ON movies.id = genres_movies.movie_id
                            JOIN genres ON genres_movies.genre_id = genres.id
                            WHERE movies.id = %(id)s
                            GROUP BY movies.id;
                            """,
                        {"id": id},
                    )
                    movie = result.fetchone()
                    if movie is None:
                        raise MovieNotFoundException(
                            f"Movie: {id} not found in the database"
                        )
                    return movie
        except psycopg.Error as e:
            print(e)
            pass

    def create_genres_movies(
        self,
        movie_id: int,
        genre_id: int,
    ) -> Genres_Movies | None:
        try:
            with pool.connection() as conn:
                with conn.cursor(row_factory=class_row(Genres_Movies)) as cur:
                    result = cur.execute(
                        """--sql
                            INSERT INTO genres_movies (
                                movie_id,
                                genre_id
                            )
                            VALUES(
                                %(movie_id)s,
                                %(genre_id)s
                            )
                            RETURNING *
                        """,
                        {
                            "movie_id": movie_id,
                            "genre_id": genre_id,
                        },
                    )
                    new_genre_movie = result.fetchone()
                    if new_genre_movie is None:
                        raise GenreMovieCreateException(
                            "could not create the genre movie item"
                        )
                    return new_genre_movie
        except psycopg.Error as e:
            print(e)
            pass

    def create_movie(self, movie: MovieRequest) -> ExtendedMovie | None:
        try:
            with pool.connection() as conn:
                # starts up a connection transaction
                # done make sure all operations succeed
                # or all operations fail
                # this method will either completely work
                # or nothing will happen
                with conn.transaction():
                    # creates cursor with row class of Movie
                    with conn.cursor(row_factory=class_row(Movie)) as cur:
                        result = cur.execute(
                            """--sql
                                INSERT INTO movies (
                                    title,
                                    image_url,
                                    tagline,
                                    synopsis,
                                    release_date,
                                    runtime,
                                    tmdb_id
                                )
                                VALUES(
                                    %(title)s,
                                    %(image_url)s,
                                    %(tagline)s,
                                    %(synopsis)s,
                                    %(release_date)s,
                                    %(runtime)s,
                                    %(tmdb_id)s
                                )
                                RETURNING *
                            """,
                            {
                                "title": movie.title,
                                "image_url": movie.image_url,
                                "tagline": movie.tagline,
                                "synopsis": movie.synopsis,
                                "release_date": movie.release_date,
                                "runtime": movie.runtime,
                                "tmdb_id": movie.tmdb_id,
                            },
                        )
                        # pulls newly created movie
                        # and assigns it to a variable
                        new_movie = result.fetchone()
                        if new_movie is None:
                            print("failed to create movie")
                            raise MovieCreateException(
                                "could not create the movie"
                            )
                        # grabs the id for the newly created movie
                        new_id = new_movie.id
                        # creates a list of tuples for the movie and
                        # genre id to be added to the genres_movies table
                        genrelist = [
                            (new_id, genre.id) for genre in movie.genres
                        ]
                    # creates a new cursor for adding
                    # genres_movies database items
                    with conn.cursor(
                        row_factory=class_row(Genres_Movies)
                    ) as genres_movie_cur:
                        # excetute many to loop through all genres
                        # and add each one to the SQL
                        # eventually adding all of them
                        genres_movie_cur.executemany(
                            """--sql
                                INSERT INTO genres_movies (
                                    movie_id,
                                    genre_id
                                )
                                VALUES(
                                    %s,
                                    %s
                                )
                            """,
                            genrelist,
                        )
                    # creates a new cursor to grab all the
                    # genre items just added with their associated movie
                    with conn.cursor(
                        row_factory=class_row(Genre)
                    ) as genres_cur:
                        genresresult = genres_cur.execute(
                            """--sql
                                select genres.* from genres
                                join genres_movies
                                ON genres_movies.genre_id = genres.id
                                join movies
                                ON genres_movies.movie_id = movies.id
                                where movies.id = %(new_id)s
                            """,
                            {"new_id": new_id},
                        )
                        # fetch all genre_movies items
                        # related to the newly created movie
                        genres = genresresult.fetchall()
                        # catch to break method if something went wrong
                        if new_movie is None:
                            raise MovieCreateException(
                                "could not create the movie"
                            )
                        # returns the newly created movie
                        # as an ExtendedMovie object
                        return ExtendedMovie(
                            **new_movie.model_dump(), genres=genres
                        )
        except psycopg.Error as e:
            print(e)
            pass

    def delete_movie(self, id: int):
        try:
            with pool.connection() as conn:
                with conn.cursor(row_factory=class_row(ExtendedMovie)) as cur:
                    cur.execute(
                        """--sql
                            DELETE FROM movies
                            WHERE id = %(id)s
                            """,
                        {"id": id},
                    )
                    if cur.rowcount == 0:
                        raise MovieNotFoundException(
                            f"Movie: {id} not found in the database"
                        )
                    conn.commit()
                    return f"Movie at id: {id} has been successfully deleted"
        except psycopg.Error as e:
            print(e)
            pass
