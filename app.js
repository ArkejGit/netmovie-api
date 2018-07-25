'use strict';

const express = require('express');
const mongoose = require('mongoose');

const app = express();

const port = process.env.PORT || 5000;

// Connect to mongoose
mongoose.connect('mongodb://localhost:27017/netmovie', {
  useNewUrlParser: true,
})
  .then(() => console.log('Connected do MongoDB'))
  .catch(err => console.log(err));

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
