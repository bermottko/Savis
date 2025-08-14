const db = require('./db');

const Solicitacao = db.sequelize.define('solicitacao', {
  cod: {
    type: db.Sequelize.INTEGER,
    primaryKey: true,
    autoIncrement: true,
    allowNull: false
  },
  usuarioID: {
    type: db.Sequelize.INTEGER,
    allowNull: false
  },
  local_consul: {
    type: db.Sequelize.STRING(50),
    allowNull: false
  },
  data_consul: {
    type: db.Sequelize.DATEONLY,
    allowNull: false
  },
  hora_consul: {
    type: db.Sequelize.TIME,
    allowNull: false
  },
  encaminhamento: {
    type: db.Sequelize.STRING(50),
    allowNull: false
  },
  objetivo: {
    type: db.Sequelize.STRING(60),
    allowNull: false
  },
  obs: {
    type: db.Sequelize.STRING(255),
    allowNull: true
  },
  acompanhanteID: {
    type: db.Sequelize.INTEGER,
    allowNull: true,
  },
  statusID: {
    type: db.Sequelize.INTEGER,
    allowNull: true,
  }
}, {
  timestamps: false
});

module.exports = Solicitacao;
