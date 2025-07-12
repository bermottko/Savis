const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const adminController = require('../controllers/adminController');

// Configuração do Multer
const storage = multer.diskStorage({
    destination: (req, file, cb) => cb(null, 'public/uploads/'),
    filename: (req, file, cb) => {
      const ext = path.extname(file.originalname).toLowerCase();
      cb(null, `${file.fieldname}-${Date.now()}${ext}`);
  }
});

function fileFilter(req, file, cb) {
  const isPDF = file.mimetype === 'application/pdf';
  const isFotoPerfil = file.fieldname === 'foto_perfil';
  
  if (isPDF || isFotoPerfil) {
    cb(null, true); // Aceita o upload
  } else {
    cb(new Error('Somente arquivos PDF ou imagem de perfil são permitidos.'));
  }
}

const upload = multer({ storage, fileFilter });

router.get('/usuarios/index', adminController.renderUsuarios);
router.get('/usuarios/buscar', adminController.buscarUsuarios);
router.delete('/usuarios/deletar/:cod', adminController.deletarUsuarios);
router.get('/usuarios/editar/:cod', adminController.editarUsuario);
router.put('/usuarios/editar/:cod', upload.single('foto_perfil'), adminController.salvarEdicaoUsuario);

router.get('/motoristas/index', adminController.renderMotoristas);
router.get('/motoristas/buscar', adminController.buscarMotoristas);
router.get('/motoristas/editar/:cod', adminController.editarMotorista);
router.delete('/motoristas/deletar/:cod', adminController.deletarMotoristas);
router.put(
  '/motoristas/editar/:cod',
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
  adminController.salvarEdicaoMotorista
);

router.get('/viagens/index', adminController.renderViagens);
router.get('/viagens/buscar-eventos', adminController.renderBuscarEventos);
router.get('/viagens/nova-viagem', adminController.renderNovaViagem);
router.post('/viagens/add-nova-viagem', adminController.renderCadastrarViagem);


router.get('/solicitacoes/index', adminController.renderSolicitacoes);

module.exports = router;
