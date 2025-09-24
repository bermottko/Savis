const {
  Usuario,
  Endereco,
  Genero,
  Motorista,
  Chefe,
  Documento,
  Viagem,
  Status,
  CidadeConsul,
  Solicitacao,
  Acompanhante,
  Participante,
  Veiculo,
} = require("../models");
const { Op } = require("sequelize");
const { Sequelize } = require("sequelize");
const bcrypt = require("bcrypt");

//PARA ENSERIR O ADMIN

/*async function inserirChefeAutomatico() {
  try {
    const matricula = 5555;
    const senha = '1234';
    const nome = 'ber';

    const senhaHash = await bcrypt.hash(senha, 10);

    const chefe = await Chefe.create({
      nome,
      matricula, 
      senha: senhaHash
    });

    console.log('Chefe inserido com sucesso:', chefe.toJSON());
  } catch (err) {
    console.error('Erro ao inserir chefe:', err);
  }
}


inserirChefeAutomatico();
*/

exports.renderUsuarios = async (req, res) => {
  try {
    const posts = await Usuario.findAll({
      include: [{ model: Endereco }, { model: Genero }],
    });
    posts.sort((a, b) => b.cod - a.cod);
    res.render("admin/usuarios/index", {
      posts,
      layout: "layouts/layoutAdmin",
      paginaAtual: "usuarios",
    });
  } catch (erro) {
    console.error(erro);
    res.status(500).send("Erro ao buscar usuários: " + erro);
  }
};

exports.buscarUsuarios = async (req, res) => {
  try {
    const termo = req.query.q || "";
    const usuarios = await Usuario.findAll({
      where: {
        nome: {
          [Op.like]: `%${termo}%`,
        },
      },
    });
    res.json(usuarios);
  } catch (erro) {
    console.error(erro);
    res.status(500).json({ erro: "Erro ao buscar usuários" });
  }
};

exports.deletarUsuarios = async (req, res) => {
  try {
    const { cod } = req.params;
    const usuario = await Usuario.findByPk(cod);
    if (!usuario) {
      return res.status(404).send("Usuário não encontrado");
    }
    await usuario.destroy();
    res.redirect("/admin/usuarios/index");
  } catch (error) {
    console.error("Erro ao deletar usuário:", error);
    res.status(500).send("Erro interno no servidor");
  }
};

exports.editarUsuario = async (req, res) => {
  try {
    const cod = req.params.cod;
    const usuario = await Usuario.findOne({
      where: { cod },
      include: [{ model: Endereco }, { model: Genero }],
    });
    if (!usuario) {
      return res.status(404).send("Usuário não encontrado");
    }
    res.render("admin/usuarios/editar", {
      usuario,
      layout: "layouts/layoutAdmin",
      paginaAtual: "usuarios",
      erros: {},
      preenchido: {},
    });
  } catch (erro) {
    console.error(erro);
    res.status(500).send("Erro ao carregar usuário para edição");
  }
};

