'use strict';

const express = require('express');

const router = express.Router();

router.get('/', (req, res) => {
  res.json({ route: 'GET movies' });
});

router.post('/', (req, res) => {
  res.json({ route: 'POST movies' });
});

module.exports = router;
