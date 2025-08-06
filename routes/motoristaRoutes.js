const express = require('express');
const router = express.Router();
const motoristaController = require('../controllers/motoristaController');

router.get('/usuarios/index', motoristaController.renderUsuarios);
router.get('/viagens/index', motoristaController.renderViagens);
router.get('/viagens/buscar-eventos', motoristaController.renderBuscarEventos);
router.get('/viagens/ver-viagem/:cod', motoristaController.renderVerViagem);

module.exports = router;