const express = require('express');
const router = express.Router();
const kunstwerkenController = require('../controllers/kunstwerken.controller');

// Routes voor kunstwerken
router.get('/', kunstwerkenController.getAllKunstwerken);
router.get('/:id', kunstwerkenController.getKunstwerkById);
router.post('/', kunstwerkenController.createKunstwerk);
router.put('/:id', kunstwerkenController.updateKunstwerk);
router.delete('/:id', kunstwerkenController.deleteKunstwerk);
router.post('/:id/afbeeldingen', kunstwerkenController.addAfbeelding);
router.delete('/:id/afbeeldingen/:afbeeldingId', kunstwerkenController.deleteAfbeelding);
router.post('/:id/bijlagen', kunstwerkenController.addBijlage);
router.delete('/:id/bijlagen/:bijlageId', kunstwerkenController.deleteBijlage);

module.exports = router;
