'use strict';

process.env.NODE_ENV = 'test';

const request = require('supertest');
const should = require('should');
const mongoose = require('mongoose');
const app = require('../app');
const db = require('../config/database');

// MOVIES
describe('movies', () => {

  function clearCollectionDB(collectionName) {
    mongoose.connection.db.listCollections({ name: collectionName })
      .next((e, collinfo) => {
        if (collinfo) {
          mongoose.connection.collections[collinfo.name].drop((err) => {
            if (err) console.log(err);
          });
        }
      });
  }

  before(() => mongoose.connect(db.mongoURL, { useNewUrlParser: true }));

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

  describe('/GET', () => {
    it('it should be successful GET request', (done) => {
      request(app)
        .get('/comments')
        .expect(200)
        .end((err, res) => {
          if (err) return done(err);
          done();
        });
    });
  });

  describe('/POST', () => {
    it('it should be successful POST request', (done) => {
      request(app)
        .post('/comments')
        .expect(200)
        .end((err, res) => {
          if (err) return done(err);
          done();
        });
    });
  });

});
