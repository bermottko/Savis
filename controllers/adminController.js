const { Usuario, Endereco, Genero, Motorista, Documento, Viagem, Status, CidadeConsul } = require('../models');
const { Op } = require('sequelize');
const { Sequelize } = require('sequelize');

exports.renderUsuarios = async (req, res) => {
  try {
    const posts = await Usuario.findAll({
      include: [
        { model: Endereco },
        { model: Genero }
      ]
    });
    posts.sort((a, b) => b.cod - a.cod);
    res.render('admin/usuarios/index', {
      posts,
      layout: 'layouts/layoutAdmin',
      paginaAtual: 'usuarios'
    });
  } catch (erro) {
    console.error(erro);
    res.status(500).send('Erro ao buscar usuários: ' + erro);
  }
};

exports.buscarUsuarios = async (req, res) => {
  try {
    const termo = req.query.q || '';
    const usuarios = await Usuario.findAll({
      where: {
        nome: {
          [Op.like]: `%${termo}%`
        }
      },
    });
    res.json(usuarios);
  } catch (erro) {
    console.error(erro);
    res.status(500).json({ erro: 'Erro ao buscar usuários' });
  }
};

exports.deletarUsuarios = async (req, res) => {
  try {
    const { cod } = req.params;
    const usuario = await Usuario.findByPk(cod);
    if (!usuario) {
      return res.status(404).send('Usuário não encontrado');
    }
    await usuario.destroy();
    res.redirect('/admin/usuarios/index');
  } catch (error) {
    console.error('Erro ao deletar usuário:', error);
    res.status(500).send('Erro interno no servidor');
  }
};

// EDITAR USUÁRIO
exports.editarUsuario = async (req, res) => {
  try {
    const cod = req.params.cod;
    const usuario = await Usuario.findOne({
      where: { cod },
      include: [
        { model: Endereco },
        { model: Genero }
      ]
    });
    if (!usuario) {
      return res.status(404).send('Usuário não encontrado');
    }
    res.render('admin/usuarios/editar', {
      usuario,
      layout: 'layouts/layoutAdmin',
      paginaAtual: 'usuarios',
      erros: {},
      preenchido: {}
    });
  } catch (erro) {
    console.error(erro);
    res.status(500).send('Erro ao carregar usuário para edição');
  }
};

// SALVAR EDIÇÃO USUÁRIO
exports.salvarEdicaoUsuario = async (req, res) => {
  try {
    const cod = req.params.cod;
    const usuario = await Usuario.findByPk(cod, {
      include: [
        { model: Endereco },
        { model: Genero }
      ]
    });

    if (!usuario) return res.status(404).send('Usuário não encontrado');

    const { CPF, fone, cep, email, SUS } = req.body;
    let erros = {};
    let preenchido = req.body;

    // Validação CPF
    if (!CPF || CPF.replace(/\D/g, '').length !== 11) {
      erros.erroCPF = "CPF inválido. Deve conter 11 dígitos.";
    }

    // Validação Telefone
    if (!fone || fone.replace(/\D/g, '').length !== 11) {
      erros.erroFone = "Telefone inválido. Deve conter 11 dígitos.";
    }

    // Validação CEP
    if (!cep || cep.replace(/\D/g, '').length !== 8) {
      erros.erroCEP = "CEP inválido. Deve conter 8 dígitos.";
    }

    // Validação Email
    const regexEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email || !regexEmail.test(email)) {
      erros.erroEmail = "Digite um email válido.";
    }

    // Validação SUS (mínimo e máximo 15 dígitos)
    if (!SUS || SUS.replace(/\D/g, '').length !== 15) {
      erros.erroSUS = "Número do SUS inválido. Deve conter 15 dígitos.";
    }

    // Se houver erros, renderiza de volta com mensagens
    if (Object.keys(erros).length > 0) {
      return res.render("admin/usuarios/editar", {
        usuario,
        layout: "layouts/layoutAdmin",
        paginaAtual: "usuarios",
        erros,
        preenchido
      });
    }

    // Atualiza endereço
    await Endereco.update({
      rua: req.body.rua,
      numero: req.body.numero,
      bairro: req.body.bairro,
      cidade: req.body.cidade,
      UF: req.body.uf,
      CEP: req.body.cep.replace(/\D/g, '')
    }, { where: { cod: usuario.enderecoID } });

    // Atualiza dados do usuário
    const fotoPerfil = req.file ? req.file.filename : usuario.img;

    await Usuario.update({
      img: fotoPerfil,
      nome: req.body.nome,
      data_nasc: req.body.data_nasc,
      CPF: req.body.CPF.replace(/\D/g, ''),
      generoID: req.body.genero,
      email: req.body.email,
      fone: req.body.fone.replace(/\D/g, ''),
      SUS: req.body.SUS.replace(/\D/g, '')
    }, { where: { cod } });

    res.redirect('/admin/usuarios/index');
  } catch (erro) {
    console.error(erro);
    res.status(500).send('Erro ao salvar edição: ' + erro);
  }
};

