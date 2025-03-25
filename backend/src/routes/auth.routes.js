const express = require('express');
const router = express.Router();
const authController = require('../controllers/auth.controller');

// Routes voor authenticatie
router.post('/login', authController.login);
router.post('/logout', authController.logout);
router.get('/me', authController.getCurrentUser);

module.exports = router;
