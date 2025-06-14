// models/index.js
const db = require('./db');
const Usuarios = require('./Usuarios');
const Endereco = require('./Endereco');
const Genero = require('./Genero');

Usuarios.belongsTo(Endereco, { 
    foreignKey: 'enderecoID', 
    onDelete: 'CASCADE', 
    onUpdate: 'CASCADE' 
});
Endereco.hasMany(Usuarios, { 
    foreignKey: 'enderecoID', 
    onDelete: 'CASCADE', 
    onUpdate: 'CASCADE' 
});

Usuarios.belongsTo(Genero, { 
    foreignKey: 'generoID', 
    onDelete: 'CASCADE', 
    onUpdate: 'CASCADE' 
});
Genero.hasMany(Usuarios, { 
    foreignKey: 'generoID', 
    onDelete: 'CASCADE', 
    onUpdate: 'CASCADE' 
});

// Sincroniza as tabelas no banco
db.sequelize.sync({ force: false }) // force: true recria as tabelas do zero (CUIDADO!)
  .then(() => {
    console.log('Tabelas sincronizadas com sucesso.');
  })
  .catch((err) => {
    console.error('Erro ao sincronizar as tabelas:', err);
  });

console.log('Arquivo models/index.js executado');

module.exports = { db, Usuarios, Endereco, Genero };