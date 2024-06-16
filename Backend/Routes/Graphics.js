const express= require('express');

const {saveGraphics,fetchGraphicsById}= require('../controllers/Graphics');

const router = express.Router();
const authMiddleware = require('../middlewares/authMiddleware');

// Protect all routes in this router
router.use(authMiddleware);
router.post('/', saveGraphics);
router.get('/:userId', fetchGraphicsById);


exports.router = router;