exports.salvarEdicaoUsuario = async (req, res) => {
  try {
    const cod = req.params.cod;
    const usuario = await Usuario.findByPk(cod, {
      include: [{ model: Endereco }, { model: Genero }],
    });

    if (!usuario) return res.status(404).send("Usuário não encontrado");

    const { CPF, fone, cep, email, SUS } = req.body;
    let erros = {};
    let preenchido = req.body;

    // Validação CPF
    if (!CPF || CPF.replace(/\D/g, "").length !== 11) {
      erros.erroCPF = "CPF inválido. Deve conter 11 dígitos.";
    }

    // Validação Telefone
    if (!fone || fone.replace(/\D/g, "").length !== 11) {
      erros.erroFone = "Telefone inválido. Deve conter 11 dígitos.";
    }

    // Validação CEP
    if (!cep || cep.replace(/\D/g, "").length !== 8) {
      erros.erroCEP = "CEP inválido. Deve conter 8 dígitos.";
    }

    // Validação Email
    const regexEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email || !regexEmail.test(email)) {
      erros.erroEmail = "Digite um email válido.";
    }

    // Validação SUS (mínimo e máximo 15 dígitos)
    if (!SUS || SUS.replace(/\D/g, "").length !== 15) {
      erros.erroSUS = "Número do SUS inválido. Deve conter 15 dígitos.";
    }

    // Se houver erros, renderiza de volta com mensagens
    if (Object.keys(erros).length > 0) {
      return res.render("admin/usuarios/editar", {
        usuario,
        layout: "layouts/layoutAdmin",
        paginaAtual: "usuarios",
        erros,
        preenchido,
      });
    }

    // Atualiza endereço
    await Endereco.update(
      {
        rua: req.body.rua,
        numero: req.body.numero,
        bairro: req.body.bairro,
        cidade: req.body.cidade,
        UF: req.body.uf,
        CEP: req.body.cep.replace(/\D/g, ""),
      },
      { where: { cod: usuario.enderecoID } }
    );

    // Atualiza dados do usuário
    const fotoPerfil = req.file ? req.file.filename : usuario.img;

    await Usuario.update(
      {
        img: fotoPerfil,
        nome: req.body.nome,
        data_nasc: req.body.data_nasc,
        CPF: req.body.CPF.replace(/\D/g, ""),
        generoID: req.body.genero,
        email: req.body.email,
        fone: req.body.fone.replace(/\D/g, ""),
        SUS: req.body.SUS.replace(/\D/g, ""),
      },
      { where: { cod } }
    );

    res.redirect("/admin/usuarios/index");
  } catch (erro) {
    console.error(erro);
    res.status(500).send("Erro ao salvar edição: " + erro);
  }
};

exports.renderMotoristas = async (req, res) => {
  try {
    const motoristas = await Motorista.findAll({
      include: [{ model: Endereco }, { model: Genero }, { model: Documento }],
    });
    motoristas.sort((a, b) => b.cod - a.cod);
    res.render("admin/motoristas/index", {
      posts: motoristas,
      layout: "layouts/layoutAdmin",
      paginaAtual: "motoristas",
    });
  } catch (erro) {
    console.error(erro);
    res.status(500).send("Erro ao buscar motoristas: " + erro);
  }
};

exports.buscarMotoristas = async (req, res) => {
  try {
    const termo = req.query.q || "";
    const motoristas = await Motorista.findAll({
      where: {
        nome: {
          [Op.like]: `%${termo}%`,
        },
      },
      include: [{ model: Endereco }, { model: Genero }],
    });
    res.json(motoristas);
  } catch (erro) {
    console.error(erro);
    res.status(500).json({ erro: "Erro ao buscar motoristas" });
  }
};

exports.deletarMotoristas = async (req, res) => {
  try {
    const { cod } = req.params;
    const motorista = await Motorista.findByPk(cod);
    if (!motorista) {
      return res.status(404).send("Motorista não encontrado");
    }
    await motorista.destroy();
    res.redirect("/admin/motoristas/index");
  } catch (error) {
    console.error("Erro ao deletar motorista:", error);
    res.status(500).send("Erro interno no servidor");
  }
};

exports.editarMotorista = async (req, res) => {
  try {
    const cod = req.params.cod;
    const motorista = await Motorista.findOne({
      where: { cod },
      include: [{ model: Endereco }, { model: Genero }],
    });
    if (!motorista) {
      return res.status(404).send("Motorista não encontrado");
    }
    res.render("admin/motoristas/editar", {
      usuario: motorista,
      layout: "layouts/layoutAdmin",
      paginaAtual: "motoristas",
      erros: {},
      preenchido: {},
    });
  } catch (erro) {
    console.error(erro);
    res.status(500).send("Erro ao carregar motorista para edição");
  }
};

