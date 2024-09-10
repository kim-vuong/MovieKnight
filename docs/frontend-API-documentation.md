## Product API Design

<br>


**HOME PAGE**

*Movie List:*
* Endpoint path: /movies
* Endpoint method: GET
* Request shape (JSON):
```json
{
  "movies": [
    {
      "title": string,
      "image_url": string,
      "release_date": date,
    }
  ]
}
```

*Movie Detail:*
* Endpoint path: /movies/{id}
* Endpoint method: GET
* Request shape (JSON):
```json
{
  "title": string,
  "image_url": string,
  "tagline": string,
  "synopsis": string,
  "release_date": date,
  "runtime": int,
  "genre": list[str],
  "trailer": **PENDING**
}
```



---

**USER PROFILE**

*User Details:*
* Endpoint path: /user/{id}
* Endpoint method: GET
* Request shape (JSON):
```json
{
  "username": string,
  "picture_url": string
}
```

*Update User:*
* Endpoint path: /user/{id}
* Endpoint method: PUT
* Request shape (JSON):
```json
{
  "username": string,
  "picture_url": string
}
```

*Delete User:*
* Endpoint path: /user/{id}
* Endpoint method: DELETE



*Watched/Rated:*
* Endpoint path: /rated
* Endpoint method: GET
* Request shape (JSON):
```json
{
  "rated": [
    {
      "user_id": int,
      "movie_id": int,
      "watched": bool,
      "rating": int,
      "review": string (OPTIONAL)
    }
  ]
}
```

---

**TIER LIST**

* Endpoint path: /tierlist/{id}
* Endpoint method: GET
* Request shape (JSON):
```json
{
  "tier_list": [
    {
      "F": list[int],
      "E": list[int],
      "D": list[int],
      "C": list[int],
      "B": list[int],
      "A": list[int],
      "S": list[int]
    }
  ]
}
```

* Endpoint path: /tierlist/{id}
* Endpoint method: POST
* Request shape (JSON):
```json
{
  "tier_list": [
    {
      "F": list[int],
      "E": list[int],
      "D": list[int],
      "C": list[int],
      "B": list[int],
      "A": list[int],
      "S": list[int]
    }
  ]
}
```


* Endpoint path: /movies
* Endpoint method: GET
* Request shape (JSON):
```json
{
  "movies": [
    {
      "title": string,
      "image_url": string,
      "release_date": date
    }
  ]
}
```

---

**MOVIE NIGHT PLANNER**

* Endpoint path: /movienight/{id}
* Endpoint method: GET
* Request shape (JSON):
```json
{
  "title": string,
  "start_date": date,
  "start_time": datetime,
  "location": string,
  "users": list[user:id],
  "movie_choices": list[movie:id]
}
```

* Endpoint path: /movienight/
* Endpoint method: POST
* Request shape (JSON):
```json
{
  "title": string,
  "start_date": date,
  "start_time": datetime,
  "location": string,
  "users": list[user:id],
  "movie_choices": list[movie:id]
}
```

* Endpoint path: /movienight/{id}
* Endpoint method: PUT
* Request shape (JSON):
```json
{
  "title": string,
  "start_date": date,
  "start_time": datetime,
  "location": string,
  "users": list[user:id],
  "movie_choices": list[movie:id]
}
```

* Endpoint path: /movienight/
* Endpoint method: GET
* Request shape (JSON):
```json
{
  "movie_nights": [
    {
      "title": string,
      "start_date": date
    }
  ]
}
```

**MOVIE NIGHT DETAIL**

* Endpoint path: /movie-nights/{id}
* Endpoint method: GET
* Response shape (JSON):

```json
{
  "id": int,
  "name": string,
  "date": string,
  "in_person": bool,
  "location": string
}
```


* Endpoint path: /attendees/movie-night/{movie_night_id}
* Endpoint method: GET
* Response shape (JSON):

```json
{
  "id": int,
  "movie_night_name": string,
  "username": string,
  "host": bool
}
```


* Endpoint path: /movie-picks/attendee/{attendee_id}
* Endpoint method: GET
* Response shape (JSON):

```json
{
  "id": int,
  "movie_title": string,
  "movie_id": int
}
```

* Endpoint path: /movie-picks/random/{movie_nights_id}
* Endpoint method: GET
* Response shape (JSON):

```json
{
  "title": string
}
```

* Endpoint path: /movie-nights/{id}
* Endpoint method: DELETE
* Response shape (JSON):

```json
{
  "message": string
}
```

**MOVIE PICK POPUP**

* Endpoint path: /movie-picks/search
* Endpoint method: GET
* Query parameters: query (string, required)
* Response shape (JSON):

```json
{
  "id": int,
  "title": string
}
```

* Endpoint path: /attendees/get-or-create
* Endpoint method: POST
* Request shape (JSON):
```json
{
  "movie_nights_id": int,
  "user_id": int,
  "host": bool
}
```

* Response shape (JSON):

```json
{
  "id": int,
  "movie_nights_id": int,
  "user_id": int,
  "host": bool
}
```

* Endpoint path: /movie-picks/attendee/{attendee_id}
* Endpoint method: PUT
* Request shape (JSON):

```json
[
  {
    "movies_id": int
  }
]
```

* Response shape (JSON):

```json
[
  {
    "id": int,
    "movie_title": string,
    "movie_id": int
  }
]
```
