const bcrypt = require('bcrypt');

const { Usuario, Endereco, Chefe, Motorista, Documento} = require('../models');

exports.renderEntrada = (req, res) => {
  res.render('auth/entrada', { layout: 'layouts/layoutAuth' });
};

exports.verificarUsuario = async (req, res) => {
  const { cpf, matricula, senha } = req.body;

  try {
    let usuario;
    let redirectPath;

    if (cpf) {
      // Login por CPF: apenas usuário
      usuario = await Usuario.findOne({ where: { CPF: cpf } });
      if (!usuario) return res.send("CPF não encontrado");
      redirectPath = '/usuario/inicio/index';

      const senhaCorreta = await bcrypt.compare(senha, usuario.senha);
      if (!senhaCorreta) return res.send("Senha incorreta");

      req.session.usuario = { cod: usuario.cod, nome: usuario.nome };
      return res.redirect(redirectPath);

    } else if (matricula) {
      // Tenta login como motorista
      usuario = await Motorista.findOne({ where: { matricula } });
      if (usuario) {
        redirectPath = '/motorista/usuarios/index';

        const senhaCorreta = await bcrypt.compare(senha, usuario.senha);
        if (!senhaCorreta) return res.send("Senha incorreta");

        req.session.motorista = {
        cod: usuario.cod,
        nome: usuario.nome,
        email: usuario.email,
        foto: usuario.img,
        matricula: usuario.matricula
      };

      console.log("Motorista logado:", req.session.motorista); // debug
      return res.redirect(redirectPath);
      }

      // Tenta login como chefe (admin)
      usuario = await Chefe.findOne({ where: { matricula } });
      if (usuario) {
        redirectPath = '/admin/usuarios/index';

        const senhaCorreta = await bcrypt.compare(senha, usuario.senha);
        if (!senhaCorreta) return res.send("Senha incorreta");

        req.session.chefe = { cod: usuario.cod, nome: usuario.nome };
        return res.redirect(redirectPath);
      }

      return res.send("Matrícula não encontrada");

    } else {
      return res.send("Por favor, informe CPF ou Matrícula.");
    }

  } catch (err) {
    console.error(err);
    res.status(500).send("Erro no servidor");
  }
};

exports.renderCadastro = (req, res) => {
  res.render('auth/cadastro', {
    layout: 'layouts/layoutAuth',
    preenchido: req.body,
    erroCPF: null,
    erroEmail: null,
    erroFone: null,
    erroNumero: null,
    erroCEP: null,
    erroSUS: null
  });
};

exports.renderCadastroSucesso = (req, res) => {
  res.render('auth/cadastro-sucesso', { layout: 'layouts/layoutAuth' });
};

exports.cadastrarUsuario = async (req, res) => {
  try {
    const { numero = '', cep = '', CPF, SUS, fone, email } = req.body;

    const cpfVerificando = CPF.replace(/\D/g, '');
    const susVerificando = SUS.replace(/\D/g, '');
    const foneVerificando = fone.replace(/\D/g, '');

    const erros = {
      erroCPF: null,
      erroSUS: null,
      erroFone: null,
      erroEmail: null,
      erroNumero: null,
      erroCEP: null
    };

    if (!numero || numero.length > 4) erros.erroNumero = 'Número deve ter até 4 dígitos';
    if (!cep || cep.replace(/\D/g,'').length !== 8) erros.erroCEP = 'CEP deve ter exatamente 8 dígitos';

    const cpfExistente = await Usuario.findOne({ where: { CPF: cpfVerificando } });
    const susExistente = await Usuario.findOne({ where: { SUS: susVerificando } });

    if (cpfExistente) erros.erroCPF = 'CPF já cadastrado.';
    else if (cpfVerificando.length !== 11) erros.erroCPF = 'CPF inválido.';

    if (susExistente) erros.erroSUS = 'Número do SUS já cadastrado.';
    else if (susVerificando.length !== 15) erros.erroSUS = 'Número do SUS inválido.';

    if (foneVerificando.length < 11) erros.erroFone = 'Telefone inválido. Deve conter 11 dígitos.';

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email || !emailRegex.test(email)) erros.erroEmail = "E-mail inválido. Digite um e-mail válido (ex: exemplo@email.com).";

    if (Object.values(erros).some(e => e)) {
      return res.render('auth/cadastro', {
        layout: 'layouts/layoutAuth',
        ...erros,
        preenchido: req.body
      });
    }

    const senhaCriptografada = await bcrypt.hash(req.body.senha, 10);

    const enderecoCriado = await Endereco.create({
      rua: req.body.rua,
      numero,
      bairro: req.body.bairro,
      cidade: req.body.cidade,
      UF: req.body.uf,
      CEP: cep
    });

    await Usuario.create({
      img: req.file?.filename || null,
      nome: req.body.nome,
      data_nasc: req.body.data_nasc,
      CPF: cpfVerificando,
      generoID: req.body.genero,
      email,
      fone: foneVerificando,
      enderecoID: enderecoCriado.cod,
      SUS: susVerificando,
      senha: senhaCriptografada
    });

    res.redirect('/auth/cadastro-sucesso');

  } catch (erro) {
    console.error(erro);
    res.status(500).send('Erro ao cadastrar: ' + erro);
  }
};

