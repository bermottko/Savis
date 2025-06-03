const { Usuarios, Endereco, Genero } = require('../models');
const { Op } = require('sequelize'); 

exports.renderUsuarios = (req, res) => {
    Usuarios.findAll({
        include: [
            { model: Endereco },
            { model: Genero }
        ]
    })
    .then(function (posts) {
        res.render('admin/usuarios', {
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

        const usuarios = await Usuarios.findAll({
            where: {
                nome: {
                    [Op.like]: `%${termo}%`   // busca nome contendo o termo
                }
            },
            include: [
                { model: Endereco },
                { model: Genero }
            ]
        });

        res.json(usuarios);  // retorna a lista em JSON
    } catch (erro) {
        console.error(erro);
        res.status(500).json({ erro: 'Erro ao buscar usuários' });
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
