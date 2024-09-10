# Movie Knight

-   Andrew Peters
-   Connor Tidwell
-   Daniel Kim
-   Max Vuong
-   Sebastian Davis

Movie Knight - your one stop shop to keep track of your Movie Watchlist and friend Movie Nights

## Design

-   [API design](docs/API-documentation.md)
-   [DB schema](docs/movieknight-db-schema.png)

## Intended market

We are targeting people who enjoy watching movies and want a place to keep track of all the movies that they are planning to watch and have watched. We also target people who want an easy way to coordinate group movie nights so that they can get together and watch movies together.

## Functionality

-   Visitors to the site can sign up to help keep track of a list of movies that they have not watched, but plan to, along with a list of movies they have watched. They can leave reviews and ratings for movies they have watched.
-   Users can search a third party database to add movies to our database if one of the movies they want to add to their list is not already in our local movie database.
-   There is a list page containing all movies in our local database that has a search functionality should the User want to find a specific movie quickly.
-   There is a page that will show all the details we have saved about a movie. The page will also contain buttons to allow the user to add the movie to their watchlist and to let them review it, given they have already seen it.
-   Users can view a list of movies they have watched, a list of movies they haven't wathced, but want to, and a list of movies they have reviewed.
-   Users can make a tierlist of all movies in their list, which can be saved and viewed again.
-   Users can create a Movie Night where they can specify a date and a location for their event.
-   Users can view a list page of all Movie Nights that have been planned and navigate to a selected a Movie Night detail page.
-   Users can view the details of a specified Movie Night and add themselves to a list of attendees for that Movie Night.
-   Attendees for a Movie Night can select 3 Movie Picks for each Movie Night that they are attending.
-   There is button on the Movie Night detail page that allows a User to generate a Random Movie Pick from the list of picks for that Movie Night

## Project Initialization

To fully enjoy this application on your local machine, please make sure to follow these steps:

1. Clone the repository down to your local machine
2. CD into the new project directory
3. Run `docker compose build`
4. Run `docker compose up`
5. Enjoy Movie Knight!
