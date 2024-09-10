## August 5, 2024

-   Added the first draft of our front-end API documentation
-   Tested merge requests
-   Created multiple issue logs specifying features from our wireframe

Today I created a new branch and exported the first draft of our front-end API documentation into a new file named frontend-API-documentation.md. With this new file, I learned how to properly make a merge request to main (auto deleted branch after completion of merge / no squashing). I also created three (3) issues in which each define specific features of our project that all include user stories, features, acceptance criteria, and definition of done (DoD).

## August 6, 2024

-   Application Design Presentation
-   Discussion/Review with Bart Dorsey

As a team, we assessed our application design, issues, and wireframe. During our application design presentation, we went over our thought process and how we planned to implement all the features in our project. Bart Dorsey reviewed, critiqued, and provided necessary feedback on each of the features (Few examples: Discussing many-to-many relationships within multiple tables, component layouts, sorting the 'Reviews/Ratings' from highest rated to lowest - as this will serve as a semi tier list, infinite scrolling/pagination on large lists). We also received clarification on how to properly formulate features into issue logs (Attempt to capture the majority of details to make a feature complete).

## August 7, 2024

-   Collaborated with team on the structure of our Entities and Tables in our SQL Relational Model Diagram
-   Constructed + seeded a new database table
-   Created a new API endpoint
-   Composite primary key (Consists of two or more columns to uniquely identify a record in a table)

Working with a first draft of our SQL Relational Model Diagram, the team and I collaborated thoughts and discussed on how to improve the direction of our database tables/entities. We made the decision to remove the `genre` column/attribute in our movies table (`genres` table still in existence) and created a new table `movies_genres` that would hold both a `movie_id` and `genre_id` (establishing a many-to-many relationship). We also added a `tier` column into our `rated_items` table and removed the `tiers` table completely for simplicity. This diagram will constantly be reviewed and updated by our team. After discussion, I built and seeded our `movies` database table and created the API endpoint to list all of the movies in our database. This was done by making migrations + seeding (populating our database with initial data), creating a Pydantic model, query, router, and the router into our main.py.

Bart Dorsey's example of a composite primary key:

```
CREATE TABLE
    IF NOT EXISTS superhero_powers (
        superhero_id INT,
        power_id INT,
        PRIMARY KEY (superhero_id, power_id),
        FOREIGN KEY (superhero_id) REFERENCES superheroes (id),
        FOREIGN KEY (power_id) REFERENCES powers (id)
    );
```

## August 8, 2024

-   Daily stand-up
-   Mob programmed "genres_movies" database / API endpoint

