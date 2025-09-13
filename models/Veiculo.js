const db = require('./db');

const Veiculo = db.sequelize.define('veiculo', {
  cod: {
    type: db.Sequelize.INTEGER,
    primaryKey: true,
    autoIncrement: true,
    allowNull: false
  },
  modelo_veiculo: {
    type: db.Sequelize.STRING(30),
  },
  lugares_dispo: {
    type: db.Sequelize.INTEGER,
  },
  placa: {
    type: db.Sequelize.CHAR(7),
  },
},{
  timestamps: false   
  }
);

module.exports = Veiculo;
