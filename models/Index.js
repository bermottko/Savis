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


console.log('Arquivo models/index.js executado');
module.exports = { db, Usuarios, Endereco, Genero };
