const { Usuario, Endereco, Genero } = require('../models');
const { Op } = require('sequelize'); 

exports.renderUsuarios = (req, res) => {
    Usuario.findAll({
        include: [
            { model: Endereco },
            { model: Genero }
        ]
    })
    .then(function (posts) {
        posts.sort((a, b) => b.cod - a.cod);
        res.render('admin/usuarios/index', {
            posts: posts,
            layout: 'layouts/layoutAdmin',
            paginaAtual: 'usuarios'
        });
    })
    .catch(function (erro) {
        console.error(erro);
        res.status(500).send('Erro ao buscar usuários: ' + erro);
    });
};

exports.buscarUsuarios = async (req, res) => {
    try {
        const termo = req.query.q || '';  // pega o termo da URL: ?q=mar
        const usuarios = await Usuario.findAll({
            where: {
                nome: {
                    [Op.like]: `%${termo}%`   // busca nome contendo o termo
                }
            },
        }); 

        res.json(usuarios);  // retorna a lista em JSON
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
    const cod = req.params.cod;

    try {
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
            usuario: usuario,
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

    // Busca o usuário para pegar o enderecoID
    const usuario = await Usuario.findByPk(cod);

    if (!usuario) {
      return res.status(404).send('Usuário não encontrado');
    }

    // Atualiza o endereço (assumindo que sempre existe)
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

    // Atualiza o usuário
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


exports.renderMotoristas = (req, res) => {
    res.render('admin/motoristas', {
        layout: 'layouts/layoutAdmin',
        paginaAtual: 'motoristas'
    });
};

exports.renderSolicitacoes = (req, res) => {
    res.render('admin/solicitacoes', {
        layout: 'layouts/layoutAdmin',
        paginaAtual: 'solicitacoes'
    });
};

exports.renderViagens = (req, res) => {
    res.render('admin/viagens', {
        layout: 'layouts/layoutAdmin',
        paginaAtual: 'viagens'
    });
};