// Motorista
exports.renderCadastroMotorista = (req, res) => {
  res.render('auth/cadastro-motorista', {
    layout: 'layouts/layoutAuth',
    erroCPF: null,
    erroMatricula: null,
    erroFone: null,
    erroEmail: null,
    erroNumero: null,
    erroCEP: null,
    preenchido: req.body
  });
};

exports.cadastrarMotorista = async (req, res) => {
  try {
    const { numero = '', cep = '', CPF, matricula, fone, email } = req.body;

    const cpfVerificando = CPF.replace(/\D/g, '');
    const matriculaVerificando = matricula.replace(/\D/g, '');
    const foneVerificando = fone.replace(/\D/g, '');

    const erros = {
      erroCPF: null,
      erroMatricula: null,
      erroFone: null,
      erroEmail: null,
      erroNumero: null,
      erroCEP: null
    };

    if (!numero || numero.length > 4) erros.erroNumero = 'Número deve ter até 4 dígitos';
    if (!cep || cep.replace(/\D/g,'').length !== 8) erros.erroCEP = 'CEP deve ter exatamente 8 dígitos';

    const cpfExistente = await Motorista.findOne({ where: { CPF: cpfVerificando } });
    const matriculaExistente = await Motorista.findOne({ where: { matricula: matriculaVerificando } });

    if (cpfExistente) erros.erroCPF = 'CPF já cadastrado.';
    else if (cpfVerificando.length !== 11) erros.erroCPF = 'CPF inválido.';

    if (matriculaExistente) erros.erroMatricula = 'Matrícula já cadastrada.';
    else if (!/^\d{4}$/.test(matriculaVerificando)) erros.erroMatricula = 'Matrícula inválida. Deve conter exatamente 4 dígitos.';

    if (foneVerificando.length < 11) erros.erroFone = 'Telefone inválido. Deve conter 11 dígitos.';

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email || !emailRegex.test(email)) erros.erroEmail = "E-mail inválido. Digite um e-mail válido (ex: exemplo@email.com).";

    if (Object.values(erros).some(e => e)) {
      return res.render('auth/cadastro-motorista', {
        layout: 'layouts/layoutAuth',
        ...erros,
        preenchido: req.body
      });
    }

    const senhaCriptografada = await bcrypt.hash(req.body.senha, 10);

    const enderecoCriado = await Endereco.create({
      rua: req.body.rua,
      numero,
      bairro: req.body.bairro,
      cidade: req.body.cidade,
      UF: req.body.uf,
      CEP: cep
    });

    const arquivos = req.files;
    const docsCriado = await Documento.create({
      carteira_trab: arquivos?.carteira_trab?.[0]?.filename,
      cursos: arquivos?.cursos?.[0]?.filename,
      habilitacao: arquivos?.habilitacao?.[0]?.filename,
      comprov_resid: arquivos?.comprov_resid?.[0]?.filename,
      comprov_escola: arquivos?.comprov_escola?.[0]?.filename,
      titulo_eleitor: arquivos?.titulo_eleitor?.[0]?.filename,
      ant_crim: arquivos?.ant_crim?.[0]?.filename,
      exame_tox: arquivos?.exame_tox?.[0]?.filename
    });

    await Motorista.create({
      img: arquivos?.foto_perfil?.[0]?.filename || null,
      nome: req.body.nome,
      data_nasc: req.body.data_nasc,
      CPF: cpfVerificando,
      fone: foneVerificando,
      email,
      generoID: req.body.genero,
      enderecoID: enderecoCriado.cod,
      docsID: docsCriado.cod,
      senha: senhaCriptografada,
      matricula: matriculaVerificando
    });

    res.redirect('/admin/motoristas/index');

  } catch (erro) {
    console.error(erro);
    res.status(500).send('Erro ao cadastrar motorista: ' + erro);
  }
};
