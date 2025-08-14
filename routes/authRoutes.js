const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const authController = require('../controllers/authController');

// Configuração do Multer
const storage = multer.diskStorage({
    destination: (req, file, cb) => cb(null, 'public/uploads/'),
    filename: (req, file, cb) => {
    const ext = path.extname(file.originalname).toLowerCase();
    cb(null, `${file.fieldname}-${Date.now()}${ext}`);
  }
});

const upload = multer({ storage });

// Rotas
router.get('/entrada', authController.renderEntrada);
router.post('/verificarUsuario', authController.verificarUsuario); 

router.get('/cadastro', authController.renderCadastro);
router.get('/cadastro-sucesso', authController.renderCadastroSucesso);
router.post('/add-usuario', upload.single('foto_perfil'), authController.cadastrarUsuario);

router.get('/cadastro-motorista', authController.renderCadastroMotorista);
router.post(
  '/add-motorista',
  upload.fields([
    { name: 'foto_perfil', maxCount: 1 },
    { name: 'carteira_trab', maxCount: 1 },
    { name: 'cursos', maxCount: 1 },
    { name: 'habilitacao', maxCount: 1 },
    { name: 'comprov_resid', maxCount: 1 },
    { name: 'comprov_escola', maxCount: 1 },
    { name: 'titulo_eleitor', maxCount: 1 },
    { name: 'ant_crim', maxCount: 1 },
    { name: 'exame_tox', maxCount: 1 },
  ]),
  authController.cadastrarMotorista
);

module.exports = router;
