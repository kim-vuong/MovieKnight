steps = [
    [
        # Up
        """--sql
            CREATE TABLE IF NOT EXISTS rated_items (
                id SERIAL PRIMARY KEY NOT NULL,
                user_id INTEGER NOT NULL,
                movie_id INTEGER NOT NULL,
                user_rating INTEGER,
                review TEXT,
                watched BOOLEAN NOT NULL,
                tier VARCHAR(10),
                FOREIGN KEY (user_id)
                    REFERENCES users (id) ON DELETE CASCADE,
                FOREIGN KEY (movie_id)
                    REFERENCES movies (id) ON DELETE CASCADE
            );
        """,
        # Down
        """--sql
            DROP TABLE IF EXISTS rated_items;
        """,
    ]
]
