steps = [
    [
        # Up
        """--sql
            CREATE TABLE
                IF NOT EXISTS attendees(
                    id SERIAL PRIMARY KEY NOT NULL,
                    movie_nights_id INT NOT NULL,
                    user_id INT NOT NULL,
                    host BOOLEAN NOT NULL,
                    FOREIGN KEY (movie_nights_id)
                    REFERENCES movie_nights (id) ON DELETE CASCADE,
                    FOREIGN KEY (user_id)
                    REFERENCES users (id) ON DELETE CASCADE
                );
        """,
        # Down
        """--sql
            DROP TABLE IF EXISTS attendees;
        """,
    ]
]
