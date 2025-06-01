const { Usuarios, Endereco, Genero } = require('../models');

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
