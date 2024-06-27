const express = require('express');
const {saveLayer}= require('../controllers/featureLayer');

const router = express.Router();

const authMiddleware = require('../middlewares/authMiddleware');


// router.use(authMiddleware);
router.post('/', saveLayer)

exports.router = router;
