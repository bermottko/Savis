const Usuario = require('../models/Usuario');
const Endereco = require('../models/Endereco');

exports.renderEntrada = (req, res) => {
    res.render('auth/entrada', { layout: 'layouts/layoutAuth' });
};

exports.renderCadastro = (req, res) => {
    res.render('auth/cadastro', { layout: 'layouts/layoutAuth' });
};

exports.renderCadastroSucesso = (req, res) => {
    res.render('auth/cadastro-sucesso', {layout: 'layouts/layoutAuth'});
};

exports.cadastrarUsuario = async (req, res) => {
    try {
        // Criação do endereço
        const enderecoCriado = await Endereco.create({
            rua: req.body.rua,
            numero: req.body.numero,
            bairro: req.body.bairro,
            cidade: req.body.cidade,
            UF: req.body.uf,
            CEP: req.body.cep
        });

        const enderecoID = enderecoCriado.cod;

        // Criação do usuário
        await Usuario.create({
            img: req.file ? req.file.filename : null,
            nome: req.body.nome,
            data_nasc: req.body.data_nasc,
            CPF: req.body.CPF,
            generoID: req.body.genero,
            email: req.body.email,
            fone: req.body.fone,
            enderecoID: enderecoID,
            SUS: req.body.SUS,
            senha: req.body.senha
        });

        res.redirect('/auth/cadastro-sucesso');
    } catch (erro) {
        console.error(erro);
        res.status(500).send('Erro ao cadastrar: ' + erro);
    }
};
