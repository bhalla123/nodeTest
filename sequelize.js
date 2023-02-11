const Sequelize = require('sequelize')

const sequelize = new Sequelize('construction_app_admin', 'root', 'anviam', {
  host: 'localhost',
  dialect: 'mysql',
  pool: {
    max: 10,
    min: 0,
    acquire: 30000,
    idle: 10000
  }
})

sequelize.sync({ force: false })
  .then(() => {
    console.log(`Sequelize setp success`)
  })

module.exports = {
  SQMembershipTransactions,
} 