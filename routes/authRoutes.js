const Post = require('../models/Post');

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

router.post('/add', (req, res) => {
   Post.create({
    nome: req.body.nome,
    CPF: req.body.CPF
}). then(function(){
    res.redirect('/auth/cadastro-sucesso')
}). catch(function(erro){
    res.send("Não foi cadastrado " + erro)
})
});

module.exports = router;
