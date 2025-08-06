const { Usuario, Endereco, Genero, Motorista, Documento, Viagem, Status } = require('../models');

exports.renderUsuarios = async (req, res) => {
  try {
    const usuarios = await Usuario.findAll({
      include: [
        { model: Endereco },
        { model: Genero }
      ],
      order: [['cod', 'DESC']]
    });

    res.render('motorista/usuarios/index', {
      usuarios,
      layout: 'layouts/layoutMotorista',
      paginaAtual: 'usuarios',
      userType: 'motorista'
    });
  } catch (erro) {
    console.error(erro);
    res.status(500).send('Erro ao buscar usuários: ' + erro);
  }
};

exports.renderViagens = async (req, res) => {
  try {
    const viagens = await Viagem.findAll({
      include: [
        { model: Motorista, as: 'Motorista' },
        { model: Status }
      ],
      order: [['cod', 'DESC']]
    });

    res.render('motorista/viagens/index', {
      viagens,
      layout: 'layouts/layoutMotorista',
      paginaAtual: 'viagens',
      userType: 'motorista'
    });
  } catch (erro) {
    console.error(erro);
    res.status(500).send('Erro ao carregar viagens');
  }
};

exports.renderBuscarEventos = async (req, res) => {
  try {
    const viagens = await Viagem.findAll();

    const eventos = viagens.map(v => ({
      title: v.destino_cid,
      start: v.data_viagem,
      url: `/motorista/viagens/ver-viagem/${v.cod}`
    }));

    res.json(eventos);
  } catch (erro) {
    console.error(erro);
    res.status(500).send('Erro ao carregar eventos do calendário');
  }
};

exports.renderVerViagem = async (req, res) => {
  try {
    const cod = req.params.cod;

    const viagem = await Viagem.findOne({
      where: { cod },
      include: [
        { model: Motorista, as: 'Motorista' },
        { model: Status }
      ]
    });

    if (!viagem) {
      return res.status(404).send('Viagem não encontrada');
    }

    res.render('motorista/viagens/ver-viagem', {
      viagem,
      layout: 'layouts/layoutMotorista',
      paginaAtual: 'viagens',
      userType: 'motorista'
    });
  } catch (erro) {
    console.error(erro);
    res.status(500).send('Erro ao carregar viagem');
  }
};
