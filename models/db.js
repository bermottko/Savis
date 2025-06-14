//Conectando com o mysql
const Sequelize = require('sequelize');
const sequelize = new Sequelize('savisdb', 'root', '2017',{
  host: "localhost",
  dialect: "mysql",
  logging: false  // desativa mensagem enorme no terminal sobre mysql funcionando
})

module.exports = {
    Sequelize: Sequelize, 
    sequelize: sequelize
}