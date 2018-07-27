'use strict';

process.env.NODE_ENV = 'test';

const request = require('supertest');
const should = require('should');
const mongoose = require('mongoose');
const app = require('../app');
const db = require('../config/database');

require('../models/Comment');

const Comment = mongoose.model('comments');

const { connectToDB, clearCollectionDB, checkIfExistsInDB } = require('../helpers/mongoDBhelpers');
const { handleError } = require('../helpers/errorHandling');

// MOVIES
describe('movies', () => {

  before(() => connectToDB());

  after(() => clearCollectionDB('movies'));

  // GET
  describe('/GET', () => {

    beforeEach(() => clearCollectionDB('movies'));

    it('server should response with all movies that are in database', (done) => {
      request(app)
        .post('/movies')
        .send('title=titanic')
        .expect(200)
        .end(() => {
          request(app)
            .post('/movies')
            .send('title=hateful eight')
            .expect(200)
            .end(() => {
              request(app)
                .post('/movies')
                .send('title=12 angry men')
                .expect(200)
                .end(() => {
                  request(app)
                    .get('/movies')
                    .expect(200)
                    .expect(res => res.body.should.have.length(3))
                    .end(done);
                });
            });
        });
    });
  });

  // POST
  function hasAllMovieObjectKeys(res) {
    res.body.should.have.properties(['title', 'year', 'released', 'runtime', 'genre']);
  }

  function movieNotFound(res) {
    res.body.should.have.property('error', 'Movie not found!');
  }

  function movieAlreadyExists(res) {
    res.body.should.have.property('error', 'Movie already exists in database!');
  }

  describe('/POST', () => {

    beforeEach(() => clearCollectionDB('movies'));

    it('request should contain title', (done) => {
      request(app)
        .post('/movies')
        .send('title=test')
        .expect(200, done);
    });
    it('server should response with error when there is no title in request', (done) => {
      request(app)
        .post('/movies')
        .expect(400, done);
    });
    it('server should response with error when there is more than one parameter', (done) => {
      request(app)
        .post('/movies')
        .send('title=test')
        .send('mumbo=jumbo')
        .expect(400, done);
    });
    it('server should response with full movie object when request is correct', (done) => {
      request(app)
        .post('/movies')
        .send('title=titanic')
        .expect(200)
        .expect(hasAllMovieObjectKeys)
        .end(done);
    });
    it('server should response with "movie already exists in db" error when its true', (done) => {
      request(app)
        .post('/movies')
        .send('title=titanic')
        .expect(200)
        .end(() => {
          request(app)
            .post('/movies')
            .send('title=titanic')
            .expect(movieAlreadyExists)
            .expect(200)
            .end(done);
        });
    });
    it('server should response with "movie not found" error when there is no movie with specific title', (done) => {
      request(app)
        .post('/movies')
        .send('title=mission invisible')
        .expect(200)
        .expect(movieNotFound)
        .end(done);
    });
  });

});


// COMMENTS
describe('comments', () => {

  before(() => {
    connectToDB();
  });

  after(() => {
    clearCollectionDB('comments');
    clearCollectionDB('movies');
  });

  // GET
  describe('/GET', () => {

    let titanicID;
    let hateful8ID;
    before((done) => {
      request(app)
        .post('/movies')
        .send('title=titanic')
        .expect(200)
        .expect((res) => {
          titanicID = res.body._id; // eslint-disable-line no-underscore-dangle
        })
        .end(() => {
          request(app)
            .post('/comments')
            .send(`movieID=${titanicID}`)
            .send('text=titanic comment')
            .expect(200)
            .end(() => {
              request(app)
                .post('/movies')
                .send('title=hateful eight')
                .expect(200)
                .expect((res) => {
                  hateful8ID = res.body._id; // eslint-disable-line no-underscore-dangle
                })
                .end(() => {
                  request(app)
                    .post('/comments')
                    .send(`movieID=${hateful8ID}`)
                    .send('text=hateful eight comment')
                    .expect(200)
                    .end(done);
                });
            });
        });
    });

    it('should fetch all comments from DB when no param is set', (done) => {
      request(app)
        .get('/comments')
        .expect(200)
        .expect(res => res.body.should.have.length(2))
        .end(done);
    });

    it('should fetch comments associated with specific movie according to passed movieID', (done) => {
      request(app)
        .get('/comments')
        .query({ movieID: titanicID })
        .expect(200)
        .expect(res => res.body.should.have.length(1))
        .end(done);
    });

    it('should response with empty array when there is no movie with passed ID', (done) => {
      request(app)
        .get('/comments')
        .query({ movieID: '123abc' })
        .expect(200)
        .expect(res => res.body.should.have.length(0))
        .end(done);
    });
  });

  // POST
  function hasAllCommentObjectKeys(res) {
    res.body.should.have.properties(['movieID', 'text']);
  }

  function movieWithIDnotExist(res, id) {
    res.body.should.have.property('error');
    res.body.error.should.match(/Movie with ID \w+ does not exist in database!/);
  }

  async function commentExistsInDB(id) {
    await checkIfExistsInDB(Comment, { movieID: id }).then((exists) => {
      should(exists).be.true();
    });

  }


  describe('/POST', () => {

    afterEach(() => {
      clearCollectionDB('comments');
      clearCollectionDB('movies');
    });

    it('request should contain movieID and comment text', (done) => {
      request(app)
        .post('/comments')
        .send('movieID=123')
        .send('text=First!:D')
        .expect(200, done);
    });
    it('server should response with error when there is no movieID in request', (done) => {
      request(app)
        .post('/comments')
        .send('text=First!:D')
        .expect(400, done);
    });
    it('server should response with error when there is no comment text in request', (done) => {
      request(app)
        .post('/comments')
        .send('movieID=123')
        .expect(400, done);
    });
    it('server should save comment to DB and return it in response when request is correct and DB contains movie with requested ID', (done) => {
      let id;
      request(app)
        .post('/movies')
        .send('title=titanic')
        .expect(200)
        .expect((res) => {
          id = res.body._id; // eslint-disable-line no-underscore-dangle
        })
        .end(() => {
          request(app)
            .post('/comments')
            .send(`movieID=${id}`)
            .send('text=First!:D')
            .expect(200)
            .expect(hasAllCommentObjectKeys)
            .end(() => {
              commentExistsInDB(id)
                .catch(err => handleError(err));
              done();
            });
        });
    });
    it('server should response with error when there is no movie with requested ID in DB', (done) => {
      request(app)
        .post('/movies')
        .send('title=titanic')
        .expect(200)
        .end(() => {
          request(app)
            .post('/comments')
            .send('movieID=123')
            .send('text=First!:D')
            .expect(200)
            .expect(movieWithIDnotExist)
            .end(done);
        });
    });
  });

});
