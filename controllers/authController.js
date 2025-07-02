const Usuario = require('../models/Usuario');
const Endereco = require('../models/Endereco');
const Motorista = require('../models/Motorista');
const Documento = require('../models/Documento');

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
    const foneVerificando = req.body.fone.replace(/\D/g, '');

    const cpfExistente = await Usuario.findOne({ where: { CPF: cpfVerificando } });
    const susExistente = await Usuario.findOne({ where: { SUS: susVerificando } });

    const erros = {
      erroCPF: null,
      erroSUS: null,
      erroFone: null,
    };

    if (cpfExistente) erros.erroCPF = 'CPF já cadastrado.';
    else if (cpfVerificando.length !== 11) erros.erroCPF = 'CPF inválido.';

    if (susExistente) erros.erroSUS = 'Número do SUS já cadastrado.';
    else if (susVerificando.length !== 15) erros.erroSUS = 'Número do SUS inválido.';

    if (foneVerificando.length < 11) erros.erroFone = 'Telefone inválido. Deve conter 11 dígitos.';

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
      CPF: cpfVerificando,
      generoID: req.body.genero,
      email: req.body.email,
      fone: foneVerificando,
      enderecoID: enderecoCriado.cod,
      SUS: susVerificando,
      senha: req.body.senha
    });

    // Sucesso
    res.redirect('/auth/cadastro-sucesso');

  } catch (erro) {
    console.error(erro);
    res.status(500).send('Erro ao cadastrar: ' + erro);
  }
};

exports.renderCadastroMotorista = (req, res) => {
  res.render('auth/cadastro-motorista', {
    layout: 'layouts/layoutAuth',
    erroCPF: null,
    erroMatricula: null,
    preenchido: {},
    erroFone: null
  });
};

exports.cadastrarMotorista = async (req, res) => {
  try {
    const cpfVerificando = req.body.CPF.replace(/\D/g, '');
    const matriculaVerificando = req.body.matricula.replace(/\D/g, '');
    const foneVerificando = req.body.fone.replace(/\D/g, ''); 

    const cpfExistente = await Motorista.findOne({ where: { CPF: cpfVerificando } });
    const matriculaExistente = await Motorista.findOne({ where: { matricula: matriculaVerificando } });

    const erros = {
      erroCPF: null,
      erroMatricula: null,
      erroFone: null,
    };

    if (cpfExistente) erros.erroCPF = 'CPF já cadastrado.';
    else if (cpfVerificando.length !== 11) erros.erroCPF = 'CPF inválido.';

    if (matriculaExistente) erros.erroMatricula = 'Matrícula já cadastrada.';
    else if (!/^\d{4}$/.test(matriculaVerificando)) erros.erroMatricula = 'Matrícula inválida. Deve conter exatamente 4 dígitos.';

    if (foneVerificando.length < 11) erros.erroFone = 'Telefone inválido. Deve conter 11 dígitos.';

    const temErro = Object.values(erros).some(erro => erro);

    if (temErro) {
      return res.render('auth/cadastro-motorista', {
        layout: 'layouts/layoutAuth',
        ...erros,
        preenchido: req.body
      });
    }

    const enderecoCriado = await Endereco.create({
      rua: req.body.rua,
      numero: req.body.numero,
      bairro: req.body.bairro,
      cidade: req.body.cidade,
      UF: req.body.uf,
      CEP: req.body.cep
    });

    const docsCriado = await Documento.create({});

    await Motorista.create({
      img: req.file ? req.file.filename : null,
      nome: req.body.nome,
      data_nasc: req.body.data_nasc,
      CPF: cpfVerificando,
      fone: foneVerificando,
      email: req.body.email,
      generoID: req.body.genero,
      enderecoID: enderecoCriado.cod,
      docsID: docsCriado.cod,
      senha: req.body.senha,
      matricula: matriculaVerificando
    });

    res.redirect('/admin/motoristas/index');

  } catch (erro) {
    console.error(erro);
    res.status(500).send('Erro ao cadastrar motorista: ' + erro);
  }
};