const express = require('express');
const router = express.Router();
const multer = require('multer');
const adminController = require('../controllers/adminController');

// Configuração do Multer
const storage = multer.diskStorage({
    destination: (req, file, cb) => cb(null, 'public/uploads/'),
    filename: (req, file, cb) => cb(null, Date.now() + ".jpg")
});

const upload = multer({ storage });

router.get('/usuarios/index', adminController.renderUsuarios);
router.get('/usuarios/buscar', adminController.buscarUsuarios);
router.delete('/usuarios/deletar/:cod', adminController.deletarUsuarios);
router.get('/usuarios/editar/:cod', adminController.editarUsuario);
router.put('/usuarios/editar/:cod', upload.single('foto_perfil'), adminController.salvarEdicaoUsuario);

router.get('/motoristas/index', adminController.renderMotoristas);
router.get('/motoristas/buscar', adminController.buscarMotoristas);
router.get('/motoristas/editar/:cod', adminController.editarMotorista);
router.put('/motoristas/editar/:cod', upload.single('foto_perfil'), adminController.salvarEdicaoMotorista);
router.delete('/motoristas/deletar/:cod', adminController.deletarMotoristas);

router.get('/viagens/index', adminController.renderViagens);
router.get('/viagens/nova-viagem', adminController.renderNovaViagem);

router.get('/solicitacoes/index', adminController.renderSolicitacoes);

module.exports = router;
