const { Usuario, Endereco, Genero, Motorista, Documento, Viagem, Status, CidadeConsul, Solicitacao, Acompanhante, Participante } = require('../models');
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
      paginaAtual: 'usuarios'
    });
  } catch (erro) {
    console.error(erro);
    res.status(500).send('Erro ao carregar usuário para edição');
  }
};

exports.salvarEdicaoUsuario = async (req, res) => {
  try {
    const cod = req.params.cod;
    const usuario = await Usuario.findByPk(cod);
    if (!usuario) {
      return res.status(404).send('Usuário não encontrado');
    }
    await Endereco.update({
      rua: req.body.rua,
      numero: req.body.numero,
      bairro: req.body.bairro,
      cidade: req.body.cidade,
      UF: req.body.uf,
      CEP: req.body.cep
    }, {
      where: { cod: usuario.enderecoID }
    });
    await Usuario.update({
      img: req.file ? req.file.filename : usuario.img,
      nome: req.body.nome,
      data_nasc: req.body.data_nasc,
      CPF: req.body.CPF,
      generoID: req.body.genero,
      email: req.body.email,
      fone: req.body.fone,
      SUS: req.body.SUS
    }, {
      where: { cod }
    });
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
      paginaAtual: 'motoristas'
    });
  } catch (erro) {
    console.error(erro);
    res.status(500).send('Erro ao carregar motorista para edição');
  }
};

exports.salvarEdicaoMotorista = async (req, res) => {
  try {
    const cod = req.params.cod;
    const motorista = await Motorista.findByPk(cod);
    if (!motorista) {
      return res.status(404).send('Motorista não encontrado');
    }

    const cpfVerificando = req.body.CPF.replace(/\D/g, '');
    const foneVerificando = req.body.fone.replace(/\D/g, '');

    await Endereco.update({
      rua: req.body.rua,
      numero: req.body.numero,
      bairro: req.body.bairro,
      cidade: req.body.cidade,
      UF: req.body.uf,
      CEP: req.body.cep
    }, {
      where: { cod: motorista.enderecoID }
    });

    await Motorista.update({
      img: req.file ? req.file.filename : motorista.img,
      nome: req.body.nome,
      data_nasc: req.body.data_nasc,
      CPF: cpfVerificando,
      generoID: req.body.genero,
      email: req.body.email,
      fone: foneVerificando,
      // docsID e senha não alterados
    }, {
      where: { cod }
    });

    if (req.files) {
      const camposDocumentos = [
        'carteira_trab',
        'cursos',
        'habilitacao',
        'comprov_resid',
        'comprov_escola',
        'titulo_eleitor',
        'ant_crim',
        'exame_tox'
      ];

      const novosDados = {};

      camposDocumentos.forEach((campo) => {
        if (req.files[campo]) {
          novosDados[campo] = req.files[campo][0].filename;
        }
      });

      if (Object.keys(novosDados).length > 0 && motorista.docsID) {
        await Documento.update(novosDados, {
          where: { cod: motorista.docsID }
        });
      }
    }


    res.redirect('/admin/motoristas/index');
  } catch (erro) {
    console.error(erro);
    res.status(500).send('Erro ao salvar edição: ' + erro);
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
          model: Participante,
          as: 'participantes',
          include: [
            {
              model: Usuario,
              include: [
                { model: Genero },
                { model: Endereco }
              ]
            }
          ]
        }
      ]
    });

    if (!viagem) {
      return res.status(404).send('Viagem não encontrada');
    }

    res.render('admin/viagens/participantes', {
      viagem,
      participantes: viagem.participantes, // agora vem da tabela Participante
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
    // Busca a viagem e os participantes já vinculados
    const viagem = await Viagem.findOne({
      where: { cod },
      include: [{ model: Participante, required: false }]
    });

    if (!viagem) {
      return res.status(404).send('Viagem não encontrada');
    }

    // Pega os IDs de usuários que já são participantes dessa viagem
    const codUsuariosVinculados = viagem.Participantes ? viagem.Participantes.map(p => p.usuarioID) : [];

    // Busca todos os usuários que não estão vinculados a essa viagem
    const usuariosNaoVinculados = await Usuario.findAll({
      where: {
        cod: {
          [Op.notIn]: codUsuariosVinculados.length ? codUsuariosVinculados : [0]
        }
      },
      include: [
        { model: Endereco },
        { model: Genero }
      ],
      order: [['cod', 'DESC']]
    });

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

exports.formularioParticipante = async (req, res) => {
  const { cod } = req.params;
  const { usuarioSelecionado } = req.query; // recebe o usuário escolhido

  // Busca os dados do usuário para exibir no formulário
  const usuario = await Usuario.findOne({
    where: { cod: usuarioSelecionado },
    include: [Genero, Endereco]
  });

  res.render('admin/viagens/formulario-participante', { 
    cod,
    usuario, // envia para a view
    layout: 'layouts/layoutAdmin',
    paginaAtual: 'viagens'
  });
};

exports.vincularUsuario = async (req, res) => {
  console.log('req.params.cod:', req.params.cod);
 console.log('req.body:', req.body);
  try {
    
    const cod = req.params.cod;
    const usuarioID = req.body.usuarioID; // <-- pega do input hidden
    const { local_consul, data_consul, hora_consul, encaminhamento, objetivo, obs, acompanhanteID } = req.body;

    if (!usuarioID) {
      return res.status(400).send('Nenhum usuário selecionado');
    }

    await Participante.create({
      usuarioID,
      viagemID: cod,
      local_consul,
      data_consul,
      hora_consul,
      encaminhamento: req.file ? req.file.filename : encaminhamento, // arquivo enviado via multer
      objetivo,
      obs: obs || null,
      acompanhanteID: acompanhanteID || null,
      statusID: 1
    });

    res.redirect(`/admin/viagens/participantes/${cod}`);

  } catch (error) {
    console.error('Erro ao vincular usuário:', error);
    res.status(500).send('Erro ao vincular usuário à viagem');
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
 
exports.renderSolicitacoes = async (req, res) => {
    const solicitacoes = await Solicitacao.findAll({
      include: [{model: Usuario},
        {model: CidadeConsul},
        {model: Status },
        {model: Acompanhante}
      ]
    });
    res.render('admin/solicitacoes/index', {
      solicitacoes,
      layout: 'layouts/layoutAdmin',
      paginaAtual: 'solicitacoes'
    });
};