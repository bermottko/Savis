const { Usuario, Endereco, Genero, Solicitacao, Acompanhante, CidadeConsul } = require('../models');

exports.renderInicio = async (req, res) => {
    const codUsuario = req.session.usuario.cod;

    const usuario = await Usuario.findOne({
      where: { cod: codUsuario },
      include: [
        { model: Endereco },
        { model: Genero }
      ]
    });
    res.render('usuario/inicio/index', {
      usuario,
      layout: 'layouts/layoutUsuario',
      paginaAtual: 'inicio'
    });
}
exports.renderAgenda = (req, res) => {
    res.render('usuario/agenda/index', {
      layout: 'layouts/layoutUsuario',
      paginaAtual: 'agenda'
    });
}

exports.renderSolicitar = async (req, res) => {
  const cidadeconsul = await CidadeConsul.findAll();
    res.render('usuario/solicitar/index', {
      cidadeconsul,
      layout: 'layouts/layoutUsuario',
      paginaAtual: 'solicitar',
      preenchido: {} 
    });
}

exports.addSolicitar = async (req, res) => {
  try {
    const usuarioID = req.session.usuario.cod;
    let acompanhanteID = null;

    // Campos do formulário
    const { cidadeconsulID, local_consul, data_consul, hora_consul, objetivo, temAcompanhante, nome, cpf, data_nasc, telefone, generoID, obs } = req.body;

    // Arquivos (PDF do encaminhamento + foto do acompanhante)
    const encaminhamento = req.files?.encaminhamento?.[0]?.filename || null;
    const foto_acompanhante = req.files?.foto_acompanhante?.[0]?.filename || null;

    // Validação backend
    let erros = [];

    if (!cidadeconsulID) erros.push({ campo: "cidadeconsulID", msg: "Selecione uma cidade." });
    if (!local_consul) erros.push({ campo: "local_consul", msg: "Informe o local da consulta." });
    if (!data_consul || new Date(data_consul).setHours(0,0,0,0) < new Date().setHours(0,0,0,0)) erros.push({ campo: "data_consul", msg: "Informe uma data válida." });
    if (!hora_consul) erros.push({ campo: "hora_consul", msg: "Informe o horário da consulta." });
    if (!objetivo) erros.push({ campo: "objetivo", msg: "Informe o objetivo da consulta." });
    if (!encaminhamento) erros.push({ campo: "encaminhamento", msg: "Envie o encaminhamento em PDF." });

    if (temAcompanhante === "sim") {
      if (!nome) erros.push({ campo: "nome", msg: "Informe o nome do acompanhante." });
      if (!cpf || cpf.replace(/\D/g,'').length !== 11) erros.push({ campo: "cpf", msg: "Informe um CPF válido." });
      if (!data_nasc) erros.push({ campo: "data_nasc", msg: "Informe a data de nascimento do acompanhante." });
      if (!telefone || telefone.replace(/\D/g,'').length < 10) erros.push({ campo: "telefone", msg: "Informe um telefone válido." });
      if (!generoID) erros.push({ campo: "generoID", msg: "Selecione o gênero do acompanhante." });
    }

    // Se houver erros, renderiza a página com erros e dados preenchidos
    if (erros.length > 0) {
      return res.render('usuario/solicitar/index', {
        cidadeconsul: await CidadeConsul.findAll(),
        layout: 'layouts/layoutUsuario',
        paginaAtual: 'solicitar',
        erros,
        preenchido: req.body || {} // Mantém os valores preenchidos
      });
    }

    // Criação do acompanhante (se houver)
    if (temAcompanhante === "sim") {
      try {
        const acompanhanteCriado = await Acompanhante.create({
          img: foto_acompanhante, // aqui vai a foto salva
          nome,
          cpf: cpf.replace(/\D/g,''),
          data_nasc,
          generoID,
          telefone: telefone.replace(/\D/g,'')
        });
        acompanhanteID = acompanhanteCriado.cod;
      } catch (error) {
        // Tratamento de CPF duplicado
        if (error.name === "SequelizeUniqueConstraintError" && error.fields?.cpf) {
          return res.render("usuario/solicitar/index", {
            cidadeconsul: await CidadeConsul.findAll(),
            layout: "layouts/layoutUsuario",
            paginaAtual: "solicitar",
            erros: [{ campo: "cpf", msg: "Este CPF já está cadastrado para outro acompanhante." }],
            preenchido: req.body || {}
          });
        }
        throw error; // outros erros caem no catch principal
      }
    }

    // Criação da solicitação
    await Solicitacao.create({
      usuarioID,
      cidadeconsulID,
      local_consul,
      data_consul,
      hora_consul,
      encaminhamento,
      objetivo,
      obs: obs || null,
      statusID: null,
      acompanhanteID
    });

    res.redirect('/usuario/solicitar/index');

  } catch (err) {
    console.error("Erro ao salvar solicitação:", err);
    res.status(500).send('Erro ao salvar solicitação.');
  }
};

exports.renderDuvidas = (req, res) => {
    res.render('usuario/duvidas/index', {
      layout: 'layouts/layoutUsuario',
      paginaAtual: 'duvidas'
    });
}

exports.vincularUsuario = async (req, res) => {
  try {
    const cod = req.params.cod;
    const usuarioID = req.body.usuarioID;

    const { local_consul, hora_consul, objetivo, obs, temAcompanhante, nome, cpf, data_nasc, telefone, generoID } = req.body;
    const encaminhamento = req.files?.encaminhamento?.[0]?.filename || null;
    const foto_acomp = req.files?.foto_acomp?.[0]?.filename || null;

    let erros = [];

    if(!local_consul) erros.push({ campo:"local_consul", msg:"Informe o hospital." });
    if(!hora_consul) erros.push({ campo:"hora_consul", msg:"Informe o horário." });
    if(!objetivo) erros.push({ campo:"objetivo", msg:"Informe o objetivo." });
    if(!encaminhamento) erros.push({ campo:"encaminhamento", msg:"Envie o encaminhamento em PDF." });

    if(temAcompanhante==="sim"){
      if(!nome) erros.push({ campo:"nome", msg:"Informe o nome do acompanhante." });
      if(!cpf || cpf.replace(/\D/g,'').length!==11) erros.push({ campo:"cpf", msg:"CPF inválido." });
      if(!data_nasc) erros.push({ campo:"data_nasc", msg:"Informe a data de nascimento." });
      if(!telefone || telefone.replace(/\D/g,'').length<10) erros.push({ campo:"telefone", msg:"Telefone inválido." });
      if(!generoID) erros.push({ campo:"generoID", msg:"Selecione o gênero." });
    }

    if(erros.length>0){
      return res.render("admin/viagens/formulario-participante",{
        cod,
        usuario: await Usuario.findByPk(usuarioID,{include:[Genero,Endereco]}),
        layout:"layouts/layoutAdmin",
        paginaAtual:"viagens",
        erros
      });
    }

    let acompanhanteID = null;
    if(temAcompanhante==="sim"){
      const novoAcomp = await Acompanhante.create({
        img: foto_acomp, nome, cpf, data_nasc, generoID, telefone
      });
      acompanhanteID = novoAcomp.cod;
    }

    await Participante.create({
      usuarioID,
      viagemID: cod,
      local_consul,
      hora_consul,
      encaminhamento,
      objetivo,
      obs: obs || null,
      acompanhanteID,
      statusID: 1
    });

    res.redirect(`/admin/viagens/participantes/${cod}`);
  } catch (error) {
    console.error("Erro ao vincular usuário:", error);
    res.status(500).send("Erro ao vincular usuário à viagem");
  }
};