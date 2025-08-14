const db = require('./db');

const Viagem = db.sequelize.define('viagem', {
  cod: {
    type: db.Sequelize.INTEGER,
    primaryKey: true,
    autoIncrement: true,
    allowNull: false
  },
  destino_cid: {
    type: db.Sequelize.STRING(30),
  },
  data_viagem: {
    type: db.Sequelize.DATEONLY,
  },
  horario_saida: {
    type: db.Sequelize.TIME,
  },
  lugares_dispo: {
    type: db.Sequelize.INTEGER,
  },
  modelo_car: {
    type: db.Sequelize.STRING(30),
  },
  placa: {
    type: db.Sequelize.CHAR(7),
  },
  motoristaID: {
    type: db.Sequelize.INTEGER,
    allowNull: false,
  },
  statusID: {
    type: db.Sequelize.INTEGER,
    allowNull: false,
  },
  usuarioID: {
    type: db.Sequelize.INTEGER,
  },
  combustivel: {
    type: db.Sequelize.FLOAT,
  },
  km_inicial: {
    type: db.Sequelize.FLOAT,
  },
  km_final: {
    type: db.Sequelize.FLOAT,
  },
  paradas: {
    type: db.Sequelize.STRING(200),
  },
  horario_chega: {
    type: db.Sequelize.TIME,
  },
  obs: {
    type: db.Sequelize.STRING(255),
  }
}, {
  timestamps: false
});

module.exports = Viagem;
