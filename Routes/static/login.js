const express = require('express');
const path = require('path');
const router = express.Router();

// Render login.html
router.get('/', (req, res) => {
    console.log('render login.html');
  res.sendFile(path.join(__dirname, '../../public/login.html'));
});

module.exports = { router };