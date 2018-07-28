'use strict';

const express = require('express');
const mongoose = require('mongoose');

const { commentsPostRequestErrors } = require('./validation/requestValidation');
const { checkIfExistsInDB } = require('../helpers/mongoDBhelpers');
const { handleError } = require('../helpers/errorHandling');

const router = express.Router();

// Load Movie and Comment models
require('../models/Movie');
require('../models/Comment');

const Movie = mongoose.model('movies');
const Comment = mongoose.model('comments');

// GET
router.get('/', (req, res) => {
  Comment.find({})
    .then(comments => res.json(comments));
});

router.get('/:movieID', (req, res) => {
  const movieID = req.params;

  Comment.find(movieID)
    .then(comments => res.json(comments));
});

// POST
router.post('/', async (req, res) => {
  // validation
  const errors = commentsPostRequestErrors(req);
  if (errors.length !== 0) {
    return res.status(400).send({ errors });
  }

  const { movieID, text } = req.body;
  const comment = { movieID, text };

  // check if movie with such ID exists
  let movieExists = false;
  await checkIfExistsInDB(Movie, { _id: comment.movieID }).then((exists) => {
    movieExists = exists === true;
  })
    .catch(err => handleError(err));

  if (movieExists) {
    // save comment to DB and send response
    new Comment(comment)
      .save((err, product) => {
        if (err) handleError(err);
        res.json(product);
      });
  } else {
    // send response with error if movie does not exist
    res.json({ error: `Movie with ID ${comment.movieID} does not exist in database!` });
  }
});

module.exports = router;
