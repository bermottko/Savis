const { Usuario, Endereco, Genero, Motorista, Documento, Viagem, Status, CidadeConsul, Solicitacao, Acompanhante, Participante, Veiculo} = require('../models');
const { Op, where } = require('sequelize');

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

exports.renderAgenda = async (req, res) => {
    const cod_usuario = req.session.usuario.cod;
    const viagens = await Viagem.findAll({
      include: [
        {model: CidadeConsul, as: 'cidadeconsul'},
        {model: Participante, as: 'participantes'},
         { model: Veiculo, as: 'veiculo' },
      ]
    });
    const viagensComOcupacao = viagens.map(v => {
    const qtdParticipantes = v.participantes.length;
    const qtdAcompanhantes = v.participantes.reduce(
      (soma, p) => soma + (p.acompanhanteID ? 1 : 0),
      0
    );

    return {
      ...v.toJSON(), // transforma em objeto plano
      ocupacao: qtdParticipantes + qtdAcompanhantes
    };
  });
    res.render('usuario/agenda/index', {
      cod_usuario,
      viagens: viagensComOcupacao,
      layout: 'layouts/layoutUsuario',
      paginaAtual: 'agenda'
    });
  
}

exports.buscarViagens = async (req, res) => {
  try {
    const { cidade, data } = req.query;
    let where = {};

    if (cidade) {
      where["$cidadeconsul.descricao$"] = { [Op.like]: `%${cidade}%` };
    }
    if (data) {
      where.data_viagem = { [Op.eq]: data };
    }

    const viagens = await Viagem.findAll({
      where,
      include: [
        { model: Motorista, as: "Motorista" },
        { model: Status, as: "status" },
        { model: CidadeConsul, as: "cidadeconsul" },
        { model: Veiculo, as: "veiculo" }
      ]
    });

    res.json(viagens);
  } catch (erro) {
    console.error(erro);
    res.status(500).json({ erro: "Erro ao buscar viagens" });
  }
};

exports.formularioParticipar = async (req, res) => {
    const cod_viagem = req.params.cod;
    const cod = req.session.usuario.cod;

    const usuario = await Usuario.findOne({
      where: { cod },
      include: [Genero, Endereco]
    });

    const viagem = await Viagem.findOne({
      where: { cod: cod_viagem },
      include: [
        {
          model: Participante,
          as: 'participantes',
          include: [
            {
              model: Acompanhante,
              as: 'acompanhante' 
            }
          ]
        },
        {
          model: Veiculo,
          as: 'veiculo'
        }
      ]
    });

    // calcula ocupação
    const qtdParticipantes = viagem.participantes.length;
    const qtdAcompanhantes = viagem.participantes.reduce(
      (soma, p) => soma + (p.acompanhante ? 1 : 0),
      0
    );

    const ocupacao = qtdParticipantes + qtdAcompanhantes;

    res.render('usuario/agenda/formulario-participar', {
      ocupacao,
      viagem,
      usuario,
      cod: cod_viagem,
      layout: 'layouts/layoutUsuario',
      paginaAtual: 'agenda'
    });
  };

exports.vincularUsuario = async (req, res) => {
  try {
    const cod = req.params.cod; // viagemID
    const usuarioID = req.body.usuarioID; // vem do input hidden

    const { 
      local_consul, hora_consul,
      encaminhamento, objetivo, obs,
      temAcompanhante, nome, cpf, data_nasc, generoID, telefone
    } = req.body;

    if (!usuarioID) {
      return res.status(400).send('Nenhum usuário selecionado');
    }

    let acompanhanteID = null;

    // pega a foto do acompanhante (se foi enviada)
    let fotoAcomp = null;
    if (req.files && req.files['foto_acompanhante'] && req.files['foto_acompanhante'][0]) {
      fotoAcomp = req.files['foto_acompanhante'][0].filename;
    }

    // Se usuário marcou "Sim" no campo acompanhante
    if (temAcompanhante === "sim") {
      const novoAcomp = await Acompanhante.create({
        img: fotoAcomp,  // salva o nome do arquivo no banco
        nome,
        cpf,
        data_nasc,
        generoID,
        telefone
      });

      acompanhanteID = novoAcomp.cod; // pega a PK criada
    }

    // pega o arquivo de encaminhamento (se foi enviado)
    let encaminhamentoFile = encaminhamento;
    if (req.files && req.files['encaminhamento'] && req.files['encaminhamento'][0]) {
      encaminhamentoFile = req.files['encaminhamento'][0].filename;
    }

    // Agora cria o participante
    await Participante.create({
      usuarioID,
      viagemID: cod,
      local_consul,
      hora_consul,
      encaminhamento: encaminhamentoFile,
      objetivo,
      obs: obs || null,
      acompanhanteID, // se null, não vincula
      statusID: 1
    });

    res.redirect(`/usuario/inicio/index`);
    
  } catch (error) {
    console.error('Erro ao vincular usuário:', error);
    res.status(500).send('Erro ao vincular usuário à viagem');
  }
};

