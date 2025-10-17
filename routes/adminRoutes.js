const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const adminController = require('../controllers/adminController');
const { verificarSessaoChefe } = require('../controllers/authController');

// configuração do Multer
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
  const isFotoAcomp = file.fieldname === 'foto_acompanhante'; // novo nome

  if (isPDF || isFotoPerfil || isFotoAcomp) {
    cb(null, true);
  } else {
    cb(new Error('Somente arquivos PDF ou imagem de perfil/acompanhante são permitidos.'));
  }
}


const upload = multer({ storage, fileFilter });

router.get('/perfil', verificarSessaoChefe, adminController.renderPerfil);

router.get('/usuarios/index', verificarSessaoChefe, adminController.renderUsuarios);
router.get("/usuarios/pesquisar", adminController.pesquisarUsuarios);
//router.get('/usuarios/buscar', verificarSessaoChefe, adminController.buscarUsuarios);
router.delete('/usuarios/deletar/:cod', verificarSessaoChefe, adminController.deletarUsuarios);
router.get('/usuarios/editar/:cod', verificarSessaoChefe, adminController.editarUsuario);
router.put('/usuarios/editar/:cod', upload.single('foto_perfil'), verificarSessaoChefe, adminController.salvarEdicaoUsuario);

router.get('/motoristas/index', verificarSessaoChefe, adminController.renderMotoristas);
router.get('/motoristas/pesquisar', verificarSessaoChefe, adminController.pesquisarMotoristas);
router.get('/motoristas/editar/:cod', verificarSessaoChefe, adminController.editarMotorista);
router.delete('/motoristas/deletar/:cod', verificarSessaoChefe, adminController.deletarMotoristas);
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
  verificarSessaoChefe, adminController.salvarEdicaoMotorista
);

router.get('/viagens/lista', verificarSessaoChefe, adminController.renderViagensLista);
router.get('/viagens/pesquisar', adminController.pesquisarViagens);
/*router.get('/viagens/buscar-viagens', verificarSessaoChefe, adminController.buscarViagens);*/
router.get('/viagens/index', verificarSessaoChefe, adminController.renderViagens);
router.get('/viagens/buscar-eventos', verificarSessaoChefe, adminController.renderBuscarEventos);
router.get('/viagens/nova-viagem', verificarSessaoChefe, adminController.renderNovaViagem);
router.post('/viagens/add-nova-viagem', verificarSessaoChefe, adminController.renderCadastrarViagem);
router.get('/viagens/ver-viagem/:cod', verificarSessaoChefe, adminController.renderVerViagem);
router.get('/viagens/editar/:cod', verificarSessaoChefe, adminController.editarViagem);
router.put('/viagens/editar/:cod', verificarSessaoChefe, adminController.salvarEdicaoViagem);
router.put('/viagens/cancelar/:cod', verificarSessaoChefe, adminController.cancelarViagem );
router.get('/viagens/participantes/:cod', verificarSessaoChefe, adminController.verParticipantes);
router.get('/viagens/adicionar-participante/:cod', verificarSessaoChefe, adminController.adicionarParticipante);
router.get('/viagens/formulario-participante/:cod', verificarSessaoChefe, adminController.formularioParticipante);
router.post(
  '/viagens/vincular-usuario/:cod',
  upload.fields([
    { name: 'encaminhamento', maxCount: 1 },
    { name: 'foto_acompanhante', maxCount: 1 }
  ]),
  verificarSessaoChefe, adminController.vincularUsuario
);
router.delete('/viagens/desvincular/:cod', verificarSessaoChefe, adminController.desvincularParticipante);

router.get('/solicitacoes/index', verificarSessaoChefe, adminController.renderSolicitacoes);
router.get('/solicitacoes/participacoes', verificarSessaoChefe, adminController.renderParticipacoes);
router.get('/solicitacoes/aceitar/:cod', verificarSessaoChefe, adminController.aceitarSolicitacoe);
router.delete('/solicitacoes/rejeitar/:cod', verificarSessaoChefe, adminController.rejeitarSolicitacoe);
router.delete('/solicitacoes/rejeitarParticipacao/:cod', verificarSessaoChefe, adminController.rejeitarSolicitacoeParticipacao);

module.exports = router;
