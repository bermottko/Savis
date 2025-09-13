const { Usuario, Endereco, Genero, Solicitacao, Acompanhante, CidadeConsul } = require('../models');

exports.renderInicio = async (req, res) => {
    const codUsuario = req.session.usuario.cod;

    const usuario = await Usuario.findOne({
      where: { cod: codUsuario },
      include: [
        { model: Endereco },
        { model: Genero }
      ]
    });
    res.render('usuario/inicio/index', {
      usuario,
      layout: 'layouts/layoutUsuario',
      paginaAtual: 'inicio'
    });
}
exports.renderAgenda = (req, res) => {
    res.render('usuario/agenda/index', {
      layout: 'layouts/layoutUsuario',
      paginaAtual: 'agenda'
    });
}

exports.renderSolicitar = async (req, res) => {
  const cidadeconsul = await CidadeConsul.findAll();
    res.render('usuario/solicitar/index', {
      cidadeconsul,
      layout: 'layouts/layoutUsuario',
      paginaAtual: 'solicitar'
    });
}

exports.addSolicitar = async (req,res) => {
  const usuarioID = req.session.usuario.cod;
  let acompanhanteID = null;
  const foto_acompanhante = req.files?.foto_acompanhante?.[0]?.filename || null;
  const encaminhamento = req.files?.encaminhamento?.[0]?.filename || null;

    if (req.body.temAcompanhante === 'sim') {
      const acompanhanteCriado = await Acompanhante.create({
        img: foto_acompanhante,
        nome: req.body.nome,
        cpf: req.body.cpf,
        data_nasc: req.body.data_nasc,
        generoID: req.body.generoID,
        telefone: req.body.telefone
      });

      acompanhanteID = acompanhanteCriado.cod;
    }

  await Solicitacao.create({
    usuarioID,
    cidadeconsulID: req.body.cidadeconsulID,
    local_consul: req.body.local_consul,
    data_consul: req.body.data_consul,
    hora_consul: req.body.hora_consul,
    encaminhamento,
    objetivo: req.body.objetivo,
    obs: req.body.obs,
    statusID: null,
    acompanhanteID 
  });

    res.redirect('/usuario/solicitar/index');
} 

exports.renderDuvidas = (req, res) => {
    res.render('usuario/duvidas/index', {
      layout: 'layouts/layoutUsuario',
      paginaAtual: 'duvidas'
    });
}