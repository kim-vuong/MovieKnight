## August 5, 2024

* Added the first draft of our front-end API documentation
* Tested merge requests
* Created multiple issue logs specifying features from our wireframe

Today I created a new branch and exported the first draft of our front-end API documentation into a new file named frontend-API-documentation.md. With this new file, I learned how to properly make a merge request to main (auto deleted branch after completion of merge / no squashing). I also created three (3) issues in which each define specific features of our project that all include user stories, features, acceptance criteria, and definition of done (DoD).

## August 6, 2024

* Application Design Presentation
* Discussion/Review with Bart Dorsey

As a team, we assessed our application design, issues, and wireframe. During our application design presentation, we went over our thought process and how we planned to implement all the features in our project. Bart Dorsey reviewed, critiqued, and provided necessary feedback on each of the features (Few examples: Discussing many-to-many relationships within multiple tables, component layouts, sorting the 'Reviews/Ratings' from highest rated to lowest - as this will serve as a semi tier list, infinite scrolling/pagination on large lists). We also received clarification on how to properly formulate features into issue logs (Attempt to capture the majority of details to make a feature complete).

## August 8th, 2024

* Created genres_movies join table

We mob coded the genres_movies table so that we could query the db for the a list of genres for each individual movie. We ran into a lot of issues with the interactions between the query results and the pydantic model. The issues were resolved by making the pydantic model fields match the columns of the query results.

## August 9th, 2024

* Created movie_nights table
* Created attendees table
* Reworked issues on job board

We mob coded the movie_nights and attendees tables with Andrew and Conner driving. We walked through the code for the migrations, models, routers, and queries for each table, working through issues that came up along the way. After the tables were created we made sure they were functioning using the fastapi gui. Towards the end of the day we went back to our created issues on the issues board and reworked them to be more focused on individual front-end and back-end tasks rather than larger full stack issues.


## August 10th, 2024

* fixed migration volume issue
* Built movie_night detail GET endpoint

We ran into a migration error today that was the result of reformatting a migration file and it not matching the migration history. We found two solutions: one was to change the format back to match the history, or to delete and rebuild all of our volumes.
I created the movie night detail GET api endpoint. At this point, it looks like it works however we have not made the POST method yet so there the db table is empty. The query is returning the correct error. I will test again tomorrow once the POST method is finished.


## August 11th, 2024
 * built movie_night POST endpoint

 Spend the day building the POST endpoint for creating new movie nights. Tested and finalized the SQL in beekeeper. Dealt with a small bug in the sql, strings can only use single quotes where I had doubles. The model and query went fairly smooth, but ran into a bug while making the router. I was getting a database error while and a syntax error in the docker log. The solution was a missing comma in Values portion of the sql query. Once this was added, everything ran smooth. I now have a functioning GET all, GET detail, and POST endpoints for the movie nights.


## August 12th, 2024
* built movie_night DELETE endpoint

After fixing the user auth blocker that occured at the end of the day yesterday I built the delete endpoint for the movie nights api. I would like to figure out how to send an 404 error message if the client attempts to delete an id that does not exist. For now that can be handled on the front end.
After some code review I figured out how to send a 404 error.

## August 13th, 2024
* built movie_night PUT endpoint
* started working on all movie nights list

Spend time working on the update function for the movie_nights endpoint. Went mostly smooth except for a snag getting the correct error message to show up in the swagger UI when a non-existant ID is entered. The error was showing up in the docker log, but not in swagger. The solution was to refactor the error handling to handle it directly rather than use the get_movie_night function to check that the ID was in the database.
After finishing the api endpoints, I started working on the component for the Movie Nights list. After reviewing my project beta code I started writing the code for the list component. As of EOD, the component fetches the appropriate data and displays the Movie night names and dates. Very barebones but it works.

## August 14
* built delete endpoint for movie_night
* added error handling to delete

## August 15
* added movie_nights update endpoint
* added user auth to movie_night endpoints
* started movie_nights list component

## August 19
* started working on create movie night form component

## August 20
* had a hard fought battle with user auth for create movie night form submission
* got form submission to work properly

## Aug 21
* fixed checkbox and location default settings on create form

## August 23th
* worked on attendees list
* worked on random movie pick method

Started working on the attendees list component. Ran into some issues with authentication. Rewatched front end auth lecture to review. Will work more on this on monday.
I believe I figured out how I am going to make the random movie pick work. I will a backend query that will use the Order By Random() and then limit the result to 1.

## August 26
* got attendees list to work
* working on random movie pick SQL

Figured out the auth issues with the attendees list. I realized that the list is just of all the attendees and im not sure how helpful it will actually be. Will probably have to figure out how to make it specific for each movie night as it will be rendered in the movie night detail page.
I wrote a sql query that works for the random movie pick button that joins the attendees, movie picks, and movies table together so we can filter by movie night and return the title of the movie that gets selected.
The api endpoint for the random movie pick works in swagger UI so once the detail page for the movie nights is up and running, I will make a button component that calls the endpoint and generates a pick.


## August 27
* started writing unit tests for movie nights list and create movie night

Rewatched the lectures from the Unit test day following along with my code. Wrote 2 unit tests, one for the get all movie nights and one for get one movie night. All unit tests were merged and passed through the gitlab pipeline. After finishing the unit tests, I started working on refactoring the pop up for the create movie night. Ran into difficulties converting everything to us the antd library.

## August 28
* Finihsed working on the pop up for create movie nights
* built the random movie pick generator button

After spending all morning trying to rebuild the create movie night form using antd, I decided it would be a better solution to keep the form as is and just use antd to make the pop up. After a long battle trying to get the submit button to work daniel and I figured out that we could add a onClose function to the react form that would redirect the user back to the list page and we also added a handleFormClose function to the pop up that would close the popup as well as resetting the state of the list.
At the end of the day, I also added navigate funtionality to the movie night list page using a useNavigate hook and a click handler on each row of the list.
After class hours I went to work on the random pick button component. I used antd to make a button and wrote a function to fetch data from the random movie pick api endpoint. The difficult part was getting the movie night ID from the parent component to the child component. After reading the react docs, I figured out that I had to move the state from the child to the parent and then pass the state as a prop down to the button component. Once that worked I was able to get the random movie pick to log in the console. From there I added an antd message to the fetchdata function of the button component that made a message appear on the movie night detail page for the generated random movie pick.

## August 29
* added error handling to random picker
* debugged create movie form
* wrote API docs for attendees
* Code cleanup

Added a custom console error and a popup message to the random picker if the movie night has an empty movie pick list and returns null as the movie pick title.
Had to do debugging on the create movie nights form. The form default state for the location input was set to null but had to be reset to an empty string to prevent a controlled value being converted into an uncontrolled value.
Wrote the docs for all of the attendees api endpoints.
Went through the api files and ghi files that I wrote and clean them up in addition to changing all localhost:8000 calls to a VITE_API_HOST call to be ready for deployment.

## August 3
* added README docs

Worked on the readme documentation, adding feature docs and the db schema
