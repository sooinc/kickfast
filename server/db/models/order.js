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

//For mergeFrom function
Order.prototype.getQuantities = function (options = {}) {
  const mergedOptions = {
    ...options,
    through: {attributes: ['quantity']},
  }
  return this.getProxies(mergedOptions) //may need to pluralize
}

//For mergeFrom function
Order.prototype.setQuantity = function (proxy, quantity) {
  const OrderItem = db.model('orderItem')
  const proxyId = typeof proxy === 'object' ? proxy.id : proxy
  if (quantity > 0) {
    return OrderItem.upsert({orderId: this.id, proxyId, quantity})
  } else {
    return this.removeProxy(proxy)
  }
}

//For saveToUser function in utils
Order.prototype.mergeFrom = async function (otherOrder) {
  const thisQuantities = await this.getQuantities()
  const otherQuantities = await otherOrder.getQuantities()

  const oldQuantities = new Map(
    thisQuantities.map((item) => [item.id, item.orderItem.quantity])
  )

  const updates = otherQuantities.map((item) => {
    const id = item.id
    const quantity = item.orderItem.quantity
    if (quantity > (oldQuantities.get(id) || 0)) {
      return this.setQuantity(id, quantity)
    }
  })

  await Promise.all(updates)
}

module.exports = Order
