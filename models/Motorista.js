const db = require('./db');
const Endereco = require('./Endereco');
const Genero = require('./Genero');
const Documento = require('./Documento');

const Motorista = db.sequelize.define('Motorista', {
  cod: {
    type: db.Sequelize.INTEGER,
    primaryKey: true,
    autoIncrement: true,
    allowNull: false
  },
  matricula: {
    type: db.Sequelize.STRING(4),
    unique: true,
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
  fone: {
    type: db.Sequelize.CHAR(16),
    allowNull: false
  },
  email: {
    type: db.Sequelize.STRING(30),
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
  generoID: {
    type: db.Sequelize.INTEGER,
    allowNull: false,
    references: {
      model: Genero,
      key: 'cod'
    }
  },
  docsID: {
    type: db.Sequelize.INTEGER,
    allowNull: false,
    references: {
      model: Documento,
      key: 'cod'
    }
  },
  senha: {
          type: db.Sequelize.STRING(16), 
          allowNull: false
  }
}, {
  timestamps: false,
});

module.exports = Motorista;
