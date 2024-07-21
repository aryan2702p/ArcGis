const express = require('express');
const { createUser, loginUser,checkUser,logoutUser } = require('../controllers/auth');

const router = express.Router();
router.post('/signup', createUser)
.post('/login',loginUser)
.get('/:userId', checkUser)
.post('/logout', logoutUser);
exports.router = router;
