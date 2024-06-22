const express = require('express');
const {saveLayer,GetLayer,UpdateLayer}= require('../controllers/GraphicLayers');

const router = express.Router();

//const authMiddleware = require('../middlewares/authMiddleware');


// router.use(authMiddleware);
router.post('/', saveLayer)
router.get('/:userId', GetLayer )
router.put('/',UpdateLayer)

exports.router = router;
