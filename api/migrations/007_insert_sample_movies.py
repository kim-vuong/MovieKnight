steps = [
    [
        # Up
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
            VALUES
            (
                'Star Wars',
                'https://image.tmdb.org/t/p/w600_and_h900_bestv2/6FfCtAuVAW8XJjZ7eWeLibRLWTw.jpg',
                'A long time ago in a galaxy far, far away...',
                'Princess Leia is captured and held hostage by the evil Imperial forces in their effort to take over the galactic Empire. Venturesome Luke Skywalker and dashing captain Han Solo team together with the loveable robot duo R2-D2 and C-3PO to rescue the beautiful princess and restore peace and justice in the Empire',
                '1977-05-25',
                121,
                11
            ),
            (
                'The Empire Strikes Back',
                'https://image.tmdb.org/t/p/w600_and_h900_bestv2/nNAeTmF4CtdSgMDplXTDPOpYzsX.jpg',
                'The Star Wars saga continues.',
                'The epic saga continues as Luke Skywalker, in hopes of defeating the evil Galactic Empire, learns the ways of the Jedi from aging master Yoda. But Darth Vader is more determined than ever to capture Luke. Meanwhile, rebel leader Princess Leia, cocky Han Solo, Chewbacca, and droids C-3PO and R2-D2 are thrown into various stages of capture, betrayal and despair.',
                '1980-05-20',
                124,
                1891
            ),
            (
                'Return of the Jedi',
                'https://image.tmdb.org/t/p/w600_and_h900_bestv2/jQYlydvHm3kUix1f8prMucrplhm.jpg',
                'Return to a galaxy far, far away.',
                'Luke Skywalker leads a mission to rescue his friend Han Solo from the clutches of Jabba the Hutt, while the Emperor seeks to destroy the Rebellion once and for all with a second dreaded Death Star.',
                '1983-05-25',
                132,
                1892
            )
        """,
        # Down
        """
        """,
    ]
]
