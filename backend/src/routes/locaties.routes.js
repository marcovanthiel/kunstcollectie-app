const express = require('express');
const router = express.Router();
const locatiesController = require('../controllers/locaties.controller');

// Routes voor locaties
router.get('/', locatiesController.getAllLocaties);
router.get('/:id', locatiesController.getLocatieById);
router.post('/', locatiesController.createLocatie);
router.put('/:id', locatiesController.updateLocatie);
router.delete('/:id', locatiesController.deleteLocatie);
router.get('/:id/kunstwerken', locatiesController.getLocatieKunstwerken);

module.exports = router;
