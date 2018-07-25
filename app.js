'use strict';

const express = require('express');

const app = express();

const port = process.env.PORT || 5000;

app.get('/', (req, res) => res.json({ message: 'Hello!' }));

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
