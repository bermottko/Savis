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
router.get('/usuarios/editar/:cod', adminController.editarUsuario);
router.post('/usuarios/editar/:cod', upload.single('foto_perfil'), adminController.salvarEdicaoUsuario);
router.get('/motoristas', adminController.renderMotoristas);
router.get('/solicitacoes', adminController.renderSolicitacoes);
router.get('/viagens', adminController.renderViagens);

module.exports = router;
