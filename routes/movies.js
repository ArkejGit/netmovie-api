'use strict';

const express = require('express');
const axios = require('axios');
const mongoose = require('mongoose');

const { moviesPostRequestErrors } = require('./validation/requestValidation');

const router = express.Router();

const API_KEY = 'ca4e5415';
const URL = 'http://www.omdbapi.com';

// Load Movie model
require('../models/Movie');

const Movie = mongoose.model('movies');

// GET
router.get('/', (req, res) => {
  res.json({ route: 'GET movies' });
});

// POST
router.post('/', (req, res) => {
  // validation
  const errors = moviesPostRequestErrors(req);
  if (errors.length !== 0) {
    return res.status(400).send({ errors });
  }

  // fetch data from external API
  const { title } = req.body;
  axios.get(URL, {
    params: {
      apikey: API_KEY,
      t: title,
    },
  })
    .then((apiRes) => {
      const {
        Response, Error, Title, Year, Released, Runtime, Genre,
      } = apiRes.data;
      // check if movie exists
      if (Response === 'False') return res.json({ error: Error });
      const movie = {
        title: Title,
        year: Year,
        released: Released,
        runtime: Runtime,
        genre: Genre,
      };
      // save to DB and send response
      new Movie(movie)
        .save((err, product) => {
          if (err) console.log(err);
          res.json(product);
        });
    })
    .catch(err => console.log(err));
});

module.exports = router;