exports.salvarEdicaoMotorista = async (req, res) => {
  try {
    console.log(req.files);

    const cod = req.params.cod;
    const motorista = await Motorista.findByPk(cod, {
      include: [{ model: Endereco }, { model: Genero }, { model: Documento }],
    });

    if (!motorista) return res.status(404).send("Motorista não encontrado");

    const { CPF, fone, cep, email } = req.body;
    let erros = {};
    let preenchido = req.body;

    // validação CPF
    if (!CPF || CPF.replace(/\D/g, "").length !== 11) {
      erros.erroCPF = "CPF inválido. Deve conter 11 dígitos.";
    }

    // validação Telefone
    if (!fone || fone.replace(/\D/g, "").length !== 11) {
      erros.erroFone = "Telefone inválido. Deve conter 11 dígitos.";
    }

    // validação CEP
    if (!cep || cep.replace(/\D/g, "").length !== 8) {
      erros.erroCEP = "CEP inválido. Deve conter 8 dígitos.";
    }

    // validação Email
    const regexEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email || !regexEmail.test(email)) {
      erros.erroEmail = "Digite um email válido.";
    }

    // se houver qualquer erro, renderiza de volta com mensagens
    if (Object.keys(erros).length > 0) {
      return res.render("admin/motoristas/editar", {
        usuario: motorista,
        layout: "layouts/layoutAdmin",
        paginaAtual: "motoristas",
        erros,
        preenchido,
      });
    }

    // Atualiza endereço
    await Endereco.update(
      {
        rua: req.body.rua,
        numero: req.body.numero,
        bairro: req.body.bairro,
        cidade: req.body.cidade,
        UF: req.body.uf,
        CEP: req.body.cep.replace(/\D/g, ""),
      },
      { where: { cod: motorista.enderecoID } }
    );

    // Atualiza dados do motorista
    const fotoPerfil = req.files?.foto_perfil?.[0]?.filename || motorista.img;

    await Motorista.update(
      {
        img: fotoPerfil,
        nome: req.body.nome,
        data_nasc: req.body.data_nasc,
        CPF: req.body.CPF.replace(/\D/g, ""),
        generoID: req.body.genero,
        email: req.body.email,
        fone: req.body.fone.replace(/\D/g, ""),
      },
      { where: { cod } }
    );

    // Atualiza ou cria documentos
    const camposDocumentos = [
      "carteira_trab",
      "cursos",
      "habilitacao",
      "comprov_resid",
      "comprov_escola",
      "titulo_eleitor",
      "ant_crim",
      "exame_tox",
    ];

    if (!motorista.docsID && Object.keys(req.files || {}).length > 0) {
      // cria novo Documento
      const novoDoc = {};
      camposDocumentos.forEach((campo) => {
        if (req.files[campo]) novoDoc[campo] = req.files[campo][0].filename;
      });
      const documentoCriado = await Documento.create(novoDoc);
      await Motorista.update(
        { docsID: documentoCriado.cod },
        { where: { cod } }
      );
    } else if (motorista.docsID && Object.keys(req.files || {}).length > 0) {
      // atualiza documento existente
      const novosDados = {};
      camposDocumentos.forEach((campo) => {
        if (req.files[campo]) novosDados[campo] = req.files[campo][0].filename;
      });
      if (Object.keys(novosDados).length > 0) {
        await Documento.update(novosDados, {
          where: { cod: motorista.docsID },
        });
      }
    }

    res.redirect("/admin/motoristas/index");
  } catch (erro) {
    console.error(erro);
    res.status(500).send("Erro ao salvar edição: " + erro);
  }
};

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
        { model: Veiculo, as: "veiculo" },
      ],
    });

    res.json(viagens);
  } catch (erro) {
    console.error(erro);
    res.status(500).json({ erro: "Erro ao buscar viagens" });
  }
};

exports.renderViagens = (req, res) => {
  res.render("admin/viagens/index", {
    layout: "layouts/layoutAdmin",
    paginaAtual: "viagens",
  });
};

exports.renderBuscarEventos = async (req, res) => {
  const viagens = await Viagem.findAll({
    include: [
      { model: CidadeConsul },
    ],
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
      url: `/admin/viagens/ver-viagem/${v.cod}`,
      backgroundColor: corFundo,
      borderColor: corBorda,
      textColor: corTexto,
    };
  });

  res.json(eventos);
};