To begin the day, we had our daily stand-up with Bart where we discussed what was accomplished the previous day (built/seeded two database tables and the API endpoints that accompanied them). Since we are planning on utilizing a third-party API (https://www.themoviedb.org/?language=en-US), Bart gave us a solid suggestion to use a Python package 'requests-cache', a persistent HTTP cache that provides better performance with the Python requests library. This will be implemented in the near future when the time arises in our project. After our stand-up, Andrew Peters mentioned that he had a minor issue while building/running his containers, which was resolved by simply providing a `POSTGRES_USER` and `POSTGRES_PASSWORD`. This was our only blocker for the day. Afterwards, Sebastian Davis was the driver as the team mob programmed in building out our 'genres_movies' table. Building this database table was a bit different than the first two due to the fact that it was a table that included two columns that were both foreign keys (movie_id and genre_id), resulting in a many-to-many relationship. Towards the tail end of our mob programming, we were receiving a null response when attempting to query a sample movie. The resolution to this was to remove the unneeded columns in our Pydantic `MovieWithGenre` model, only retrieving the details: `movie_id`, `title`, and list of genres associated with a specific movie. Once complete, the process of a merge request/approvals and pipeline tests were conducted successfully. Lastly, Max Vuong shared the third-party API key with the team and was safely stored on all ends.

## August 9, 2024

-   Daily stand-up
-   Mob programmed "movie_nights" database / API endpoint
-   Completely updated our issue logs

Today's standup consisted of detailing the prior day's mob programming. Afterwards, we continued on our one-table, one-API-endpoint per teammmate mob programming. Andrew Peters was the driver in building out the 'movie_nights' table / API endpoint. Learning from yesterday's drawbacks, we carefully assisted Andrew on creating the migration, `MovieNight` Pydantic model, `MovieNightQueries`, and routers. Testing was done via BeeKeeper with sample data to ensure proper functionality. A merge request and pipeline tests were successfully conducted. Next, we had a short team meeting about what tasks were to be prioritized and collectively we agreed that updating our issues was of importance so we split the issues evenly amongst ourselves, working on an individual level to update/edit our issues.

## August 12, 2024

-   Daily stand-up
-   Created a new issue log for altering the 'users' table
-   Updated user models, queries, routers to reflect new changes

The day began with our stand-up with Bart where I discussed the work that was previously done on Friday and what I was planning to complete today, as did the rest of the team. Today's blocker was when pulling from main and attempting to run our Docker containers, we all received a RuntimeError: `RuntimeError: Incompatible migration history at 008_create_genres_movies_join_table`. This was caused by a team member's minor reformatting of code after it had already been run. There was two valid resolutions to fixing this: the first was to format the code back to its original state, and the other was to dump our database by running the command: `docker compose down -v` and then `docker compose up -d`. The second resolution allows for a fresh database and runs all the migrations over. After the blocker was resolved, we all proceeded to complete our daily individual tasks/goals. Below is a rundown of what was completed on my end:

-   Created an issue log "Alter users database table" and set to 'In Progress'
-   Created a new migration `013_add_picture_url_to_users.py` which altered the 'users' table to add a new column 'picture_url' as `NOT NULL` and a `DEFAULT` value of a generic user icon
-   Updated all user models (UserRequest, UserResponse, UserWithPw) to include the `picture_url`. For UserRequest, I made `picture_url` as an optional field that allows users to specify a profile picture upon creation. If none is provided, the default value from the database will be used
-   In UserQueries, I've updated the `INSERT` query to include the `picture_url` value upon user creation and created a `get_all_users` method
-   Within the users router, two new endpoints were made. The first returns a list of all users in the database that routes to the API endpoint '/api/users'. The second returns a single user from the database that routes to the API endpoint '/api/users/{user_id}'

After a quick meeting with my team tomorrow, I plan on making a merge request for review to push the code to main.

## August 13, 2024

-   Daily stand-up
-   Merged yesterday's completed features into main
-   Two API endpoints created (PUT and DELETE for `users`)
-   Updated all functionality for `users` and Authentication (`signup`, `signin`, `signout`, `authenticate`)

After knocking out a quick stand-up, we all got to work on our individual tasks. I made a merge request for yesterday's features and pushed it to our main. I then began the building of the API endpoints for updating and deleting a user by a specified ID. Both API endpoints tested successfully via FastAPI - SwaggerUI. Sebastian later pointed out that he was unable to `signup` (create) a test user using the FastAPI - SwaggerUI (permissions were unauthorized). Realizing this was due to the body of the POST request needing to conform to the UserRequest model (that I modified yesterday to include `picture_url`) I made the following changes:

I updated the `create_user` method to use the `COALESCE` function on the value of the `picture_url` (`COALESCE(%s, '<DEFAULT USER IMG>')`). This function returns the first argument that is not null. I found this to be helpful since it ensures that even if the user omits the `picture_url` entirely, the database will insert the default value, thus preventing any issues with data missing.

To have the database use the default value when user does not provide the `picture_url`, next I updated the `signup` function to include it since `UserRequest` uses it as data validation (this was done by adding in the new argument of: `new_user.picture_url` in addition to the `new_user.username` and `hashed_password`).

Since the `UserResponse` for user `authenticate` and `signin` expected `picture_url` to be included, I added `picture_url=user.picture_url` to properly convert the `UserWithPw` to `UserResponse` to fulfill the requirements for full functionality

There were a few other updates needed to be made for all of the Authentication features to work properly:

-   Updated the `JWTUserData` to include the `picture_url` field
-   Updated the `generate_jwt` to include the `picture_url` in the `JWTUserData` object

## August 14, 2024

-   Daily stand-up
-   Reformatted/refactored `users` back-end
-   Solo planning on page layouts

Today was spent mainly reformatting and refactoring the `users` back-end for clean code. After, I installed TailwindCSS and studied the documentation for a bit to be be fully prepared to knock out layouts/styling once all functionality on the front-end is complete. I also began considerations and planning on how I would blueprint each component and page. Toward the end of the day, I was ready to begin building out the `UserDetail` component, which consisted of the authenticated user's details such as `username` and `picture_url`.

## August 15, 2024

-   Daily stand-up
-   Built the `UserDetail` component

Our team quickly got to work on their individual tasks once stand-up was complete. I made a merge request mainly to share the installed TailwindCSS with the team and began my first draft of the `UserDetail` React component. This was completed within the first hour, but I realized that it wasn't up to par with what I had anticipated. I initially wrote the code to grab a user's details by fetching the data through their designated ID, but this was not the most ideal logic since all I really needed to do was to use the custom `useAuthService` hook and utilize needed information stored in it (`users`, `isLoggedIn`). After refactoring my code using these and the helper function `tryFetch`, I was able to easily grab the authenticated user's information and apply it to the JSX to render out the component as intended. With my growing knowledge in TailwindCSS, I applied minimal styling to this component for now, with plans to revisit and enhance its design later this week.

## August 19, 2024

-   Daily stand-up
-   Built the `UserUpdate` component
-   Update and Delete additions to `UserDetail`

After our stand-up, I began building out the `UserUpdate` component, which allows an authenticated user to update/edit their information such as their `picture_url` (Profile Picture), `username`, and `password` with a form. Similarly to the `UserDetail` component, I utilized the `useAuthService` custom hook to grab needed information about the authenticated user, except for their password (security reasons). The `handleSubmit` async function was functional with the use of the helper function `tryFetch`. Lastly, the JSX was rendered to output a simple form that allows the user to update/edit their information. I then added the `Link` tag provided by `react-router-dom` in the `UserDetail` to render the `UserUpdate` form when clicked on. A delete option was also made that allows the authenticated user to delete their account after confirming a safety confirmation message. Upon confirmation, the now non-authenticated user is navigated to the home page. To make sure only an authenticated user is able to access the `UserDetail` page, I assigned a `useEffect` to check if a user `isLoggedIn` or if `user` is true. If either is false, they are navigated to the `signin` page.

Blocker: When the authenticated user attempts to update any field of their details, the component correctly renders the changes. However, the `/api/auth/authenticate` endpoint outputs the old details, which caused the updated details to revert back after the page refresh. The issue seemed to be that the JWT generated when the user logged in (which contained all of the user's data at the time of sign in). However, when the user attempts to update any field of their details, the JWT most likely isn't being regenerated, causing the old information to be rendered after the page refresh, until the user signs out/signs back in or the token itself expires.

Solution: To fix this issue, I decided to generate a new JWT that reflected the user's updated data and set it as a cookie in the response by making modifications in my `update_auth_user` endpoint in `users_routers.py`. First, I passed in the `Response` object as a parameter to the `update_auth_user` to handle the cookie. Then, I declared a variable `new_token` and initialized it with the value of the `generate_jwt` on the updated user data in the function body. Then, the new JWT was set as a cookie in the response using `response.set_cookie(...)`. After making these changes, I tested the updates using a test user both on SwaggerUI and the browser, which both outputed and returned the correct information even after a page refresh.

1. Once the user updates their details, the JWT is regenerated to show the updated data
2. The new JWT is sent in the response as a cookie
3. `/api/auth/authenticate` now reflects the updated user details

## August 20, 2024

-   Daily stand-up
-   Built the `UserProfile`, `UserMovies`, and `UserReviews` components

Today was spent mainly on the front-end. I built a `UserMovies` sub-component that fetches all the movies in the database and rated items of the authenticated user. I used the reduce method to return an array of movies that were "watched" by the user. To assure no duplicates were in the list of movies watched, I used the forEach method for removal of movies that were attempted to be added twice. I then made an array of watch list movies (to be watched) using a combination of the map, find, and filter method. With these arrays, I was able to successfully render the "Movies Watched" and "Watch List" movies in my JSX. Next was the `UserReviews` sub-component. Similar to the `UserMovies`, I fetched a list of all the movies in the database along with all the rated items for the authenticated user. Using a combination of map, find, and filter I initialized `userMovies` with the value of an array of all the movies/rated items linked to the user. For a review to be shown, the user's rated item must be "watched" and either a review or rating must be left. The JSX rendered for this component was minimal. Will definitely circle back to this later. Lastly, I built the `UserProfile` main component which included all User sub-components combined so far. The layout for this is still a work in progress. This component is to be focused on heavily shortly.

## August 21, 2024

-   Daily stand-up
-   Pair programmed with Max Vuong
-   Built the `MovieReviewForm` component

After our stand-up, I addressed the situation of how we could implement a more simple UI/UX for the watch list while still retaining the functionality and aesthetic with the team. After this short meeting, we all got to work on our individual tasks. After lunch, Max Vuong and I split off into our own break out room to focus on the tackling the movie watch list and review sections. We implemented two buttons into the movie detail page. Driven by Max, the "Add to Watchlist" button makes a POST request that adds the user id and movie id with watched defaulted to false in the new rated item. This allowed for the watch list movies to accumulate into the user's profile page ("Watch List" section) so they can view a list of movies to watch in the future. Next, I built the `MovieReviewForm` component. When the "Add a Review" button in the movie detail page was clicked, it renders a form which includes the movie title, movie poster, rating, and review. Upon submission of the review (POST request), the movie is automatically marked "watched", thus accumulating into the "Movies Watched" section in the user profile. Since the movie was rated/reviewed, the `UserReview` component also renders the review details on the user profile. Lastly, I created a "I Watched This" feature on the movie detail page that when clicked, makes a POST request with the user id, movie id, and watched defaulted to true. All of these are valuable additions made since I am now able to use this data for the user profile.

Tomorrow I plan to add PUT requests to the watch list, and watched list. The reason for this is because I've noticed that a user can have a movie "watched" without leaving a rating/review, but may want to write one later down the line. If they decide to leave a review on a movie after they marked watch, this creates a new entry in the list of rated_items. Using PUT will allow the rated item to just be updated.

## August 22, 2024

-   Implemented PUT and DELETE in `MovieReviewForm` and `MovieDetail` components
-   Studied multiple React libraries

Today, I implemented update and delete functionalities on the `MovieReviewForm` and `MovieDetail` components. In both components I created an async function `checkForExistingRI` that checks if the passed in arguments (user ID and movie ID) make up for an existing rated-item. If so, it returns the rated-item response. Utilizing this helper function was major since it allowed me to check if a new rated item should be created or if an existing one should be updated. This was needed because prior to this, a new entry in the database for rated-item was created regardless if the rated-item already existed. Flooding the database = big no no. After refactoring and rigariously testing my new code, I made a merge request and pushed to main. Studied on documentation for multiple different React libraries the remainder of the day.

## August 23, 2024

-   Documentation on multiple React libraries
-   Begin first phase of utilizing 'react-slick' for multi-item movie carousels for 'Watched' and 'Watch List'

Caught up on some more studying on different React libraries, trying to analyze which would pair best with our project. Since I wanted to add more visuals and aesthetic to the User profile page, I decided to use 'react-slick' to create multi-item movie carousels for my `UserMovies` component. Since I was planning on displaying multiple movies on each slide of the carousel, I figured this would be ideal to use. After reading a bit of the documentation, I jumped right into the code. Due to the limited time I had today, I was only able to get the skeleton structure complete. I plan on completing this feature early next Monday.

## August 26, 2024

-   Daily stand-up
-   Created a fully functional mult-item movie carousel for 'Watched' and "Watch List'

I was able to successfully format the settings and JSX to create multi-item movie carousels that showed up to four movies at a time. Since the user is able to drag and swipe the carousel with their mouse down, I also implemented a `isSwiping` state that doesn't allow for the movie detail being clicked and dragged on to be rendered until the swipe is fully complete and stopped. Before adding this, if the user mouse up's on a specific movie in the carousel while in the process of swiping, it would automatically render that movie detail, which wouldn't be a pleasant user experience. Next on my to-do list is to implement a form modal with the `UserUpdateModal` component to render a pop up form that allows the user to update/edit their details (all within their `UserProfile`).

## August 27, 2024

-   Daily stand-up
-   Documentation on 'antd'
-   Built a pop-up Form Modal leveraging 'antd'
-   Review lecture on unit tests
-   Completed unit tests (passes locally, will run on remote tomorrow)

Today's morning was spent reading documentation on the 'antd' library which includes a plethora of useful features, components, and designs. After the read, I decided to refactor my user 'Update' functionality that originally rendered a new page to a form modal utilizing 'antd' that would pop-up right on the user's profile for easy
access and seamless user experience. With this improvement, a user can have the update modal directly on their profile page, allowing them to update their information without navigating away. After completing and testing this new form, I decided to use 'antd' for the 'Delete' functionality on the user profile. Previously I used the window.confirm method which looked terrible in my opinion. It had a very stale, lifeless feel to it that I thought users wouldn't enjoy, so the only correct choice was to use a delete modal from 'antd'. I quickly made the changes and now had two modals utilizing 'antd'. To match the aesthetic and color scheme of our application, I override the default styling and added my own touch. After another round of testing all the functionality on the user profile, I made a merge request, in which Max approved and merged into main. Later on in the day, I rewatched a previous lecture to refresh my knowledge on unit testing. After finishing the lecture, I made five unit tests (two for users and three for rated items), which all passed. The unit test I felt I enjoyed the most was the one that required authentication. For this specific test, I had to create a fake user with a hashed password, call the sign-in feature with the fake user and used it to make a GET request to the rated items by user.

## August 28, 2024

-   Daily stand-up
-   Revamped Navbar

To begin the morning, I decided to take some time planning the design system on our entire application. I wanted to come up with a specific theme and feel for our site. After spending some time and grabbing inspiration, I got to work on implementing a completely new navigation bar. The first couple of attempts I made were thrown in the trash since I felt it didn't live up to the standards I was looking for. I was finally able to create and implement a navigation bar I thought was minimalistic, but attractive to the eyes. After applying nav background, arranging links, adding logo, user avatar, effects the navigation bar was complete and ready to be merged to main. Later, I spent some time with Sebastian in a seperate breakout room to do some pair programming on a blocker he was having on his `CreateMovieNightForm` component regarding handling the submission of the form. With my assistance, we were able to overcome his blocker by creating an `onClose` prop and `handleFormClose` function that led to his `MovieNightsList` list of movie nights.

## August 29, 2024

-   Daily stand-up
-   Finalized styling for `UserProfile`

Before diving into coding today, I removed the `http://localhost:8000/` base URLs in all my components and replaced them with an `API_HOST` variable for deployment reasons. Next on my list was to remove comments and console.logs that weren't needed in my code. Lastly, I spend the rest of the day tweaking my `UserProfile` component page to perfect the user experience and style. I also added displays using ternary operator conditions that displays to 'add some movies to your watchlist' or 'watched' if the user's movie length is false. If true, it will display the normal movie carousels that the user has saved into their account.

## September 2, 2024

-   Created a API endpoint to check the existence of a rated item
-   Refactored code in `MovieDetail` and `MovieReviewForm` components
-   Design planning / Overall styling

On this beautiful Labor day, I decided to grab my laptop, go to a local coffee shop, and get some much needed coding done. The first on my todo list was to create a new endpoint that would check if a rated item existed in the database and return a boolean value because previously I had been receiving 404 errors whenever adding a movie to 'Watched', 'Watch List', or leaving a review. Bart was a major help in suggesting that I should create this endpoint. Originally, the functionality of my code was working as intended but I knew that those 404 errors weren't a good sign. I had created an async function `checkForExistingRI` that checked if a specified rated item existed and returned the object if it did. I used this function in my `handleAddToWatchLater` and `handleWatchedMovie` event handlers to make PUT or POST calls depending on whether it existed or not. The big issue here was that I would get the error in the console before the successful POST because technically the rated item object I was checking for didn't exist in the database yet. I was intentionally fishing for either an existing or non-existent endpoint. Creating the new endpoint to return only either a true or false simplified everything for me. After utilizing and refactoring, I was free of the dreaded 404 messages. Rigarious testing was done both on the front and back-end after to cover all ends. After this, I got to styling the `MovieReviewForm` and tweaked minor styling in the overall application. I'm still not too satisfied with the results of the styling and will most likely plan out a better design. I've noticed I run through multiple drafts to get to a point where I feel I am completely satisfied with the results. What makes it even tougher is when I only have such limited features to work with.
