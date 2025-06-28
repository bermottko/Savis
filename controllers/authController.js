const Usuario = require('../models/Usuario');
const Endereco = require('../models/Endereco');

exports.renderEntrada = (req, res) => {
  res.render('auth/entrada', { layout: 'layouts/layoutAuth' });
};

exports.renderCadastro = (req, res) => {
  res.render('auth/cadastro', { 
    layout: 'layouts/layoutAuth', 
    erroCPF: null,
    erroSUS: null,
    preenchido: {}
  });
};

exports.renderCadastroSucesso = (req, res) => {
  res.render('auth/cadastro-sucesso', { layout: 'layouts/layoutAuth' });
};

exports.cadastrarUsuario = async (req, res) => {
  try {
    const cpfVerificando = req.body.CPF.replace(/\D/g, '');
    const susVerificando = req.body.SUS.replace(/\D/g, '');

    const cpfExistente = await Usuario.findOne({ where: { CPF: cpfVerificando } });
    const susExistente = await Usuario.findOne({ where: { SUS: susVerificando } });

    const erros = {
      erroCPF: null,
      erroSUS: null,
    };

    if (cpfExistente) erros.erroCPF = 'CPF já cadastrado.';
    else if (cpfVerificando.length !== 11) erros.erroCPF = 'CPF inválido.';

    if (susExistente) erros.erroSUS = 'Número do SUS já cadastrado.';
    else if (susVerificando.length !== 15) erros.erroSUS = 'Número do SUS inválido.';

    // Verifica se tem algum erro com valor (não null, não vazio)
    const temErro = Object.values(erros).some(erro => erro && erro.length > 0);

    if (temErro) {
      return res.render('auth/cadastro', {
        layout: 'layouts/layoutAuth',
        ...erros,
        preenchido: req.body
      });
    }

    // Criação do endereço
    const enderecoCriado = await Endereco.create({
      rua: req.body.rua,
      numero: req.body.numero,
      bairro: req.body.bairro,
      cidade: req.body.cidade,
      UF: req.body.uf,
      CEP: req.body.cep
    });

    // Criação do usuário
    await Usuario.create({
      img: req.file ? req.file.filename : null,
      nome: req.body.nome,
      data_nasc: req.body.data_nasc,
      CPF: req.body.CPF,
      generoID: req.body.genero,
      email: req.body.email,
      fone: req.body.fone,
      enderecoID: enderecoCriado.cod,
      SUS: req.body.SUS,
      senha: req.body.senha
    });

    // Sucesso
    res.redirect('/auth/cadastro-sucesso');

  } catch (erro) {
    console.error(erro);
    res.status(500).send('Erro ao cadastrar: ' + erro);
  }
};
