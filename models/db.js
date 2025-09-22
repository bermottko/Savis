//Conectando com o mysql
const Sequelize = require('sequelize');
const sequelize = new Sequelize('savisdb', 'root', '2017',{
  host: "localhost",
  dialect: "mysql",
  logging: false,
})

module.exports = {
    Sequelize: Sequelize, 
    sequelize: sequelize
}