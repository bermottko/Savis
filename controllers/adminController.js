const { Usuario, Endereco, Genero, Motorista, Documento } = require('../models');
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


/*exports.renderMotoristas = (req, res) => {
    res.render('admin/motoristas/index', {
        layout: 'layouts/layoutAdmin',
        paginaAtual: 'motoristas'
    });
};*/

// Renderizar lista motoristas ódio
exports.renderMotoristas = (req, res) => {
  Motorista.findAll({
    include: [
      { model: Endereco },
      { model: Genero }
    ]
  })
  .then(function(motoristas) {
    motoristas.sort((a, b) => b.cod - a.cod);
    res.render('admin/motoristas/index', {
      posts: motoristas,
      layout: 'layouts/layoutAdmin',
      paginaAtual: 'motoristas'
    });
  })
  .catch(function(erro) {
    console.error(erro);
    res.status(500).send('Erro ao buscar motoristas: ' + erro);
  });
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

// Deletar motorista
exports.deletarMotoristas = async (req, res) => {
  try {
    const { cod } = req.params;
    const motorista = await Motorista.findByPk(cod);
    if (!motorista) return res.status(404).send('Motorista não encontrado');
    await motorista.destroy();
    res.redirect('/admin/motoristas/index');
  } catch (error) {
    console.error('Erro ao deletar motorista:', error);
    res.status(500).send('Erro interno no servidor');
  }
};

// Editar motorista - renderizar formulário de edição
exports.editarMotorista = async (req, res) => {
  const cod = req.params.cod;
  try {
    const motorista = await Motorista.findOne({
      where: { cod },
      include: [
        { model: Endereco },
        { model: Genero }
      ]
    });
    if (!motorista) return res.status(404).send('Motorista não encontrado');

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

// Salvar edição motorista
exports.salvarEdicaoMotorista = async (req, res) => {
  try {
    const cod = req.params.cod;
    const motorista = await Motorista.findByPk(cod);
    if (!motorista) return res.status(404).send('Motorista não encontrado');

    const foneLimpo = req.body.fone.replace(/\D/g, '');

    // Atualiza endereço
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

    // Atualiza motorista
    await Motorista.update({
      img: req.file ? req.file.filename : motorista.img,
      nome: req.body.nome,
      data_nasc: req.body.data_nasc,
      CPF: req.body.CPF,
      generoID: req.body.genero,
      email: req.body.email,
      fone: foneLimpo
      // docsID e senha ficaram como estão, pois geralmente não se edita aqui
    }, {
      where: { cod }
    });

    res.redirect('/admin/motoristas/index');
  } catch (erro) {
    console.error(erro);
    res.status(500).send('Erro ao salvar edição: ' + erro);
  }
};

exports.renderSolicitacoes = (req, res) => {
    res.render('admin/solicitacoes/index', {
        layout: 'layouts/layoutAdmin',
        paginaAtual: 'solicitacoes'
    });
};

exports.renderViagens = (req, res) => {
    res.render('admin/viagens/index', {
        layout: 'layouts/layoutAdmin',
        paginaAtual: 'viagens'
    });
};

exports.renderNovaViagem = (req,res) => {
    const dataSelecionada = req.query.data_viagem || ''; 

    res.render('admin/viagens/nova-viagem', {
        layout: 'layouts/layoutAdmin',
        paginaAtual: 'viagens',
        dataSelecionada
    });
};
