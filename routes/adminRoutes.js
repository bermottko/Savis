const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');

router.get('/usuarios', adminController.renderUsuarios);
router.get('/usuarios/buscar', adminController.buscarUsuarios);
/*router.get('/usuarios/editar/:cod', adminController.editarUsuarios);*/
router.get('/motoristas', adminController.renderMotoristas);
router.get('/solicitacoes', adminController.renderSolicitacoes);
router.get('/viagens', adminController.renderViagens);

module.exports = router;
