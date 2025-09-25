const { Usuario, Endereco, Genero, Motorista, Documento, Viagem, Status, CidadeConsul, Veiculo, Participante, Acompanhante } = require('../models');

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
        { model: CidadeConsul, as: 'cidadeconsul' },
        { model: Veiculo, as: 'veiculo' },
        { model: Status },
        { model: Motorista, as: 'Motorista' }
      ],
      order: [['data_viagem', 'DESC']]
    });

    res.render('motorista/viagens/index', {
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
      viagens: viagensComOcupacao,
      layout: 'layouts/layoutMotorista',
      paginaAtual: 'viagens',
      userType: 'motorista'
    });
  } catch (erro) {
    console.error(erro);
    res.status(500).send('Erro ao carregar lista de viagens do motorista');
  }};

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
        { model: Status },
        { model: CidadeConsul },
        { model: Veiculo, as: 'veiculo' }
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

exports.verParticipantes = async (req, res) => {
  try {
    const cod = req.params.cod;

    const viagem = await Viagem.findOne({
      where: { cod },
      include: [
        { model: Veiculo, as: "veiculo" },
        {
          model: Participante,
          as: "participantes",
          include: [
            {
              model: Usuario,
              include: [{ model: Genero }, { model: Endereco }],
            },
            {
              model: Acompanhante,
              include: [{ model: Genero }],
              as: "acompanhante",
            },
          ],
        },
      ],
    });

    if (!viagem) {
      return res.status(404).send("Viagem não encontrada");
    }

    const qtdParticipantes = viagem.participantes.length;
    const qtdAcompanhantes = viagem.participantes.reduce(
      (soma, p) => soma + (p.acompanhante ? 1 : 0),
      0
    );

    const ocupacao = qtdParticipantes + qtdAcompanhantes;

    res.render("motorista/viagens/participantes", {
      ocupacao,
      viagem,
      participantes: viagem.participantes,
      layout: "layouts/layoutMotorista",
      paginaAtual: "viagens",
    });
  } catch (error) {
    console.error("Erro ao buscar participantes:", error);
    res.status(500).send("Erro ao buscar participantes da viagem");
  }
};

exports.renderRelatorio = async (req, res) => {
  try {
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
    let { combustivel, km_inicial, km_final, paradas, obs, horario_chega } = req.body;

    // Converter combustivel para float, null se inválido
    combustivel = parseFloat(combustivel);
    if (isNaN(combustivel)) combustivel = null;

    // Campos numéricos km
    km_inicial = km_inicial ? Number(km_inicial) : null;
    km_final   = km_final ? Number(km_final) : null;

    // Campos de texto
    paradas = paradas || null;
    obs = obs || null;
    horario_chega = horario_chega || null;

    await Viagem.update(
      { combustivel, km_inicial, km_final, paradas, obs, horario_chega },
      { where: { cod } }
    );

    res.redirect("/motorista/viagens/index");
  } catch (err) {
    console.error("Erro ao salvar relatório:", err);
    res.status(500).send("Erro no servidor");
  }
};

exports.renderBuscarEventos = async (req, res) => {
    const viagens = await Viagem.findAll({
      include: [{
        model: CidadeConsul
      }]
    });

    const eventos = viagens.map(v => ({
      title: v.cidadeconsul.descricao,
      start: v.data_viagem,
      url: `/motorista/viagens/ver-viagem/${v.cod}`
    }));
    res.json(eventos);
}