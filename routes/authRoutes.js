
var express = require('express');
var router = express.Router();

router.get('/entrada', (req, res) => {
    res.render('auth/entrada', {layout: 'layouts/layoutAuth'});  
});

router.get('/cadastro', (req, res) => {
    res.render('auth/cadastro', {layout: 'layouts/layoutAuth'});  
});

router.get('/cadastro-sucesso', (req, res) => {
    res.render('auth/cadastro-sucesso');  
});

module.exports = router;
