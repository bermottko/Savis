const db = require('./db');

const CidadeConsul = db.sequelize.define('cidadeconsul', {
  cod: {
    type: db.Sequelize.INTEGER,
    primaryKey: true,
    autoIncrement: true,
    allowNull: false
  },
  descricao: {
    type: db.Sequelize.STRING(30),
    allowNull: false
  }
},{
  timestamps: false   
  }
);

module.exports = CidadeConsul;