const db = require('./db');

const Acompanhante = db.sequelize.define('acompanhante', {
  cod: {
    type: db.Sequelize.INTEGER,
    primaryKey: true,
    autoIncrement: true,
    allowNull: false
  },
  img: {
    type: db.Sequelize.STRING(50), 
    allowNull: true
  },
  nome: {
    type: db.Sequelize.STRING(40),
    allowNull: false
  },
  cpf: {
    type: db.Sequelize.STRING(14), 
    allowNull: false,
  },
  data_nasc: {
    type: db.Sequelize.DATEONLY,
    allowNull: false
  },
  generoID: {
    type: db.Sequelize.INTEGER,
    allowNull: false
  },
  telefone: {
    type: db.Sequelize.STRING(15), 
    allowNull: false
  }
}, {
  timestamps: false
});

module.exports = Acompanhante;
