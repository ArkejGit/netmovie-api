'use strict';

const mongoose = require('mongoose');

const MovieSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  year: String,
  released: String,
  runtime: String,
  genre: String,
});

mongoose.model('movies', MovieSchema);
