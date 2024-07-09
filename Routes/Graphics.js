const express= require('express');

const {saveGraphics,fetchGraphicsById,updateGraphic,deleteGraphics}= require('../controllers/Graphics');

const router = express.Router();
const authMiddleware = require('../middlewares/authMiddleware');

// Protect all routes in this router
// router.use(authMiddleware);
router.post('/', saveGraphics);
router.get('/:userId', fetchGraphicsById);
router.put('/:userId/:uid', updateGraphic);
router.delete('/:userId/:uid', deleteGraphics);


exports.router = router;