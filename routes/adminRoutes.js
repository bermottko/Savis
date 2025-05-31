var express = require('express'); 
var router = express.Router();

router.get('/usuarios', (req, res) => {
    res.render('admin/usuarios', {
        layout: 'layouts/layoutAdmin',
        paginaAtual: 'usuarios'
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
