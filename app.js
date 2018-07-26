'use strict';

const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');

const app = express();

const port = process.env.PORT || 5000;

// Config DB
const db = require('./config/database');

// Connect to mongoose
mongoose.connect(db.mongoURL, {
  useNewUrlParser: true,
})
  .then(() => console.log('Connected do MongoDB'))
  .catch(err => console.log(err));

app.get('/', (req, res) => res.json({ message: 'Hello!' }));

// Body parser middleware
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// Load routes
const movies = require('./routes/movies');
const comments = require('./routes/comments');

// Use routes
app.use('/movies', movies);
app.use('/comments', comments);

app.listen(port, () => {
  console.log(`Server started on port ${port}`);
});

module.exports = app;
