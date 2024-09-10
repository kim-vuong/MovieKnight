steps = [
    [
        # Up
        """--sql
            CREATE TABLE
                IF NOT EXISTS genres(
                id SERIAL PRIMARY KEY NOT NULL,
                tmdb_id INT NOT NULL,
                name VARCHAR(50) NOT NULL
                );
        """,
        # Down
        """--sql
            DROP TABLE IF EXISTS genres;
        """,
    ]
]
