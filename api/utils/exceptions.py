"""
Custom Exceptions for the App
"""


class UserDatabaseException(Exception):
    pass


class UserDoesNotExist(Exception):
    pass


class UserDatabaseError(Exception):
    pass


class DatabaseURLException(Exception):
    pass


class MovieNightDoesNotExist(Exception):
    pass


class MovieNightDataBaseError(Exception):
    pass


class MovieNightCreationError(Exception):
    pass


class MoviePickDataBaseError(Exception):
    pass


class AttendeeDataBaseError(Exception):
    pass


class MovieNotFoundException(Exception):
    pass


class MovieCreateException(Exception):
    pass


class GenreMovieCreateException(Exception):
    pass
