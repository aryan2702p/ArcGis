const express = require('express');
const {saveLayer,GetLayer}= require('../controllers/GraphicLayers');

const router = express.Router();

//const authMiddleware = require('../middlewares/authMiddleware');


// router.use(authMiddleware);
router.post('/', saveLayer)
router.get('/:userId', GetLayer )

exports.router = router;
