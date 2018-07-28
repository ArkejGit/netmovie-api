'use strict';

process.env.NODE_ENV = 'test';

const request = require('supertest');
const should = require('should');
const mongoose = require('mongoose');
const app = require('../app');

require('../models/Comment');

const Comment = mongoose.model('comments');

const { connectToDB, clearCollectionDB, checkIfExistsInDB } = require('../helpers/mongoDBhelpers');
const { handleError } = require('../helpers/errorHandling');

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

    it('GET /comments should fetch all comments from DB', (done) => {
      request(app)
        .get('/comments')
        .expect(200)
        .expect(res => res.body.should.have.length(2))
        .end(done);
    });

    it('GET /comments/:movieID should fetch comments associated with specific movie according to passed movieID', (done) => {
      request(app)
        .get(`/comments/${titanicID}`)
        .expect(200)
        .expect(res => res.body.should.have.length(1))
        .end(done);
    });

    it('GET /comments/:movieID should response with empty array when there is no movie with passed ID', (done) => {
      request(app)
        .get('/comments/123abc')
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
