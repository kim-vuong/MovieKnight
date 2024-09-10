steps = [
    [
        # Up
        """--sql
            CREATE TABLE
                IF NOT EXISTS movie_nights(
                    id SERIAL PRIMARY KEY NOT NULL,
                    name VARCHAR(50) NOT NULL,
                    date DATE NOT NULL,
                    in_person BOOLEAN NOT NULL,
                    location VARCHAR(100)
                );
        """,
        # Down
        """--sql
            DROP TABLE IF EXISTS movie_nights;
        """,
    ]
]
