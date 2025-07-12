const db = require('./db');

const Documento = db.sequelize.define('documento', {
  cod: {
    type: db.Sequelize.INTEGER,
    primaryKey: true,
    autoIncrement: true,
    allowNull: false
  },
  carteira_trab: {
    type: db.Sequelize.STRING(50),
  },
  cursos: {
    type: db.Sequelize.STRING(50),
  },
  habilitacao: {
    type: db.Sequelize.STRING(50),
  },
  comprov_resid: {
    type: db.Sequelize.STRING(50),
  },
  comprov_escola: {
    type: db.Sequelize.STRING(50),
  },
  titulo_eleitor: {
    type: db.Sequelize.STRING(50),
  },
  ant_crim: {
    type: db.Sequelize.STRING(50),
  },
  exame_tox: {
    type: db.Sequelize.STRING(50),
  }
}, {
  timestamps: false
});

module.exports = Documento;
