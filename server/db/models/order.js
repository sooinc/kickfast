const Sequelize = require('sequelize')
const db = require('../db')

const Order = db.define('order', {
  status: {
    type: Sequelize.ENUM(['pending', 'fulfilled']),
    allowNull: false,
    defaultValue: 'pending',
  },
})

//guest's pending cart
Order.findCartByPk = function (pk, options = {}) {
  const mergedOptions = {
    ...options,
    where: {
      ...(options.where || {}),
      ...{status: 'pending'},
    },
  }
  return Order.findByPk(pk, mergedOptions)
}

module.exports = Order
