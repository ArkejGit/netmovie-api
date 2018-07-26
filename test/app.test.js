'use strict';

process.env.NODE_ENV = 'test';

const request = require('supertest');
const should = require('should');
const app = require('../app');

// MOVIES
describe('movies', () => {

  describe('/GET', () => {
    it('it should be successful GET request', (done) => {
      request(app)
        .get('/movies')
        .expect(200)
        .end((err, res) => {
          if (err) return done(err);
          done();
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

  describe('/POST', () => {
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
