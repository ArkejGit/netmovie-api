# netmovie-api

Simple REST API - a basic movie database interacting with external API - *[omdbapi](http://www.omdbapi.com/)*.

API is publicly available on *[heroku](https://netmovie-api.herokuapp.com/)*

## Requirements and setup

Project was created in undermentioned environment:
- *Windows 7*
- *Node.js 8.9.1*
- *mongoDB 4.0.0*

To run it locally:
```
$ git clone https://github.com/ArkejGit/netmovie-api.git
$ cd netmovie-api
$ npm install
$ npm start
```
There are defined two additional npm scripts:
- `npm run lint` to run *[eslint](https://eslint.org/)*
- `npm run test` to run tests with *[mocha](https://mochajs.org/)*

:warning: Note that you need to have [MongoDB server](https://www.mongodb.com/download-center?jmp=nav#community) installed locally to make the project works.

## API
Example `GET` request using axios:
```
axios.get('https://netmovie-api.herokuapp.com/movies')
```
Using Postman you need to set header:
```
Content-Type: application/x-www-form-urlencoded
```
### `/movies`

**POST**

```
{
  "title": "movie title"
}
```

*Returns*

```
{
  "_id": "movie id",
  "title": "movie title",
  "year": "movie year",
  "released": "movie released",
  "runtime": "runtime",
  "genre": "movie genre",
  "__v": 0
}
```

**GET**

*Returns*

```
[
  {
    "_id": "movie id",
    "title": "movie title",
    "year": "movie year",
    "released": "movie released",
    "runtime": "runtime",
    "genre": "movie genre",
    "__v": 0
  },
  {
    "_id": "movie id",
    "title": "movie title",
    "year": "movie year",
    "released": "movie released",
    "runtime": "runtime",
    "genre": "movie genre",
    "__v": 0
  },
  
  ...
  
]
```

You can filter list passing params in GET request:
`title, year, released, runtime, genre`

You can sort list passing param `sort`, for example:
` { "sort": "year" } `

### `/comments`

**POST**

```
{
  "movieID": "movie ID",
  "text": "comment text"
}
```

*Returns*

```
{
  "_id": "comment ID",
  "movieID": "movie ID",
  "text": "comment text",
  "__v": 0
}
```

**GET**

*Returns*

```
[
  {
    "_id": "comment ID",
    "movieID": "movie ID",
    "text": "comment text",
    "__v": 0
  },
  {
    "_id": "comment ID",
    "movieID": "movie ID",
    "text": "comment text",
    "__v": 0
  }
  
  ...
  
]
```

You can filter list passing param `movieID`, for example:
` { "movieID": "5b5b484e3405190020ccd74d" } `
