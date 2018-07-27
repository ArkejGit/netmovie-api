'use strict';

const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');

const { handleError } = require('./helpers/errorHandling');

const app = express();

const port = process.env.PORT || 5000;

// Config DB
const db = require('./config/database');

// Connect to mongoose
mongoose.connect(db.mongoURL, {
  useNewUrlParser: true,
})
  .then(() => console.info('Connected do MongoDB'))
  .catch(err => handleError(err));

app.get('/', (req, res) => res.sendFile(`${__dirname}/index.html`));

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
  handleError(`Server started on port ${port}`);
});

module.exports = app;
