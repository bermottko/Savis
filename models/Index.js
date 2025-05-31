// models/index.js
const db = require('./db');
const Usuarios = require('./Usuarios');
const Endereco = require('./Endereco');
const Genero = require('./Genero');

// Associações
Usuarios.belongsTo(Endereco, { foreignKey: 'enderecoID' });
Endereco.hasMany(Usuarios, { foreignKey: 'enderecoID' });

Usuarios.belongsTo(Genero, { foreignKey: 'generoID' });
Genero.hasMany(Usuarios, { foreignKey: 'generoID' });

module.exports = { db, Usuarios, Endereco, Genero };
