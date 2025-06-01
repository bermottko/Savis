const express = require('express');
const router = express.Router();
const multer = require('multer');
const authController = require('../controllers/authController');

// Configuração do Multer
const storage = multer.diskStorage({
    destination: (req, file, cb) => cb(null, 'public/uploads/'),
    filename: (req, file, cb) => cb(null, Date.now() + ".jpg")
});

const upload = multer({ storage });

// Rotas
router.get('/entrada', authController.renderEntrada);
router.get('/cadastro', authController.renderCadastro);
router.get('/cadastro-sucesso', authController.renderCadastroSucesso);
router.post('/add-usuario', upload.single('foto_perfil'), authController.cadastrarUsuario);

module.exports = router;
