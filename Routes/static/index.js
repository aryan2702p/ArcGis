const express = require('express');
const path = require('path');
const router = express.Router();

// Render index.html with user details if logged in
router.get('/', (req, res) => {
    console.log("indexrouter called");
  if (req.session.userId) {
    res.sendFile(path.join(__dirname, '../../public/index.html'));
  } else {
    res.redirect('/login');
  }
});

router.get('/user', (req, res) => {
    console.log("userroute called");
  if (req.session.userId) {
    res.json(req.session.userId);
  } else {
    res.status(401).json({ message: 'Unauthorized' });
  }
});
module.exports = { router };