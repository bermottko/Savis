const db = require('./db');

const Genero = db.sequelize.define('genero', {
  cod: {
    type: db.Sequelize.INTEGER,
    primaryKey: true,
    autoIncrement: true,
    allowNull: false
  },
  descricao: {
    type: db.Sequelize.STRING(13),
    allowNull: false
  }
},{
  timestamps: false   
  }
);

module.exports = Genero;
