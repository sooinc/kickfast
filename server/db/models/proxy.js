const Sequelize = require('sequelize')
const db = require('../db')

const Proxy = db.define('proxy', {
  name: {
    type: Sequelize.STRING,
    allowNull: false,
    validate: {
      notEmpty: true,
    },
  },
  description: {
    type: Sequelize.TEXT,
  },
  subscriptionDays: {
    type: Sequelize.INTEGER,
    allowNull: false,
  },
  dataAllowance: {
    type: Sequelize.INTEGER,
    allowNull: false,
  },
  proxyStatus: {
    type: Sequelize.ENUM(['inactive', 'active', 'expired']),
    allowNull: false,
    defaultValue: 'inactive',
  },
  price: {
    type: Sequelize.DECIMAL(16, 2),
    allowNull: false,
  },
})

module.exports = Proxy
