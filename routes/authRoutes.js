const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');

router.post('/login', authController.login);
router.post('/seed', authController.seedAdmin); // For initial setup

module.exports = router;
