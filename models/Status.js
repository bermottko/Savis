const db = require('./db');

const Status = db.sequelize.define('status', {
  cod: {
    type: db.Sequelize.INTEGER,
    primaryKey: true,
    autoIncrement: true,
    allowNull: false
  },
  descricao: {
    type: db.Sequelize.STRING(9),
    allowNull: false,
    validate: {
      isIn: [['Cancelada', 'Concluída', 'Pendente']]
    }
  }
}, {
  timestamps: false
});

module.exports = Status;
