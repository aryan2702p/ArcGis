const express = require('express');
const {saveLayer}= require('../controllers/featureLayer');

const router = express.Router();
router.post('/', saveLayer)

exports.router = router;
