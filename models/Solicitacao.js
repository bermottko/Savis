const db = require('./db');
const Usuario = require('./Usuario');
const Status = require('./Status');

const Solicitacao = db.sequelize.define('solicitacao', {
  cod: {
    type: db.Sequelize.INTEGER,
    primaryKey: true,
    autoIncrement: true,
    allowNull: false
  },
  usuarioID: {
    type: db.Sequelize.INTEGER,
    allowNull: false,
    field: 'usuario',
    references: {
      model: Usuario,
      key: 'cod'
    }
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
    type: db.Sequelize.BLOB,
    allowNull: false
  },
  statusID: {
    type: db.Sequelize.INTEGER,
    allowNull: true,
    field: 'status',
    references: {
      model: Status,
      key: 'cod'
    }
  },
  objetivo: {
    type: db.Sequelize.STRING(30),
    allowNull: false
  },
  obs: {
    type: db.Sequelize.STRING(255),
    allowNull: true
  },
  data_solicita: {
    type: db.Sequelize.DATEONLY,
    allowNull: true
  },
  hora_solicita: {
    type: db.Sequelize.TIME,
    allowNull: true
  }
}, {
  timestamps: false
});

module.exports = Solicitacao;
