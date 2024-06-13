const express= require('express');

const {saveGraphics}= require('../controllers/Graphics');

const router = express.Router();
router.post('/', saveGraphics);

exports.router = router;