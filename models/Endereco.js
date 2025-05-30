const db = require('./db');

const Endereco = db.sequelize.define('endereco', {
  cod: {
    type: db.Sequelize.INTEGER,
    primaryKey: true,
    autoIncrement: true,
    allowNull: false
  },
  rua: {
    type: db.Sequelize.STRING(50),
    allowNull: false
  },
  numero: {
    type: db.Sequelize.INTEGER,
    allowNull: false
  },
  bairro: {
    type: db.Sequelize.STRING(20),
    allowNull: false
  },
  cidade: {
    type: db.Sequelize.STRING(30),
    allowNull: false
  },
  UF: {
    type: db.Sequelize.CHAR(2),
    allowNull: false
  },
  CEP: {
    type: db.Sequelize.CHAR(9),
    allowNull: false
  }
});

module.exports = Endereco;
