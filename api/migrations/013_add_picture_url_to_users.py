steps = [
    [
        # "Up" SQL statement: Add the 'picture_url' column to 'users' table
        """--sql
        ALTER TABLE users
        ADD COLUMN picture_url TEXT NOT NULL DEFAULT 'https://t4.ftcdn.net/jpg/02/15/84/43/360_F_215844325_ttX9YiIIyeaR7Ne6EaLLjMAmy4GvPC69.jpg';
        """,
        # "Down" SQL statement
        """--sql
        ALTER TABLE users
        DROP COLUMN picture_url;
        """,
    ]
]
