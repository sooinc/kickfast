const {stripeSK} = require('../../secrets') //stripePK
const stripe = require('stripe')(stripeSK)
const router = require('express').Router({mergeParams: true})
const {Order, Proxy, User} = require('../db/models')
const {getCart} = require('../util')

module.exports = router

const calculateOrderAmount = (cartItems) => {
  let total = cartItems
    .map((item) => item.price * item.orderItem.quantity)
    .reduce((currTotal, itemTotal) => {
      return currTotal + itemTotal
    }, 0)
  return Math.round(total * 100)
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
    res.status(201).send({
      clientSecret: paymentIntent.client_secret,
    })
  } catch (err) {
    next(err)
  }
})

//proceed to confirmation (once payment is confirmed)
router.post('/confirmation', async (req, res, next) => {
  try {
    let newIp = req.body.newIp
    const billingEmail = req.body.billingEmail
    console.log('newIp', newIp)
    console.log('billingEmail', billingEmail)

    const user = await User.findByPk(req.user.id)
    console.log('before IP', user.ipAddress)

    if (newIp === '' || newIp === null) {
      res.status(401).send('Not a valid IP address. Please try again.')
      return
    } else if (user.ipAddress === null) {
      await user.update({
        ipAddress: [newIp],
      })
    } else if (user.ipAddress.length < 3 && !user.ipAddress.includes(newIp)) {
      await user.update({
        ipAddress: [...user.ipAddress, newIp],
      })
    }

    console.log('after IP', user.ipAddress)

    const order = await getCart(req)
    await order.update({
      status: 'fulfilled',
      ipAddress: newIp,
      billingEmail: billingEmail,
    })
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

//for confirmation page
router.get('/confirmation', async (req, res, next) => {
  try {
    const confirmedOrder = await Order.findAll({
      limit: 1,
      include: [
        {
          model: Proxy,
          through: {attributes: ['quantity']},
        },
      ],
      where: {status: 'fulfilled'},
      order: [['createdAt', 'DESC']],
    })
    res.status(200).json(confirmedOrder[0])
  } catch (err) {
    next(err)
  }
})