exports.renderNovaViagem = async (req, res) => {
  try {
    const cidadeconsul = await CidadeConsul.findAll();
    const motoristas = await Motorista.findAll();
    const veiculos = await Veiculo.findAll();

    const dataSelecionada = req.query.data_viagem || "";
    const cidadeSelecionada = req.query.cidade_consul || "";
    const solicitacaoID = req.query.solicitacaoID || null;

    res.render("admin/viagens/nova-viagem", {
      layout: "layouts/layoutAdmin",
      paginaAtual: "viagens",
      veiculos,
      motoristas,
      cidadeconsul,
      dataSelecionada,
      cidadeSelecionada: cidadeSelecionada || "",
      solicitacaoID,
    });
  } catch (erro) {
    console.error(erro);
    res.status(500).send("Erro ao carregar motoristas: " + erro);
  }
};

exports.renderCadastrarViagem = async (req, res) => {
  try {
    const {
      solicitacaoID,
      cidadeconsulID,
      data_viagem,
      horario_saida,
      veiculoID,
      motoristaID,
    } = req.body;

    let erros = [];
    if (!cidadeconsulID)
      erros.push({ campo: "cidadeconsulID", msg: "Selecione uma cidade." });
    if (!data_viagem)
      erros.push({ campo: "data_viagem", msg: "Informe a data da viagem." });
    if (!horario_saida)
      erros.push({
        campo: "horario_saida",
        msg: "Informe o horário de saída.",
      });
    if (!veiculoID)
      erros.push({ campo: "veiculoID", msg: "Selecione um veículo." });
    if (!motoristaID)
      erros.push({ campo: "motoristaID", msg: "Selecione um motorista." });

    if (erros.length > 0) {
      const cidadeconsul = await CidadeConsul.findAll();
      const motoristas = await Motorista.findAll();
      const veiculos = await Veiculo.findAll();

      return res.render("admin/viagens/nova-viagem", {
        layout: "layouts/layoutAdmin",
        paginaAtual: "viagens",
        veiculos,
        motoristas,
        cidadeconsul,
        dataSelecionada: data_viagem,
        cidadeSelecionada: cidadeconsulID,
        solicitacaoID,
        erros,
      });
    }

    // se passou nas validações → cria a viagem
    const novaViagem = await Viagem.create({
      cidadeconsulID,
      data_viagem,
      horario_saida,
      veiculoID,
      motoristaID,
      statusID: 1,
    });

    if (solicitacaoID) {
      const solicitacao = await Solicitacao.findByPk(solicitacaoID);
      if (solicitacao) {
        await Participante.create({
          usuarioID: solicitacao.usuarioID,
          viagemID: novaViagem.cod,
          local_consul: solicitacao.local_consul,
          hora_consul: solicitacao.hora_consul,
          encaminhamento: solicitacao.encaminhamento,
          objetivo: solicitacao.objetivo,
          obs: solicitacao.obs,
          acompanhanteID: solicitacao.acompanhanteID,
        });
        await solicitacao.destroy();
      }
    }

    res.redirect("/admin/viagens/index");
  } catch (erro) {
    console.error("Erro ao cadastrar viagem:", erro);
    res.status(500).send("Erro ao cadastrar viagem: " + erro);
  }
};

exports.renderVerViagem = async (req, res) => {
  const cod = req.params.cod;
  const viagem = await Viagem.findOne({
    where: { cod },
    include: [
      { model: Motorista, as: "Motorista" },
      { model: Status },
      { model: CidadeConsul },
      { model: Veiculo, as: "veiculo" },
    ],
  });

  res.render("admin/viagens/ver-viagem", {
    viagem,
    layout: "layouts/layoutAdmin",
    paginaAtual: "viagens",
  });
};

