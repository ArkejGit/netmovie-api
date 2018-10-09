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

### `/comments/:movieID`

**GET**

Returns comments associated with movie according to passed *movieID*

## Bugs to fix

- [ ] misplaced connection to DB and using callbacks 
- [ ] using console.log in production code 
- [ ] requiring routes files in the middle of the file 
- [ ] all required files should be listed on top 
- [ ] .eslintr.json should be place in main directory instead of config 
- [ ] credentials list API_KEY, urls should be placed in env file 
- [ ] empty handleError method with comment inside 
- [ ] connection to DB doubled: both in mongoDBhelpers and in app.js 
- [ ] not using try-catch to handle errors 
- [ ] using todether callbacks, promises and async-await 
- [ ] too few req validations 
- [ ] comments in the production code 
- [ ] controllers functionality placed in routes directory​