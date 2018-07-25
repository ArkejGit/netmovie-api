'use strict';

const request = require('supertest');
const app = require('../app');

// MOVIES
describe('movies', () => {

  describe('/GET', () => {
    it('it should be successful GET request', (done) => {
      request(app)
        .get('/movies')
        .expect(200)
        .end(function(err, res) {
          if (err) return done(err);
          done();
        });
    });
  });

  describe('/POST', () => {
    it('it should be successful POST request', (done) => {
      request(app)
        .post('/movies')
        .expect(200)
        .end(function(err, res) {
          if (err) return done(err);
          done();
        });
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
        .end(function(err, res) {
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
        .end(function(err, res) {
          if (err) return done(err);
          done();
        });
    });
  });

});