exports.renderMotoristas = async (req, res) => {
  try {
    const motoristas = await Motorista.findAll({
      include: [
        { model: Endereco },
        { model: Genero },
        { model: Documento}
      ]
    });
    motoristas.sort((a, b) => b.cod - a.cod);
    res.render('admin/motoristas/index', {
      posts: motoristas,
      layout: 'layouts/layoutAdmin',
      paginaAtual: 'motoristas'
    });
  } catch (erro) {
    console.error(erro);
    res.status(500).send('Erro ao buscar motoristas: ' + erro);
  }
};

exports.buscarMotoristas = async (req, res) => {
  try {
    const termo = req.query.q || '';
    const motoristas = await Motorista.findAll({
      where: {
        nome: {
          [Op.like]: `%${termo}%`
        }
      },
      include: [
        { model: Endereco },
        { model: Genero }
      ]
    });
    res.json(motoristas);
  } catch (erro) {
    console.error(erro);
    res.status(500).json({ erro: 'Erro ao buscar motoristas' });
  }
};

exports.deletarMotoristas = async (req, res) => {
  try {
    const { cod } = req.params;
    const motorista = await Motorista.findByPk(cod);
    if (!motorista) {
      return res.status(404).send('Motorista não encontrado');
    }
    await motorista.destroy();
    res.redirect('/admin/motoristas/index');
  } catch (error) {
    console.error('Erro ao deletar motorista:', error);
    res.status(500).send('Erro interno no servidor');
  }
};

exports.editarMotorista = async (req, res) => {
  try {
    const cod = req.params.cod;
    const motorista = await Motorista.findOne({
      where: { cod },
      include: [
        { model: Endereco },
        { model: Genero }
      ]
    });
    if (!motorista) {
      return res.status(404).send('Motorista não encontrado');
    }
    res.render('admin/motoristas/editar', {
      usuario: motorista,
      layout: 'layouts/layoutAdmin',
      paginaAtual: 'motoristas',
      erros: {},
      preenchido: {} 
    });
  } catch (erro) {
    console.error(erro);
    res.status(500).send('Erro ao carregar motorista para edição');
  }
};

exports.salvarEdicaoMotorista = async (req, res) => {
  try {
    console.log(req.files);

    const cod = req.params.cod;
    const motorista = await Motorista.findByPk(cod, {
      include: [
        { model: Endereco },
        { model: Genero },
        { model: Documento }
      ]
    });

    if (!motorista) return res.status(404).send('Motorista não encontrado');

    const { CPF, fone, cep, email } = req.body;
        let erros = {};
        let preenchido = req.body;

    // validação CPF
    if (!CPF || CPF.replace(/\D/g, '').length !== 11) {
      erros.erroCPF = "CPF inválido. Deve conter 11 dígitos.";
    }

    // validação Telefone
    if (!fone || fone.replace(/\D/g, '').length !== 11) {
      erros.erroFone = "Telefone inválido. Deve conter 11 dígitos.";
    }

    // validação CEP
    if (!cep || cep.replace(/\D/g, '').length !== 8) {
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
        preenchido
      });
    }

    // Atualiza endereço
    await Endereco.update({
      rua: req.body.rua,
      numero: req.body.numero,
      bairro: req.body.bairro,
      cidade: req.body.cidade,
      UF: req.body.uf,
      CEP: req.body.cep.replace(/\D/g, '')
    }, { where: { cod: motorista.enderecoID } });

    // Atualiza dados do motorista
    const fotoPerfil = req.files?.foto_perfil?.[0]?.filename || motorista.img;

    await Motorista.update({
      img: fotoPerfil,
      nome: req.body.nome,
      data_nasc: req.body.data_nasc,
      CPF: req.body.CPF.replace(/\D/g, ''),
      generoID: req.body.genero,
      email: req.body.email,
      fone: req.body.fone.replace(/\D/g, '')
    }, { where: { cod } });

    // Atualiza ou cria documentos
    const camposDocumentos = [
      'carteira_trab','cursos','habilitacao','comprov_resid',
      'comprov_escola','titulo_eleitor','ant_crim','exame_tox'
    ];

    if (!motorista.docsID && Object.keys(req.files || {}).length > 0) {
      // cria novo Documento
      const novoDoc = {};
      camposDocumentos.forEach(campo => {
        if (req.files[campo]) novoDoc[campo] = req.files[campo][0].filename;
      });
      const documentoCriado = await Documento.create(novoDoc);
      await Motorista.update({ docsID: documentoCriado.cod }, { where: { cod } });
    } else if (motorista.docsID && Object.keys(req.files || {}).length > 0) {
      // atualiza documento existente
      const novosDados = {};
      camposDocumentos.forEach(campo => {
        if (req.files[campo]) novosDados[campo] = req.files[campo][0].filename;
      });
      if (Object.keys(novosDados).length > 0) {
        await Documento.update(novosDados, { where: { cod: motorista.docsID } });
      }
    }

    res.redirect('/admin/motoristas/index'); 
  } catch (erro) {
    console.error(erro);
    res.status(500).send('Erro ao salvar edição: ' + erro);
  }
};


