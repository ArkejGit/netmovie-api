'use strict';

process.env.NODE_ENV = 'test';

const request = require('supertest');
const should = require('should');
const mongoose = require('mongoose');
const app = require('../app');

const { connectToDB, clearCollectionDB, checkIfExistsInDB } = require('../helpers/mongoDBhelpers');

// MOVIES
describe('movies', () => {

  before(() => connectToDB());

  after(() => clearCollectionDB('movies'));

  // GET
  describe('/GET', () => {

    before((done) => {
      clearCollectionDB('movies');

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
                .end(done);
            });
        });
    });

    it('having no params server should response with all movies that are in database', (done) => {
      request(app)
        .get('/movies')
        .expect(200)
        .expect(res => res.body.should.have.length(3))
        .end(done);
    });
    it('having params server should filter movies', (done) => {
      request(app)
        .get('/movies')
        .query({ title: 'HATEFUL' })
        .expect(200)
        .expect(res => res.body.should.have.length(1))
        .end(done);
    });
    it('having param "sort" server should sort movies', (done) => {
      request(app)
        .get('/movies')
        .query({ sort: 'year' })
        .expect(200)
        .expect(res => res.body.should.have.length(3))
        .expect(res => res.body.map(movie => movie.title).should.be.eql(['12 Angry Men', 'Titanic', 'The Hateful Eight']))
        .end(done);
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
            .expect(400)
            .end(done);
        });
    });
    it('server should response with "movie not found" error when there is no movie with specific title', (done) => {
      request(app)
        .post('/movies')
        .send('title=mission invisible')
        .expect(400)
        .expect(movieNotFound)
        .end(done);
    });
  });

});
