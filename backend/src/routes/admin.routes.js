const express = require('express');
const router = express.Router();
const adminController = require('../controllers/admin.controller');

// Routes voor administratie
router.get('/gebruikers', adminController.getAllGebruikers);
router.get('/gebruikers/:id', adminController.getGebruikerById);
router.post('/gebruikers', adminController.createGebruiker);
router.put('/gebruikers/:id', adminController.updateGebruiker);
router.delete('/gebruikers/:id', adminController.deleteGebruiker);
router.post('/import', adminController.importData);
router.get('/backup', adminController.createBackup);
router.post('/restore', adminController.restoreBackup);

module.exports = router;
