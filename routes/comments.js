'use strict';

const express = require('express');
const mongoose = require('mongoose');

const { commentsPostRequestErrors } = require('./validation/requestValidation');

const router = express.Router();

// Load Movie and Comment models
require('../models/Movie');
require('../models/Comment');

const Movie = mongoose.model('movies');
const Comment = mongoose.model('comments');

// GET
router.get('/', (req, res) => {
  res.json({ route: 'GET comments' });
});

// POST
router.post('/', (req, res) => {
  // validation
  const errors = commentsPostRequestErrors(req);
  if (errors.length !== 0) {
    return res.status(400).send({ errors });
  }

  const { movieID, text } = req.body;
  const comment = { movieID, text };

  // check if movie with such ID exists
  Movie.findById(comment.movieID, (e, movie) => {
    if (movie !== undefined) {
      // save comment to DB and send response
      new Comment(comment)
        .save((err, product) => {
          if (err) console.log(err);
          res.json(product);
        });
    // send response with error if movie does not exist
    } else res.json({ error: `Movie with ID ${comment.movieID} does not exist in database!` });
  });
});

module.exports = router;
