const db = require('./db');

const Documento = db.sequelize.define('documento', {
  cod: {
    type: db.Sequelize.INTEGER,
    primaryKey: true,
    autoIncrement: true,
    allowNull: false
  },
  carteira_trab: {
    type: db.Sequelize.BLOB
  },
  cursos: {
    type: db.Sequelize.BLOB
  },
  habilitacao: {
    type: db.Sequelize.BLOB
  },
  comprov_resid: {
    type: db.Sequelize.BLOB
  },
  comprov_escola: {
    type: db.Sequelize.BLOB
  },
  titulo_eleitor: {
    type: db.Sequelize.BLOB
  },
  ant_crim: {
    type: db.Sequelize.BLOB
  },
  exame_tox: {
    type: db.Sequelize.BLOB
  }
}, {
  timestamps: false
});

module.exports = Documento;
