steps = [
    [
        # Up
        """--sql
            CREATE TABLE
                IF NOT EXISTS genres_movies(
                    movie_id INT,
                    genre_id INT,
                    PRIMARY KEY (movie_id, genre_id),
                    FOREIGN KEY (movie_id) REFERENCES movies (id) ON DELETE CASCADE,
                    FOREIGN KEY (genre_id) REFERENCES genres (id) ON DELETE CASCADE
                );
        """,
        # Down
        """--sql
            DROP TABLE IF EXISTS genres_movies;
        """,
    ]
]
