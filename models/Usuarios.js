const db = require('./db');
const Endereco = require('./Endereco');

const Usuarios = db.sequelize.define('usuarios', {
    cod: {
        type: db.Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false
    },
    img: {
        type: db.Sequelize.BLOB 
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
    genero: {
        type: db.Sequelize.INTEGER,
        allowNull: false
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
        references: {
            model: Endereco,
            key: 'cod'
        }
    },
    SUS: {
        type: db.Sequelize.INTEGER, 
        allowNull: false
    },
    senha: {
        type: db.Sequelize.STRING(16), 
        allowNull: false
    }
})

module.exports = Usuarios

