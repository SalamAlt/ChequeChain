const Sequelize = require('sequelize')
const mysql = require('mysql2')
const db = {}
//database name, user, password
const sequelize = new Sequelize('accountdb', 'root', '$chequechain$', {
  host: 'chequechain.cbgnia91e4j1.us-east-2.rds.amazonaws.com',
  port: 3306,
  dialect: 'mysql',
  operatorsAliases: false,

  pool: {
    max: 5,
    min: 0,
    acquire: 30000,
    idle: 10000
  }
})
sequelize
  .authenticate()
  .then(() => {
    console.log('Connection has been established successfully.');
  })
  .catch(err => {
    console.error('Unable to connect to the database:', err);
  });


db.sequelize = sequelize
db.Sequelize = Sequelize

module.exports = db