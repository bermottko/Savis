const { Usuario, Endereco, Genero, Motorista, Documento, Viagem, Status, CidadeConsul, Veiculo, Participante, Acompanhante } = require('../models');

exports.renderPerfil = async (req, res) => {
  try {
    const codMotorista = req.session.motorista.cod;

    const motorista = await Motorista.findOne({
      where: { cod: codMotorista },
      include: [
        { model: Endereco },
        { model: Genero },
        { model: Documento }
      ],
    });

    res.render('motorista/perfil/index', {
      motorista,
      layout: 'layouts/layoutMotorista',
      paginaAtual: 'perfil',
      userType: 'motorista'
    });
  } catch (err) {
    console.error("Erro ao carregar perfil:", err);
    res.status(500).send("Erro no servidor");
  }
};

exports.renderUsuarios = async (req, res) => {
  try {
    const codMotorista = req.session.motorista.cod;
    const motorista = await Motorista.findOne({ where: { cod: codMotorista } });

    const usuarios = await Usuario.findAll({
      include: [{ model: Endereco }, { model: Genero }],
      order: [['cod', 'DESC']]
    });

    res.render('motorista/usuarios/index', {
      motorista,
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
    const codMotorista = req.session.motorista.cod;
    const motorista = await Motorista.findOne({ where: { cod: codMotorista } });

    const viagens = await Viagem.findAll({
      include: [
        { model: CidadeConsul, as: 'cidadeconsul' },
        { model: Veiculo, as: 'veiculo' },
        { model: Status },
        { model: Motorista, as: 'Motorista' }
      ],
      order: [['data_viagem', 'DESC']]
    });

    res.render('motorista/viagens/index', {
      motorista,
      viagens,
      layout: 'layouts/layoutMotorista',
      paginaAtual: 'viagens',
      userType: 'motorista'
    });
  } catch (erro) {
    console.error(erro);
    res.status(500).send('Erro ao carregar calendário de viagens do motorista');
  }
};

exports.renderViagensLista = async (req, res) => {
  try {
    const codMotorista = req.session.motorista.cod;
    const motorista = await Motorista.findOne({ where: { cod: codMotorista } });

    const viagens = await Viagem.findAll({
      include: [
        { model: CidadeConsul, as: 'cidadeconsul' },
        { model: Veiculo, as: 'veiculo' },
        { model: Status },
        { model: Motorista, as: 'Motorista' },
        { model: Participante, as: 'participantes' }
      ],
      order: [["data_viagem", "ASC"], ["horario_saida", "ASC"]]
    });

    const viagensComOcupacao = viagens.map((v) => {
      const qtdParticipantes = v.participantes.length;
      const qtdAcompanhantes = v.participantes.reduce(
        (soma, p) => soma + (p.acompanhanteID ? 1 : 0),
        0
      );

      return {
        ...v.toJSON(),
        ocupacao: qtdParticipantes + qtdAcompanhantes,
      };
    });

    res.render('motorista/viagens/lista', {
      motorista,
      viagens: viagensComOcupacao,
      layout: 'layouts/layoutMotorista',
      paginaAtual: 'viagens',
      userType: 'motorista'
    });
  } catch (erro) {
    console.error(erro);
    res.status(500).send('Erro ao carregar lista de viagens do motorista');
  }
};

exports.renderBuscarEventos = async (req, res) => {
  try {
    const viagens = await Viagem.findAll({
      include: [{ model: CidadeConsul, as: 'cidadeconsul' }]
    });

   const eventos = viagens.map((v) => {
 
    let corFundo = '#a2c3f2';
    let corBorda = '#87afe6';
    let corTexto = '#fff';

    switch (v.statusID) {
      case 1: // AGENDADA
        corFundo = '#a2c3f2'; 
        corBorda = '#87afe6';
        corTexto = '#fff';
        break;
      case 2: // "CANCELADA"
        corFundo = '#c38883ff'; 
        corBorda = '#ac6a64ff';
        corTexto = '#fff';
        break;
      case 3: // "CONCLUIDA"
        corFundo = '#bcde9eff'; 
        corBorda = '#a1d49fff';
        corTexto = '#fff';
        break;
    }

    return {
      title: v.cidadeconsul.descricao,
      start: v.data_viagem,
      url: `/motorista/viagens/ver-viagem/${v.cod}`,
      backgroundColor: corFundo,
      borderColor: corBorda,
      textColor: corTexto,
    };
  });

  res.json(eventos);

  } catch (erro) {
    console.error(erro);
    res.status(500).send('Erro ao carregar eventos do calendário');
  }
};

exports.renderVerViagem = async (req, res) => {
  try {
    const codMotorista = req.session.motorista.cod;
    const motorista = await Motorista.findOne({ where: { cod: codMotorista } });

    const cod = req.params.cod;
    const viagem = await Viagem.findOne({
      where: { cod },
      include: [
        { model: Motorista, as: 'Motorista' },
        { model: Status },
        { model: CidadeConsul, as: 'cidadeconsul' },
        { model: Veiculo, as: 'veiculo' }
      ]
    });

    if (!viagem) return res.status(404).send('Viagem não encontrada');

    res.render('motorista/viagens/ver-viagem', {
      motorista,
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

exports.verParticipantes = async (req, res) => {
  try {
    const codMotorista = req.session.motorista.cod;
    const motorista = await Motorista.findOne({ where: { cod: codMotorista } });

    const cod = req.params.cod;

    const viagem = await Viagem.findOne({
      where: { cod },
      include: [
        { model: Veiculo, as: "veiculo" },
        {
          model: Participante,
          as: "participantes",
          include: [
            { model: Usuario, include: [{ model: Genero }, { model: Endereco }] },
            { model: Acompanhante, include: [{ model: Genero }], as: "acompanhante" },
          ],
        },
      ],
    });

    if (!viagem) return res.status(404).send("Viagem não encontrada");

    const qtdParticipantes = viagem.participantes.length;
    const qtdAcompanhantes = viagem.participantes.reduce(
      (soma, p) => soma + (p.acompanhante ? 1 : 0),
      0
    );
    const ocupacao = qtdParticipantes + qtdAcompanhantes;

    res.render("motorista/viagens/participantes", {
      motorista,
      viagem,
      participantes: viagem.participantes,
      ocupacao,
      layout: "layouts/layoutMotorista",
      paginaAtual: "viagens",
      userType: "motorista"
    });
  } catch (error) {
    console.error("Erro ao buscar participantes:", error);
    res.status(500).send("Erro ao buscar participantes da viagem");
  }
};

exports.renderRelatorio = async (req, res) => {
  try {
    const codMotorista = req.session.motorista.cod;
    const motorista = await Motorista.findOne({ where: { cod: codMotorista } });

    const { cod } = req.params;
    const viagem = await Viagem.findByPk(cod, {
      include: [
        { model: CidadeConsul, as: 'cidadeconsul' },
        { model: Veiculo, as: 'veiculo' },
        { model: Motorista, as: 'Motorista' },
        { model: Status }
      ]
    });

    if (!viagem) return res.status(404).send("Viagem não encontrada");

    res.render("motorista/viagens/relatorio", { 
      motorista,
      viagem,
      layout: "layouts/layoutMotorista",
      paginaAtual: "viagens",
      userType: "motorista"
    });

  } catch (err) {
    console.error("Erro ao carregar relatório:", err);
    res.status(500).send("Erro no servidor");
  }
};

exports.salvarRelatorio = async (req, res) => {
  try {
    const { cod } = req.params;
    let { combustivel, km_inicial, km_final, paradas, obs, horario_chega} = req.body;

    combustivel = parseFloat(combustivel);
    if (isNaN(combustivel)) combustivel = null;

    km_inicial = km_inicial ? Number(km_inicial) : null;
    km_final   = km_final ? Number(km_final) : null;

    paradas = paradas || null;
    obs = obs || null;
    horario_chega = horario_chega || null;
    const statusID = 3;

    await Viagem.update(
      { combustivel, km_inicial, km_final, paradas, obs, horario_chega, statusID },
      { where: { cod } }
    );

    res.redirect("/motorista/viagens/index");
  } catch (err) {
    console.error("Erro ao salvar relatório:", err);
    res.status(500).send("Erro no servidor");
  }
};

