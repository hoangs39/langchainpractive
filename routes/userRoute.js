const express = require('express');
const router = express.Router();
const userController = require('../controllers/usersController');
const authMiddleware = require('../middlewares/authMiddleware');
const upload = require('../middlewares/imagesUpload');

router.get('/profile', authMiddleware, userController.getProfile);
router.post('/profile/image', authMiddleware, upload.single('image'), userController.uploadImage);

module.exports = router;