exports.renderSolicitacoes = async (req, res) => {
  try {
    res.render('admin/solicitacoes/index', {
      layout: 'layouts/layoutAdmin',
      paginaAtual: 'solicitacoes'
    });
  } catch (erro) {
    console.error(erro);
    res.status(500).send('Erro ao carregar solicitações');
  }
};

exports.renderViagens = (req, res) => {
    res.render('admin/viagens/index', {
      layout: 'layouts/layoutAdmin',
      paginaAtual: 'viagens',
    });
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
      url: `/admin/viagens/ver-viagem/${v.cod}`
    }));
    res.json(eventos);
}
 
exports.renderNovaViagem = async (req, res) => {
  try {
    const cidadeconsul = await CidadeConsul.findAll();
    const motoristas = await Motorista.findAll();
    const dataSelecionada = req.query.data_viagem || '';
    res.render('admin/viagens/nova-viagem', {
      layout: 'layouts/layoutAdmin',
      paginaAtual: 'viagens',
      dataSelecionada,
      motoristas,
      cidadeconsul
    });
  } catch (erro) {
    console.error(erro);
    res.status(500).send('Erro ao carregar motoristas: ' + erro);
  }
};

exports.renderCadastrarViagem = async (req, res) => {
  try {
    await Viagem.create({
      cidadeconsulID: req.body.cidadeconsulID,
      data_viagem: req.body.data_viagem,
      horario_saida: req.body.horario_saida,
      lugares_dispo: req.body.lugares_dispo,
      modelo_car: req.body.modelo_car,
      placa: req.body.placa,
      motoristaID: req.body.motoristaID,
      statusID: 1
    });
    res.redirect('/admin/viagens/index');
  } catch (erro) {
    console.error(erro);
    res.status(500).send('Erro ao cadastrar viagem: ' + erro);
  }
};

exports.renderVerViagem = async (req, res) => {
    const cod = req.params.cod;
    const viagem = await Viagem.findOne({
      where: { cod },
      include: [
        { model:  Motorista, as: 'Motorista' },
        { model: Status },
        { model: CidadeConsul }
      ]
    });

    res.render('admin/viagens/ver-viagem', {
      viagem,
      layout: 'layouts/layoutAdmin',
      paginaAtual: 'viagens'
    });
}

exports.editarViagem = async (req, res) => {
  try {
    const cod = req.params.cod;

    const viagem = await Viagem.findOne({
      where: { cod },
      include: [
        { model: Motorista, as: 'Motorista' },
        { model: Status }
      ]
    });

    const motoristas = await Motorista.findAll();
    const statusLista = await Status.findAll(); 

    res.render('admin/viagens/editar', {
      viagem,              
      motoristas,                   
      statusLista,                   
      layout: 'layouts/layoutAdmin',
      paginaAtual: 'viagens'
    });
  } catch (erro) {
    console.error(erro);
    res.status(500).send('Erro ao carregar edição da viagem: ' + erro);
  }
};


