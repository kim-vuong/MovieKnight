"""
Entry point for the FastAPI Application
"""

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from routers import (
    auth_router,
    genre_router,
    movie_router,
    movie_night_router,
    attendees_router,
    movie_picks_router,
    users_router,
    rated_items_router,
)
import os

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=[os.environ.get("CORS_HOST", "http://localhost:5173")],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth_router.router)
app.include_router(genre_router.router)
app.include_router(movie_router.router)
app.include_router(movie_night_router.router)
app.include_router(attendees_router.router)
app.include_router(movie_picks_router.router)
app.include_router(users_router.router)
app.include_router(rated_items_router.router)


@app.get("/api/launch-details")
def launch_details():
    return {
        "launch_details": {
            "module": 3,
            "week": 17,
            "day": 5,
            "hour": 19,
            "min": "00",
        }
    }
