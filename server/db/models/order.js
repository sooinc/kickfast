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
Order.findCartByPk = async function (pk, options = {}) {
  const mergedOptions = {
    ...options,
    where: {
      ...(options.where || {}),
      ...{status: 'pending'},
    },
  }
  let order = await Order.findByPk(pk, mergedOptions)
  return order
}

module.exports = Order
