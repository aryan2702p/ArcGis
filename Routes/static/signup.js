const express = require('express');
const path = require('path');
const router = express.Router();

// Render signup.html
router.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '../../public/signup.html'));
});

module.exports = { router };