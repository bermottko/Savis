var express = require('express');
var router = express.Router();

router.get('/usuarios', (req, res) => {
    res.render('admin/usuarios', {layout: 'layouts/layoutAdmin'});  
});

router.get('/motoristas', (req, res) => {
    res.render('admin/motoristas', {layout: 'layouts/layoutAdmin'});  
})

router.get('/solicitacoes', (req, res) => {
    res.render('admin/solicitacoes', {layout: 'layouts/layoutAdmin'});  
})

router.get('/viagens', (req, res) => {
    res.render('admin/viagens',  {layout: 'layouts/layoutAdmin'});  
})

module.exports = router;