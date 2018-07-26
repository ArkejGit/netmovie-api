'use strict';

const mongoose = require('mongoose');

const CommentSchema = new mongoose.Schema({
  movieID: {
    type: String,
    required: true,
  },
  text: {
    type: String,
    required: true,
  },
});

mongoose.model('comments', CommentSchema);
