const Sequelize = require('sequelize')
const pkg = require('../../package.json')
const {databaseURL} = require('../../secrets')

const databaseName = pkg.name + (process.env.NODE_ENV === 'test' ? '-test' : '')

let db

if (process.env.NODE_ENV !== 'production') {
  db = new Sequelize(`postgres://localhost:5432/${databaseName}`, {
    logging: false,
  })
  if (process.env.NODE_ENV === 'test') {
    after('close database connection', () => db.close())
  }
} else {
  db = new Sequelize(databaseURL, {
    logging: false,
  })
}

module.exports = db
