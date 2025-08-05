const { Usuario, Endereco, Genero, Motorista, Documento, Viagem, Status } = require('../models');
const { Op } = require('sequelize');

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
    const viagens = await Viagem.findAll();

    const eventos = viagens.map(v => ({
      title: v.destino_cid,
      start: v.data_viagem,
      url: `/admin/viagens/ver-viagem/${v.cod}`
    }));
    res.json(eventos);
}
 
exports.renderNovaViagem = async (req, res) => {
  try {
    const motoristas = await Motorista.findAll();
    const dataSelecionada = req.query.data_viagem || '';
    res.render('admin/viagens/nova-viagem', {
      layout: 'layouts/layoutAdmin',
      paginaAtual: 'viagens',
      dataSelecionada,
      motoristas
    });
  } catch (erro) {
    console.error(erro);
    res.status(500).send('Erro ao carregar motoristas: ' + erro);
  }
};

exports.renderCadastrarViagem = async (req, res) => {
  try {
    await Viagem.create({
      destino_cid: req.body.destino_cid,
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
        { model: Status }
      ]
    });

    res.render('admin/viagens/ver-viagem', {
      usuario: viagem,
      layout: 'layouts/layoutAdmin',
      paginaAtual: 'viagens'
    });
}