const express = require('express');
const { createUser, loginUser,checkUser } = require('../controllers/auth');

const router = express.Router();
router.post('/signup', createUser)
.post('/login',loginUser)
.get('/:userId', checkUser)
exports.router = router;
