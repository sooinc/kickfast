const router = require('express').Router({mergeParams: true})
const {getCart} = require('../util')
const {Order, Proxy} = require('../db/models')

const {getSecret} = require('../../fetchSecrets')

let stripe
getSecret(`/kickfast/stripeSK`).then((value) => {
  stripe = require('stripe')(value)
})

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

//proceed to confirmation (once IP and payment is confirmed)
router.post('/confirmation', async (req, res, next) => {
  try {
    let billingEmail = req.body.billingEmail

    const order = await getCart(req)
    await order.update({
      status: 'fulfilled',
      billingEmail: billingEmail,
    })
    req.session.cartId = null
    const confirmedOrder = await Order.findByPk(order.id, {
      include: [{model: Proxy}],
      through: {attributes: ['quantity']},
    })

    if (confirmedOrder) {
      res.status(201).json(confirmedOrder)
    } else {
      res.status(404).send('something went wrong')
    }
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
