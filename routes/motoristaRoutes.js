const express = require('express');
const router = express.Router();
const motoristaController = require('../controllers/motoristaController');
const { verificarSessaoMotorista } = require('../controllers/authController');

router.get('/usuarios/index', verificarSessaoMotorista, motoristaController.renderUsuarios);

router.get('/viagens/index', verificarSessaoMotorista, motoristaController.renderViagens);
router.get('/viagens/lista', verificarSessaoMotorista, motoristaController.renderViagensLista);
router.get('/viagens/buscar-eventos', verificarSessaoMotorista, motoristaController.renderBuscarEventos);
router.get('/viagens/ver-viagem/:cod', verificarSessaoMotorista, motoristaController.renderVerViagem);
router.get('/viagens/participantes/:cod', verificarSessaoMotorista, motoristaController.verParticipantes);

router.get('/viagens/relatorio/:cod', verificarSessaoMotorista, motoristaController.renderRelatorio);
router.put('/viagens/relatorio/:cod', verificarSessaoMotorista, motoristaController.salvarRelatorio);

router.get('/perfil', verificarSessaoMotorista, motoristaController.renderPerfil);
router.get('/perfil/senha', verificarSessaoMotorista, motoristaController.renderMudarSenha);
router.put('/perfil/senha/atualizar', verificarSessaoMotorista, motoristaController.atualizarSenha);
module.exports = router;