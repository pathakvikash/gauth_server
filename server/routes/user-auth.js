const express = require('express');
const multer = require('multer');
const router = express.Router();
const userController = require('../controller/userController');

const storage = multer.memoryStorage(); // Store files in memory as buffers
const upload = multer({ storage: storage });

router.post('/sign-up', userController.registerUser);
router.post('/login', userController.loginUser);
router.post(
  '/upload/:email',
  upload.array('images'),
  userController.uploadedImages
);
router.get('/get-user-images/:email', userController.getUserImagesByEmail);
router.get('/user/remove-images/:email', userController.getRemovedImages);

module.exports = router;