exports.salvarEdicaoViagem = async (req, res) => {
  try {
    const cod = req.params.cod;

    const viagem = await Viagem.findByPk(cod);
    if (!viagem) {
      return res.status(404).send('Viagem não encontrada');
    }

    await Viagem.update({
      destino_cid: req.body.destino_cid,
      data_viagem: req.body.data_viagem,
      horario_saida: req.body.horario_saida,
      lugares_dispo: req.body.lugares_dispo,
      modelo_car: req.body.modelo_car,
      placa: req.body.placa,
      motoristaID: req.body.motoristaID,
      statusID: req.body.statusID,
      combustivel: req.body.combustivel,
      km_inicial: req.body.km_inicial,
      km_final: req.body.km_final,
      paradas: req.body.paradas,
      horario_chega: req.body.horario_chega,
      obs: req.body.obs
    }, {
      where: { cod }
    });

    res.redirect('/admin/viagens/index');
  } catch (erro) {
    console.error(erro);
    res.status(500).send('Erro ao salvar edição da viagem: ' + erro);
  }
};

exports.cancelarViagem = async (req, res) => {
  const cod = req.params.cod;

  await Viagem.update(
      { statusID: 2 },          
      { where: { cod: cod } }    
  );

  res.redirect('/admin/viagens/index');
};

exports.verParticipantes = async (req, res) => {
  try {
    const cod = req.params.cod;

    const viagem = await Viagem.findOne({
      where: { cod },
      include: [
        {
          model: Usuario,
          include: [
           { model: Genero },
           { model: Endereco }
          ]
        }
      ]
    });

    if (!viagem) {
      return res.status(404).send('Viagem não encontrada');
    }

    res.render('admin/viagens/participantes', {
      viagem,
      participantes: viagem.Usuarios,
      layout: 'layouts/layoutAdmin',
      paginaAtual: 'viagens'
    });

  } catch (error) {
    console.error('Erro ao buscar participantes:', error);
    res.status(500).send('Erro ao buscar participantes da viagem');
  }
};


exports.adicionarParticipante = async (req, res) => {
  const cod = req.params.cod;

  try {
    const viagem = await Viagem.findOne({
      where: { cod },
      include: [{ model: Usuario }]
    });

    if (!viagem) {
      return res.status(404).send('Viagem não encontrada');
    }

    const codUsuariosVinculados = viagem.Usuarios.map(u => u.cod);

    const usuariosNaoVinculados = await Usuario.findAll({
      where: {
        cod: {
          [Sequelize.Op.notIn]: codUsuariosVinculados.length ? codUsuariosVinculados : [0]
        }
      },
      include: [
        { model: Endereco },
        { model: Genero }
      ]
    });

    usuariosNaoVinculados.sort((a, b) => b.cod - a.cod);

    res.render('admin/viagens/adicionar-participante', {
      cod,
      posts: usuariosNaoVinculados,
      layout: 'layouts/layoutAdmin',
      paginaAtual: 'viagens'
    });

  } catch (error) {
    console.error('Erro ao carregar participantes:', error);
    res.status(500).send('Erro ao carregar participantes');
  }
};


exports.vincularUsuario = async (req, res) => {
  try {
    const cod = req.params.cod; // código da viagem
    let usuariosSelecionados = req.body.usuariosSelecionados;

    if (!usuariosSelecionados) {
      return res.status(400).send('Nenhum usuário selecionado');
    }

    if (!Array.isArray(usuariosSelecionados)) {
      usuariosSelecionados = [usuariosSelecionados];
    }

    const viagem = await Viagem.findOne({ where: { cod } });
    if (!viagem) {
      return res.status(404).send('Viagem não encontrada');
    }

    const usuarios = await Usuario.findAll({
      where: {
        cod: usuariosSelecionados
      }
    });

    await viagem.addUsuarios(usuarios); 

    res.redirect(`/admin/viagens/participantes/${cod}`);

  } catch (error) {
    console.error('Erro ao vincular usuários:', error);
    res.status(500).send('Erro ao vincular usuários à viagem');
  }
};

exports.renderViagensLista = async (req, res) => {
    const viagens = await Viagem.findAll({
      include: [
        { model: Motorista, as: 'Motorista' },
        { model: Status }
      ]
    }); 
    res.render('admin/viagens/lista', {
      viagens,
      layout: 'layouts/layoutAdmin',
      paginaAtual: 'viagens'
    });
  }