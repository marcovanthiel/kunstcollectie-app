const express = require('express');
const router = express.Router();
const kunstenaarsController = require('../controllers/kunstenaars.controller');

// Routes voor kunstenaars
router.get('/', kunstenaarsController.getAllKunstenaars);
router.get('/:id', kunstenaarsController.getKunstenaarById);
router.post('/', kunstenaarsController.createKunstenaar);
router.put('/:id', kunstenaarsController.updateKunstenaar);
router.delete('/:id', kunstenaarsController.deleteKunstenaar);
router.get('/:id/kunstwerken', kunstenaarsController.getKunstenaarKunstwerken);

module.exports = router;
