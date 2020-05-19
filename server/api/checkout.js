const {stripeSK} = require('../../secrets') //stripePK
const stripe = require('stripe')(stripeSK)
const router = require('express').Router({mergeParams: true})
const {Order, Proxy, User} = require('../db/models')
const {getCart} = require('../util')
const db = require('../db')

module.exports = router

const calculateOrderAmount = (cartItems) => {
  let total = cartItems
    .map((item) => item.price * item.orderItem.quantity)
    .reduce((currTotal, itemTotal) => {
      return currTotal + itemTotal
    }, 0)
  return total * 100
}

//proceed to checkout
router.post('/', async (req, res, next) => {
  try {
    const {currency = 'usd'} = req.body //keeping this for now but nothing in req.body
    const cart = await getCart(req)

    // Create a PaymentIntent with the order amount and currency
    const paymentIntent = await stripe.paymentIntents.create({
      amount: calculateOrderAmount(cart.proxies),
      currency: currency,
    })
    //Send publishable key(?) and PaymentIntent details to client
    //publishableKey: process.env.STRIPE_PUBLISHABLE_KEY OR publishableKey: stripePK,
    res.send({
      clientSecret: paymentIntent.client_secret,
    })
  } catch (err) {
    next(err)
  }
})

//proceed to confirmation (once payment is confirmed)
router.post('/confirmation', async (req, res, next) => {
  try {
    const newIp = req.body.newIp
    console.log('newIp', newIp)

    const user = await User.findByPk(req.user.id)
    console.log('before existing IP', user.ipAddress)
    if (user.ipAddress.length < 3) {
      if (!user.ipAddress.includes(newIp)) {
        await user.update({
          ipAddress: db.fn('array_append', db.col('ipAddress'), newIp),
        })
      }
    }
    console.log('after existing IP', user.ipAddress)

    const order = await getCart(req)
    await order.update({status: 'fulfilled'})
    req.session.cartId = null
    const confirmedOrder = await Order.findByPk(order.id, {
      include: [{model: Proxy}],
      through: {attributes: ['quantity']},
    })
    res.status(201).json(confirmedOrder)
  } catch (err) {
    next(err)
  }
})
