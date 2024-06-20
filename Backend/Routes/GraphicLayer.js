const express = require('express');
const {saveLayer}= require('../controllers/GraphicLayers');

const router = express.Router();

//const authMiddleware = require('../middlewares/authMiddleware');


// router.use(authMiddleware);
router.post('/', saveLayer)

exports.router = router;
