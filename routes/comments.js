'use strict';

const express = require('express');

const router = express.Router();

router.get('/', (req, res) => {
  res.json({ route: 'GET comments' });
});

router.post('/', (req, res) => {
  res.json({ route: 'POST comments' });
});

module.exports = router;
