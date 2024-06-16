const express= require('express');

const {saveGraphics}= require('../controllers/Graphics');

const router = express.Router();
const authMiddleware = require('../middlewares/authMiddleware');

// Protect all routes in this router
router.use(authMiddleware);
router.post('/', saveGraphics);


exports.router = router;