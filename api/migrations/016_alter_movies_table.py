steps = [
    [
        # "Up" SQL statement: Add the 'picture_url' column to 'users' table
        """--sql
        ALTER TABLE movies
        ADD UNIQUE (tmdb_id)
        """,
        # "Down" SQL statement
        """
        """,
    ]
]
