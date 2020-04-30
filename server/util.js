const {Order, Proxy, OrderItem} = require('./db/models')

async function getCart(req) {
  let option = {
    include: [
      {
        model: Proxy,
        through: {attributes: ['quantity']},
        order: [['createAt', 'DESC']],
      },
    ],
  }
  //if req.user is true, then use user.getCart method to get their pending order.
  //if req.user is false, it's a guest, so check if they already have a cart in their session.
  let cart
  if (req.user) {
    cart = await req.user.getCart(option)
  } else {
    const cartId = req.session.cartId
    if (cartId) {
      cart = await Order.findCartByPk(cartId, option)
    } else {
      cart = null
    }
  }
  return cart
}

async function getOrCreateCart(req) {
  //if user, check for existing pending order. If no pending order, create an order using userID.
  //if guest, check for existing pending order. If no pending order, create an Order and add to session.
  let cart
  if (req.user) {
    console.log('im a user')
    cart = await req.user.getOrCreateUserCart()
  } else {
    const cartId = req.session.cartId
    if (cartId) {
      cart = await Order.findCartByPk(cartId)
    } else {
      cart = await Order.create()
      req.session.cartId = cart.id
    }
  }
  return cart
}

async function updateQuantity(cart, proxyId, newQty) {
  const item = await OrderItem.findOne({
    where: {
      orderId: cart.id,
      proxyId: proxyId,
    },
  })

  let itemQty
  if (item) {
    itemQty = item.quantity
  } else {
    itemQty = 0
  }

  let finalQty = itemQty + newQty

  const proxy = await Proxy.findByPk(proxyId)
  if (finalQty > 0) {
    return OrderItem.upsert({
      orderId: cart.id,
      proxyId: proxyId,
      quantity: finalQty,
    })
  } else {
    return cart.removeProxy(proxy)
  }
}

module.exports = {getCart, getOrCreateCart, updateQuantity}
