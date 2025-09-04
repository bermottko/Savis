// models/index.js
const db = require('./db');
const Usuario = require('./Usuario');
const Endereco = require('./Endereco');
const Genero = require('./Genero');
const Status = require('./Status');
const Solicitacao = require('./Solicitacao');
const Motorista = require('./Motorista');
const Documento = require('./Documento');
const Viagem = require('./Viagem');
const Chefe = require('./Chefe');
const Acompanhante = require('./Acompanhante');
const CidadeConsul = require('./CidadeConsul');

//usuário
Usuario.belongsTo(Endereco, { 
    foreignKey: 'enderecoID', 
    onDelete: 'CASCADE', 
    onUpdate: 'CASCADE' 
});
Endereco.hasMany(Usuario, { 
    foreignKey: 'enderecoID', 
    onDelete: 'CASCADE', 
    onUpdate: 'CASCADE' 
});

Usuario.belongsTo(Genero, { 
    foreignKey: 'generoID', 
    onDelete: 'CASCADE', 
    onUpdate: 'CASCADE' 
});
Genero.hasMany(Usuario, { 
    foreignKey: 'generoID', 
    onDelete: 'CASCADE', 
    onUpdate: 'CASCADE' 
});

Usuario.hasMany(Solicitacao, {
  foreignKey: 'usuarioID',  
  onDelete: 'CASCADE',
  onUpdate: 'CASCADE'
});

Solicitacao.belongsTo(Usuario, {
  foreignKey: 'usuarioID',
  onDelete: 'CASCADE',
  onUpdate: 'CASCADE'
});

//solicitação
Solicitacao.belongsTo(Usuario, { 
    foreignKey: 'usuarioID', 
    onDelete: 'CASCADE', 
    onUpdate: 'CASCADE' 
});
Usuario.hasMany(Solicitacao, { 
    foreignKey: 'usuarioID', 
    onDelete: 'CASCADE', 
    onUpdate: 'CASCADE' 
});

Solicitacao.belongsTo(Status, { 
    foreignKey: 'statusID', 
    onDelete: 'CASCADE', 
    onUpdate: 'CASCADE' 
});
Status.hasMany(Solicitacao, { 
    foreignKey: 'statusID', 
    onDelete: 'CASCADE', 
    onUpdate: 'CASCADE' 
});

Solicitacao.belongsTo(Acompanhante, { 
    foreignKey: 'acompanhanteID', 
    onDelete: 'CASCADE', 
    onUpdate: 'CASCADE' 
});
Acompanhante.hasMany(Solicitacao, { 
    foreignKey: 'acompanhanteID', 
    onDelete: 'CASCADE', 
    onUpdate: 'CASCADE' 
});
Solicitacao.belongsTo(CidadeConsul, { 
    foreignKey: 'cidadeconsulID', 
    onDelete: 'CASCADE', 
    onUpdate: 'CASCADE' 
});
CidadeConsul.hasMany(Solicitacao, { 
    foreignKey: 'cidadeconsulID', 
    onDelete: 'CASCADE', 
    onUpdate: 'CASCADE' 
});

//motorista papai frança <3
Motorista.belongsTo(Endereco, { 
    foreignKey: 'enderecoID', 
    onDelete: 'CASCADE', 
    onUpdate: 'CASCADE' 
});
Endereco.hasMany(Motorista, { 
    foreignKey: 'enderecoID', 
    onDelete: 'CASCADE', 
    onUpdate: 'CASCADE' 
});

Motorista.belongsTo(Genero, { 
    foreignKey: 'generoID', 
    onDelete: 'CASCADE', 
    onUpdate: 'CASCADE' 
});
Genero.hasMany(Motorista, { 
    foreignKey: 'generoID', 
    onDelete: 'CASCADE', 
    onUpdate: 'CASCADE' 
});

Motorista.belongsTo(Documento, { 
    foreignKey: 'docsID', 
    onDelete: 'CASCADE', 
    onUpdate: 'CASCADE' 
});
Documento.hasMany(Motorista, { 
    foreignKey: 'docsID', 
    onDelete: 'CASCADE', 
    onUpdate: 'CASCADE' 
});

//viagenss
Viagem.belongsTo(Motorista, { 
    foreignKey: 'motoristaID', 
     as: 'Motorista', 
    onDelete: 'CASCADE', 
    onUpdate: 'CASCADE' 
});
Motorista.hasMany(Viagem, { 
    foreignKey: 'motoristaID', 
    onDelete: 'CASCADE', 
    onUpdate: 'CASCADE' 
});

Viagem.belongsTo(Status, { 
    foreignKey: 'statusID', 
    onDelete: 'CASCADE', 
    onUpdate: 'CASCADE' 
});
Status.hasMany(Viagem, { 
    foreignKey: 'statusID', 
    onDelete: 'CASCADE', 
    onUpdate: 'CASCADE' 
});

Viagem.belongsToMany(Usuario, { 
    through: 'viagem_usuario',
    foreignKey: 'viagemID', 
    onDelete: 'CASCADE', 
    onUpdate: 'CASCADE' 
});
Usuario.belongsToMany(Viagem, { 
    through: 'viagem_usuario',
    foreignKey: 'usuarioID', 
    onDelete: 'CASCADE', 
    onUpdate: 'CASCADE' 
});

Viagem.belongsTo(CidadeConsul, { 
    foreignKey: 'cidadeconsulID', 
    onDelete: 'CASCADE', 
    onUpdate: 'CASCADE' 
});
CidadeConsul.hasMany(Viagem, { 
    foreignKey: 'cidadeconsulID', 
    onDelete: 'CASCADE', 
    onUpdate: 'CASCADE' 
});

//sincroniza as tabelas no banco
db.sequelize.sync({force: false})
    .then(() => {
        console.log('Tabelas sincronizadas com sucesso.');
    })
    .catch((err) => {
        console.error('Erro ao sincronizar as tabelas:', err);
    });

console.log('Arquivo models/index.js executado');
module.exports = { db, Usuario, Endereco, Genero, Status, Solicitacao, Motorista, Documento, Viagem, Chefe, Acompanhante, CidadeConsul};