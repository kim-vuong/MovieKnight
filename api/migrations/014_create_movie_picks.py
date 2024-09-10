steps = [
    [
        # Up
        """--sql
            CREATE TABLE
                IF NOT EXISTS movie_picks(
                    id SERIAL PRIMARY KEY NOT NULL,
                    movies_id INT NOT NULL,
                    attendees_id INT NOT NULL,
                    FOREIGN KEY (movies_id)
                    REFERENCES movies (id) ON DELETE CASCADE,
                    FOREIGN KEY (attendees_id)
                    REFERENCES attendees (id) ON DELETE CASCADE
                );
        """,
        # Down
        """--sql
            DROP TABLE IF EXISTS movie_picks;
        """,
    ]
]
