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
  cidadeconsulID: { 
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
  statusID: {
    type: db.Sequelize.INTEGER,
    allowNull: true,
  },

    foto_acompanhante: {
      type: db.Sequelize.STRING(50),
    },
    nome_acomp: {
      type: db.Sequelize.STRING(40),
    },
    cpf_acomp: {
      type: db.Sequelize.STRING(14), 
    },
    data_nasc_acomp: {
      type: db.Sequelize.DATEONLY,
    },
    generoID: {
      type: db.Sequelize.INTEGER,
    },
    telefone_acomp: {
      type: db.Sequelize.STRING(15), 
    }

}, {
  timestamps: false
});

module.exports = Solicitacao;
