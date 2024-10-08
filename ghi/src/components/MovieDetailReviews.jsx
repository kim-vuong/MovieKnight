import { Link } from 'react-router-dom'

export default function MovieDetailReviews({ reviews, movie }) {
    return (
        <section className="mv-detail-reviews-container mt-40 border-t-2 border-b-2 rounded-xl border-slate-400 p-5">
            <h1 className="text-3xl text-white font-semibold">User Reviews</h1>
            <div className="mv-detail-single-review mt-14 flex-row">
                {reviews.length === 0 ||
                (reviews.length === 1 && reviews[0].review === '') ? (
                    <div className="no-review-container text-gray-300">
                        <p>
                            Currently no reviews for the movie "{movie.title}"
                        </p>
                        <p className="text-[1.1rem]">
                            Be a Knight in shining armor and leave the first
                            review{' '}
                            <Link
                                to={`/movies/${movie.id}/review`}
                                className="text-white font-bold"
                            >
                                here!
                            </Link>
                        </p>
                    </div>
                ) : (
                    reviews.map((review, index) => {
                        return review.review ? (
                            <div
                                key={review.id}
                                className={`review-box flex flex-row gap-3 items-start ${
                                    index !== reviews.length - 1
                                        ? 'border-b-2 border-gray-800 mb-8 pb-3'
                                        : ''
                                }`}
                            >
                                <img
                                    src={review.picture_url}
                                    alt={`${review.username}'s Review`}
                                    className="rounded-full w-10 h-10"
                                />
                                <div className="review-content">
                                    <p className="text-[1rem]">
                                        <span className="text-gray-400">
                                            Review by:{' '}
                                        </span>
                                        {review.username}
                                    </p>
                                    <p className="text-[1rem] -mt-3">
                                        Rating:{' '}
                                        <span className="text-white font-bold">
                                            {review.user_rating}
                                        </span>{' '}
                                        / 5
                                    </p>
                                    <p className="text-white text-[1.05rem] font-dmSans tracking-tight leading-6 max-w-[700px]">
                                        {review.review}
                                    </p>
                                </div>
                            </div>
                        ) : (
                            ''
                        )
                    })
                )}
            </div>
        </section>
    )
}
