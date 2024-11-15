import { Link } from 'react-router-dom'

export default function About() {
    return (
        <section className="main-containers mt-20">
            <div className="section-1 flex justify-between mb-40 font-dmSans">
                <div>
                    <h2 className="font-bold text-4xl text-[#d52b1e] mb-10">
                        Browse all of our Movies
                    </h2>
                    <div className="w-[85%] text-lg text-white leading-7 mb-14">
                        <p>
                            Whether you're a fan of fast-paced thrillers,
                            thought-provoking documentaries, or epic fantasy
                            adventures, you'll find something to suit your mood.
                            With our user-friendly interface, you can easily
                            browse through our extensive movie library. Create
                            and curate personalized watchlists, discover hidden
                            gems, add your own reviews, and get recommendations
                            based on your viewing history and preferences.
                        </p>
                    </div>
                    <Link
                        to="/movies"
                        className="bg-[#c0c0c0] text-white font-semibold rounded-full px-4 py-3 text-md"
                    >
                        Browse Movies
                    </Link>
                </div>
                <img
                    src="public/browse.png"
                    alt="Image of all movies in our database"
                    className="w-[40%]"
                />
            </div>
            <div className="section-2 flex justify-between gap-40 mb-40 font-dmSans">
                <img
                    src="public/quickadd.png"
                    alt="How to quickly add a movie to your watchlist, watched, or add a review"
                    className="w-[48%]"
                />
                <div>
                    <h2 className="font-bold text-4xl text-[#d52b1e] mb-10">
                        Effortless Movie Management
                    </h2>
                    <div className="text-lg leading-7 text-white">
                        <p>
                            With our streamlined features, managing your movie
                            experience has never been easier! Whether you're
                            discovering a new film or revisiting an old
                            favorite, you can quickly add movies to your
                            Watchlist with just a click. Planning your next
                            binge or curating a personalized movie marathon?
                            Simply add any movie to your Watchlist for easy
                            access later.
                        </p>
                    </div>
                </div>
            </div>
            <div className="section-3 flex justify-between font-dmSans">
                <div>
                    <h2 className="font-bold text-4xl text-[#d52b1e] mb-10">
                        Share Your Movies to our Movie Database
                    </h2>
                    <div className="w-[80%] text-lg text-white leading-7">
                        <p>
                            Found a movie you love or one you think is a hidden
                            gem? With just a click, you can add it to our
                            growing movie database! Once a movie is in our
                            system, it’s yours to explore—view detailed
                            information like plot summaries, cast and crew,
                            release dates, and more.
                        </p>
                        <p>
                            From there, you can dive deeper by writing your own
                            reviews, rating the film, and sharing your thoughts
                            with the community. Whether you're adding classics,
                            recent releases, or rare gems, your personal movie
                            collection is just a click away.
                        </p>
                    </div>
                </div>
                <img
                    src="public/add-to-db.png"
                    alt="How to add a movie to our database"
                    className="w-[40%]"
                />
            </div>
        </section>
    )
}
