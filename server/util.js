const {Order, Proxy} = require('./db/models')

//if req.user is true, then use user.getCart method to get their pending order.
//if req.user is false, it's a guest, so check if they already have a cart in their session.
async function getCart(req) {
  let userOrder
  let option = {
    include: [
      {
        model: Proxy,
        through: {attributes: ['quantity']},
        order: [['createAt', 'DESC']],
      },
    ],
  }
  if (req.user) {
    userOrder = await req.user.getCart(option)
  } else {
    const cartId = req.session.cartId
    if (cartId) {
      userOrder = await Order.findCartByPk(cartId, option)
    } else {
      userOrder = null
    }
  }
  return userOrder
}

module.exports = {getCart}