exports.editarViagem = async (req, res) => {
  try {
    const cod = req.params.cod;

    const viagem = await Viagem.findOne({
      where: { cod },
      include: [
        { model: Motorista, as: "Motorista" },
        { model: Status },
        { model: CidadeConsul, as: "cidadeconsul" },
        { model: Veiculo, as: "veiculo" },
      ],
    });

    const motoristas = await Motorista.findAll();
    const statusLista = await Status.findAll();
    const cidades = await CidadeConsul.findAll();
    const veiculos = await Veiculo.findAll();

    const previousPage = req.get("Referer") || "/admin/viagens/index";

    res.render("admin/viagens/editar", {
      viagem,
      motoristas,
      statusLista,
      cidades,
      veiculos,
      previousPage,
      layout: "layouts/layoutAdmin",
      paginaAtual: "viagens",
    });
  } catch (erro) {
    console.error(erro);
    res.status(500).send("Erro ao carregar edição da viagem: " + erro);
  }
};

exports.salvarEdicaoViagem = async (req, res) => {
  try {
    const cod = req.params.cod;

    const viagem = await Viagem.findByPk(cod);
    if (!viagem) {
      return res.status(404).send("Viagem não encontrada");
    }

    await Viagem.update(
      {
        cidadeconsulID: req.body.cidadeconsulID,
        data_viagem: req.body.data_viagem,
        horario_saida: req.body.horario_saida,
        veiculoID: req.body.veiculoID,
        motoristaID: req.body.motoristaID,
        statusID: req.body.statusID,
        combustivel: req.body.combustivel,
        km_inicial: req.body.km_inicial,
        km_final: req.body.km_final,
        paradas: req.body.paradas,
        horario_chega: req.body.horario_chega,
        obs: req.body.obs,
      },
      {
        where: { cod },
      }
    );

    const redirectTo = req.body.previousPage || "/admin/viagens/index";
    res.redirect(redirectTo);
  } catch (erro) {
    console.error(erro);
    res.status(500).send("Erro ao salvar edição da viagem: " + erro);
  }
};

exports.cancelarViagem = async (req, res) => {
  const cod = req.params.cod;

  await Viagem.update({ statusID: 2 }, { where: { cod: cod } });

  const previousPage = req.get("Referer") || "/admin/viagens/index";
  res.redirect(previousPage);
};

