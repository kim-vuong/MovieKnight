steps = [
    [
        # Up
        """--sql
            CREATE TABLE
                IF NOT EXISTS movies(
                    id SERIAL PRIMARY KEY NOT NULL,
                    title VARCHAR(50) NOT NULL,
                    image_url VARCHAR(200) NOT NULL,
                    tagline VARCHAR(100) NOT NULL,
                    synopsis TEXT NOT NULL,
                    release_date DATE NOT NULL,
                    runtime INT NOT NULL,
                    tmdb_id INT NOT NULL
                );
        """,
        # Down
        """--sql
            DROP TABLE IF EXISTS movies;
        """,
    ]
]
