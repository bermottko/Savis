const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const usuarioController = require('../controllers/usuarioController');
const { verificarSessaoUsuario } = require('../controllers/authController');

// Configuração do Multer
const storage = multer.diskStorage({
    destination: (req, file, cb) => cb(null, 'public/uploads/'),
    filename: (req, file, cb) => {
    const ext = path.extname(file.originalname).toLowerCase();
    cb(null, `${file.fieldname}-${Date.now()}${ext}`);
  }
});

const upload = multer({ storage });
router.get('/perfil/index', verificarSessaoUsuario, usuarioController.renderPerfil);

router.get('/inicio/index', verificarSessaoUsuario, usuarioController.renderInicio);

router.get('/agenda/index', verificarSessaoUsuario, usuarioController.renderAgenda);
router.get('/agenda/pesquisar', usuarioController.buscarViagens);
router.get('/agenda/formulario-participar/:cod', verificarSessaoUsuario, usuarioController.formularioParticipar);
router.post(
  '/agenda/requisitar-participacao',
  upload.fields([
    { name: 'encaminhamento', maxCount: 1 },
    { name: 'foto_acompanhante', maxCount: 1 }
  ]),
  verificarSessaoUsuario, usuarioController.requisitarParticipacao
);

router.get('/solicitar/index', verificarSessaoUsuario, usuarioController.renderSolicitar);
router.post('/solicitar/add-solicitacao', upload.fields([{ name: 'foto_acompanhante', maxCount: 1 },{ name: 'encaminhamento', maxCount: 1 } ]), verificarSessaoUsuario, usuarioController.addSolicitar);

router.get('/duvidas/index', verificarSessaoUsuario, usuarioController.renderDuvidas);


module.exports = router;