const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const usuarioController = require('../controllers/usuarioController');

// Configuração do Multer
const storage = multer.diskStorage({
    destination: (req, file, cb) => cb(null, 'public/uploads/'),
    filename: (req, file, cb) => {
    const ext = path.extname(file.originalname).toLowerCase();
    cb(null, `${file.fieldname}-${Date.now()}${ext}`);
  }
});

const upload = multer({ storage });
router.get('/perfil/index', usuarioController.renderPerfil);

router.get('/inicio/index', usuarioController.renderInicio);

router.get('/agenda/index', usuarioController.renderAgenda);
router.get('/agenda/buscar-viagens', usuarioController.buscarViagens);
router.get('/agenda/formulario-participar/:cod', usuarioController.formularioParticipar);
router.post(
  '/agenda/vincular-usuario/:cod',
  upload.fields([
    { name: 'encaminhamento', maxCount: 1 },
    { name: 'foto_acompanhante', maxCount: 1 }
  ]),
  usuarioController.vincularUsuario
);

router.get('/solicitar/index', usuarioController.renderSolicitar);
router.post('/solicitar/add-solicitacao', upload.fields([{ name: 'foto_acompanhante', maxCount: 1 },{ name: 'encaminhamento', maxCount: 1 } ]), usuarioController.addSolicitar);

router.get('/duvidas/index', usuarioController.renderDuvidas);

module.exports = router;