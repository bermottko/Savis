const db = require('./db');

const Chefe = db.sequelize.define('chefe', {
  cod: {
    type: db.Sequelize.INTEGER,
    primaryKey: true,
    autoIncrement: true,
    allowNull: false
  },
  matricula: {
    type: db.Sequelize.INTEGER,
    allowNull: false,
    unique: true
  },
  senha: {
    type: db.Sequelize.STRING(255),
    allowNull: false
  },
  nome: {
    type: db.Sequelize.STRING(40),
    allowNull: false
  }
}, {
  tableName: 'chefes', 
  timestamps: false
});

module.exports = Chefe;