exports.renderSolicitar = async (req, res) => {
  const cidadeconsul = await CidadeConsul.findAll();
    res.render('usuario/solicitar/index', {
      cidadeconsul,
      layout: 'layouts/layoutUsuario',
      paginaAtual: 'solicitar',
      preenchido: {} 
    });
}

exports.addSolicitar = async (req, res) => {
  try {
    const usuarioID = req.session.usuario.cod;
    let acompanhanteID = null;

    // Campos do formulário
    const { cidadeconsulID, local_consul, data_consul, hora_consul, objetivo, temAcompanhante, nome, cpf, data_nasc, telefone, generoID, obs } = req.body;

    // Arquivos (PDF do encaminhamento + foto do acompanhante)
    const encaminhamento = req.files?.encaminhamento?.[0]?.filename || null;
    const foto_acompanhante = req.files?.foto_acompanhante?.[0]?.filename || null;

    // Validação backend
    let erros = [];

    if (!cidadeconsulID) erros.push({ campo: "cidadeconsulID", msg: "Selecione uma cidade." });
    if (!local_consul) erros.push({ campo: "local_consul", msg: "Informe o local da consulta." });
    if (!data_consul || new Date(data_consul).setHours(0,0,0,0) < new Date().setHours(0,0,0,0)) erros.push({ campo: "data_consul", msg: "Informe uma data válida." });
    if (!hora_consul) erros.push({ campo: "hora_consul", msg: "Informe o horário da consulta." });
    if (!objetivo) erros.push({ campo: "objetivo", msg: "Informe o objetivo da consulta." });
    if (!encaminhamento) erros.push({ campo: "encaminhamento", msg: "Envie o encaminhamento em PDF." });

    if (temAcompanhante === "sim") {
      if (!nome) erros.push({ campo: "nome", msg: "Informe o nome do acompanhante." });
      if (!cpf || cpf.replace(/\D/g,'').length !== 11) erros.push({ campo: "cpf", msg: "Informe um CPF válido." });
      if (!data_nasc) erros.push({ campo: "data_nasc", msg: "Informe a data de nascimento do acompanhante." });
      if (!telefone || telefone.replace(/\D/g,'').length < 10) erros.push({ campo: "telefone", msg: "Informe um telefone válido." });
      if (!generoID) erros.push({ campo: "generoID", msg: "Selecione o gênero do acompanhante." });
    }

    // Se houver erros, renderiza a página com erros e dados preenchidos
    if (erros.length > 0) {
      return res.render('usuario/solicitar/index', {
        cidadeconsul: await CidadeConsul.findAll(),
        layout: 'layouts/layoutUsuario',
        paginaAtual: 'solicitar',
        erros,
        preenchido: req.body || {} // Mantém os valores preenchidos
      });
    }

    // Criação do acompanhante (se houver)
    if (temAcompanhante === "sim") {
      try {
        const acompanhanteCriado = await Acompanhante.create({
          img: foto_acompanhante, // aqui vai a foto salva
          nome,
          cpf: cpf.replace(/\D/g,''),
          data_nasc,
          generoID,
          telefone: telefone.replace(/\D/g,'')
        });
        acompanhanteID = acompanhanteCriado.cod;
      } catch (error) {
        // Tratamento de CPF duplicado
        if (error.name === "SequelizeUniqueConstraintError" && error.fields?.cpf) {
          return res.render("usuario/solicitar/index", {
            cidadeconsul: await CidadeConsul.findAll(),
            layout: "layouts/layoutUsuario",
            paginaAtual: "solicitar",
            erros: [{ campo: "cpf", msg: "Este CPF já está cadastrado para outro acompanhante." }],
            preenchido: req.body || {}
          });
        }
        throw error; // outros erros caem no catch principal
      }
    }

    // Criação da solicitação
    await Solicitacao.create({
      usuarioID,
      cidadeconsulID,
      local_consul,
      data_consul,
      hora_consul,
      encaminhamento,
      objetivo,
      obs: obs || null,
      statusID: null,
      acompanhanteID
    });

    res.redirect('/usuario/solicitar/index');

  } catch (err) {
    console.error("Erro ao salvar solicitação:", err);
    res.status(500).send('Erro ao salvar solicitação.');
  }
};

exports.renderDuvidas = (req, res) => {
    res.render('usuario/duvidas/index', {
      layout: 'layouts/layoutUsuario',
      paginaAtual: 'duvidas'
    });
}

