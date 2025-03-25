const express = require('express');
const router = express.Router();
const rapportagesController = require('../controllers/rapportages.controller');

// Routes voor rapportages
router.get('/overzicht', rapportagesController.getOverzichtsrapportage);
router.get('/waardering', rapportagesController.getWaarderingsrapportage);
router.get('/kunstenaar/:id', rapportagesController.getKunstenaarRapportage);
router.get('/locatie/:id', rapportagesController.getLocatieRapportage);
router.post('/export', rapportagesController.exportRapportage);

module.exports = router;
