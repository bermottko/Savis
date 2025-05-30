const Post = require('../models/Post');

var express = require('express');
var router = express.Router();

router.get('/usuarios', (req, res) => {
    Post.findAll().then(function(posts){                  //atualmente é findAll e não só all

    res.render('admin/usuarios', {posts: posts, layout: 'layouts/layoutAdmin'});  
    })
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