exports.verParticipantes = async (req, res) => {
  try {
    const cod = req.params.cod;

    const viagem = await Viagem.findOne({
      where: { cod },
      include: [
        { model: Veiculo,
          as: "veiculo"
        },
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

    res.render("admin/viagens/participantes", {
      ocupacao,
      viagem,
      participantes: viagem.participantes, // agora vem da tabela Participante
      layout: "layouts/layoutAdmin",
      paginaAtual: "viagens",
    });
  } catch (error) {
    console.error("Erro ao buscar participantes:", error);
    res.status(500).send("Erro ao buscar participantes da viagem");
  }
};

exports.adicionarParticipante = async (req, res) => {
  const cod = req.params.cod;

  try {
    // Busca a viagem e os participantes já vinculados
    const viagem = await Viagem.findOne({
      where: { cod },
      include: [{ model: Participante, as: "participantes", required: false }],
    });

    if (!viagem) {
      return res.status(404).send("Viagem não encontrada");
    }

    // Pega os IDs de usuários que já são participantes dessa viagem
    const codUsuariosVinculados = viagem.participantes
      ? viagem.participantes.map((p) => p.usuarioID)
      : [];

    // Busca todos os usuários que não estão vinculados a essa viagem
    const usuariosNaoVinculados = await Usuario.findAll({
      where: {
        cod: {
          [Op.notIn]: codUsuariosVinculados.length
            ? codUsuariosVinculados
            : [0],
        },
      },
      include: [{ model: Endereco }, { model: Genero }],
      order: [["cod", "DESC"]],
    });

    res.render("admin/viagens/adicionar-participante", {
      cod,
      posts: usuariosNaoVinculados,
      layout: "layouts/layoutAdmin",
      paginaAtual: "viagens",
    });
  } catch (error) {
    console.error("Erro ao carregar participantes:", error);
    res.status(500).send("Erro ao carregar participantes");
  }
};

exports.formularioParticipante = async (req, res) => {
  const { cod } = req.params;
  const { usuarioSelecionado } = req.query;

  const usuario = await Usuario.findOne({
    where: { cod: usuarioSelecionado },
    include: [Genero, Endereco],
  });

  const viagem = await Viagem.findOne({
    where: { cod },
    include: [
      {
        model: Participante,
        as: "participantes",
        include: [
          {
            model: Acompanhante,
            as: "acompanhante",
          },
        ],
      },
      {
        model: Veiculo,
        as: "veiculo",
      },
    ],
  });

  // calcula ocupação
  const qtdParticipantes = viagem.participantes.length;
  const qtdAcompanhantes = viagem.participantes.reduce(
    (soma, p) => soma + (p.acompanhante ? 1 : 0),
    0
  );

  const ocupacao = qtdParticipantes + qtdAcompanhantes;

  res.render("admin/viagens/formulario-participante", {
    viagem,
    ocupacao,
    cod,
    usuario,
    layout: "layouts/layoutAdmin",
    paginaAtual: "viagens",
  });
};

exports.vincularUsuario = async (req, res) => {
  try {
    const cod = req.params.cod; // viagemID
    const usuarioID = req.body.usuarioID; // vem do input hidden

    const {
      local_consul,
      hora_consul,
      encaminhamento,
      objetivo,
      obs,
      temAcompanhante,
      nome,
      cpf,
      data_nasc,
      generoID,
      telefone,
    } = req.body;

    if (!usuarioID) {
      return res.status(400).send("Nenhum usuário selecionado");
    }

    let acompanhanteID = null;

    // pega a foto do acompanhante (se foi enviada)
    let fotoAcomp = null;
    if (
      req.files &&
      req.files["foto_acompanhante"] &&
      req.files["foto_acompanhante"][0]
    ) {
      fotoAcomp = req.files["foto_acompanhante"][0].filename;
    }

    // Se usuário marcou "Sim" no campo acompanhante
    if (temAcompanhante === "sim") {
      const novoAcomp = await Acompanhante.create({
        img: fotoAcomp, // salva o nome do arquivo no banco
        nome,
        cpf,
        data_nasc,
        generoID,
        telefone,
      });

      acompanhanteID = novoAcomp.cod; // pega a PK criada
    }

    // pega o arquivo de encaminhamento (se foi enviado)
    let encaminhamentoFile = encaminhamento;
    if (
      req.files &&
      req.files["encaminhamento"] &&
      req.files["encaminhamento"][0]
    ) {
      encaminhamentoFile = req.files["encaminhamento"][0].filename;
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
      statusID: 1,
    });

    res.redirect(`/admin/viagens/participantes/${cod}`);
  } catch (error) {
    console.error("Erro ao vincular usuário:", error);
    res.status(500).send("Erro ao vincular usuário à viagem");
  }
};

exports.renderViagensLista = async (req, res) => {
  const viagens = await Viagem.findAll({
    include: [
      { model: Motorista, as: "Motorista" },
      { model: Status },
      { model: CidadeConsul, as: "cidadeconsul" },
      { model: Veiculo, as: "veiculo" },
      {
        model: Participante,
        as: "participantes", // plural para bater com o atributo no loop
      },
    ],
  });

  const viagensComOcupacao = viagens.map((v) => {
    const qtdParticipantes = v.participantes.length;
    const qtdAcompanhantes = v.participantes.reduce(
      (soma, p) => soma + (p.acompanhanteID ? 1 : 0),
      0
    );

    return {
      ...v.toJSON(), // transforma em objeto plano
      ocupacao: qtdParticipantes + qtdAcompanhantes,
    };
  });

  res.render("admin/viagens/lista", {
    viagens: viagensComOcupacao,
    layout: "layouts/layoutAdmin",
    paginaAtual: "viagens",
  });
};

exports.renderSolicitacoes = async (req, res) => {
  const solicitacoes = await Solicitacao.findAll({
    include: [{ model: CidadeConsul }, { model: Usuario }],
  });
  try {
    res.render("admin/solicitacoes/index", {
      layout: "layouts/layoutAdmin",
      paginaAtual: "solicitacoes",
      solicitacoes,
    });
  } catch (erro) {
    console.error(erro);
    res.status(500).send("Erro ao carregar solicitações");
  }
};
