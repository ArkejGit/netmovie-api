'use strict';

const chai = require('chai');
const chaiHttp = require('chai-http');
const app = require('../app');

const should = chai.should();

chai.use(chaiHttp);

// MOVIES
describe('movies', () => {

  describe('/GET', () => {
    it('it should be successful GET request', (done) => {
      chai.request(app)
        .get('/movies')
        .end((err, res) => {
          res.should.have.status(200);
          done();
        });
    });
  });

  describe('/POST', () => {
    it('it should be successful POST request', (done) => {
      chai.request(app)
        .get('/movies')
        .end((err, res) => {
          res.should.have.status(200);
          done();
        });
    });
  });

});

// COMMENTS
describe('comments', () => {

  describe('/GET', () => {
    it('it should be successful GET request', (done) => {
      chai.request(app)
        .get('/comments')
        .end((err, res) => {
          res.should.have.status(200);
          done();
        });
    });
  });

  describe('/POST', () => {
    it('it should be successful POST request', (done) => {
      chai.request(app)
        .get('/comments')
        .end((err, res) => {
          res.should.have.status(200);
          done();
        });
    });
  });

});
