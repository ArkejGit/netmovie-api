'use strict';

const { Schema, model } = require('mongoose');

const MovieSchema = new Schema({
  title: {
    type: String,
    required: true,
  },
  year: String,
  released: String,
  runtime: String,
  genre: String,
});

model('movies', MovieSchema);
