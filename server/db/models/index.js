const User = require('./user')
const Order = require('./order')
const Proxy = require('./proxy')
const OrderItem = require('./orderitem')

Order.belongsToMany(Proxy, {through: OrderItem})
Proxy.belongsToMany(Order, {through: OrderItem})

User.hasMany(Order)
Order.belongsTo(User)

module.exports = {
  User,
  Order,
  Proxy,
  OrderItem,
}
