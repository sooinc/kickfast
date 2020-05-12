const {stripePK, stripeSK} = require('../../secrets')
const stripe = require('stripe')(stripeSK)
const router = require('express').Router({mergeParams: true})

module.exports = router

const calculateOrderAmount = (items, qty) => {
  return items * qty
}

//confirm checkout
router.post('/', async (req, res, next) => {
  try {
    const {items, currency = 'usd'} = req.body
    // Create a PaymentIntent with the order amount and currency
    const paymentIntent = await stripe.paymentIntents.create({
      amount: calculateOrderAmount(items),
      currency: currency,
    })

    // Send publishable key and PaymentIntent details to client
    //publishableKey: process.env.STRIPE_PUBLISHABLE_KEY
    res.send({
      publishableKey: stripePK,
      clientSecret: paymentIntent.client_secret,
    })
  } catch (err) {
    next(err)
  }
})
