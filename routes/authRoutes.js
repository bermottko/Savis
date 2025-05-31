
var express = require('express');
var router = express.Router();
//Models
const Usuarios = require('../models/Usuarios');
const Endereco = require('../models/Endereco');

router.get('/entrada', (req, res) => {
    res.render('auth/entrada', {layout: 'layouts/layoutAuth'});  
});

router.get('/cadastro', (req, res) => {
    res.render('auth/cadastro', {layout: 'layouts/layoutAuth'});  
});

router.get('/cadastro-sucesso', (req, res) => {
    res.render('auth/cadastro-sucesso');  
});

router.post('/add-usuario', async (req, res) => {
    try {
        //Cria o endereço
        const enderecoCriado = await Endereco.create({
            rua: req.body.rua,
            numero: req.body.numero,
            bairro: req.body.bairro,
            cidade: req.body.cidade,
            UF: req.body.uf,
            CEP: req.body.cep
        });

        //Pega o codigo do endereço
        const enderecoID = enderecoCriado.cod;

        //Cria o usuário
        await Usuarios.create({
            nome: req.body.nome,
            data_nasc: req.body.data_nasc,
            CPF: req.body.CPF,
            generoID: req.body.genero,  
            email: req.body.email,
            fone: req.body.fone,
            enderecoID: enderecoID,
            SUS: req.body.SUS,
            senha: req.body.senha,
        });

        res.send('Usuário criado com sucesso!');
    } catch (erro) {
        console.error(erro);
        res.status(500).send('Erro ao criar usuário: ' + erro);
    }
})

module.exports = router;
