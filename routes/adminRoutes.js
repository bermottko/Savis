var express = require('express'); 
var router = express.Router();
//Models
const { Usuarios, Endereco, Genero } = require('../models');

router.get('/usuarios', (req, res) => {
    Usuarios.findAll({
        include: [
            { model: Endereco },
            { model: Genero }
        ]
    }).then(function(posts){
        res.render('admin/usuarios', {
            posts: posts,
            layout: 'layouts/layoutAdmin',
            paginaAtual: 'usuarios'
        });
    }).catch(function(erro){
        console.error(erro);
        res.status(500).send('Erro ao buscar usuários: ' + erro);
    });
});

router.get('/motoristas', (req, res) => {
    res.render('admin/motoristas', {
        layout: 'layouts/layoutAdmin',
        paginaAtual: 'motoristas'
    });  
});

router.get('/solicitacoes', (req, res) => {
    res.render('admin/solicitacoes', {
        layout: 'layouts/layoutAdmin',
        paginaAtual: 'solicitacoes'
    });  
});

router.get('/viagens', (req, res) => {
    res.render('admin/viagens', {
        layout: 'layouts/layoutAdmin',
        paginaAtual: 'viagens'
    });  
});

module.exports = router;
