const db = require('./db');
const Endereco = require('./Endereco');
const Genero = require('./Genero');

const Usuario = db.sequelize.define('Usuario', {
    cod: {
        type: db.Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false
    },
    img: {
        type: db.Sequelize.STRING(50), 
    },
    nome: {
        type: db.Sequelize.STRING(40),
        allowNull: false
    },
    data_nasc: {
        type: db.Sequelize.DATEONLY, 
        allowNull: false
    },
    CPF: {
        type: db.Sequelize.CHAR(14),
        allowNull: false,
        unique: true
    },
    generoID: { 
        type: db.Sequelize.INTEGER, 
        allowNull: false, 
        field: 'genero', //nome de verda no banco
        references: { 
            model: Genero, 
            key: 'cod' } 
    },
    email: {
        type: db.Sequelize.STRING(30),
        allowNull: false
    },
    fone: {
        type: db.Sequelize.CHAR(16),
        allowNull: false
    },
    enderecoID: {
        type: db.Sequelize.INTEGER,
        allowNull: false,
        field: 'endereco', //nome de verda no banco
        references: {
            model: Endereco,
            key: 'cod'
        }
    },
    SUS: {
        type: db.Sequelize.CHAR(15), 
        allowNull: false
    },
    senha: {
        type: db.Sequelize.STRING(16), 
        allowNull: false
    }
},{
  timestamps: false   
  });

module.exports = Usuario;