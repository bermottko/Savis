const express = require('express');
const router = express.Router();
const motoristaController = require('../controllers/motoristaController');

router.get('/usuarios/index', motoristaController.renderUsuarios);

router.get('/viagens/index', motoristaController.renderViagens);
router.get('/viagens/lista', motoristaController.renderViagensLista);
router.get('/viagens/buscar-eventos', motoristaController.renderBuscarEventos);
router.get('/viagens/ver-viagem/:cod', motoristaController.renderVerViagem);
router.get('/viagens/participantes/:cod', motoristaController.verParticipantes);

router.get('/viagens/relatorio/:cod', motoristaController.renderRelatorio);
router.put('/viagens/relatorio/:cod', motoristaController.salvarRelatorio);

router.get('/perfil', motoristaController.renderPerfil);

module.exports = router;