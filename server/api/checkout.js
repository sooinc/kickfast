const {stripePK, stripeSK} = require('../../secrets')
const stripe = require('stripe')(stripeSK)
const router = require('express').Router({mergeParams: true})

module.exports = router

//need to fortiy this so we're not grabbing directly from items object
//(i.e. need to match it or smth)
const calculateOrderAmount = (cartItems) => {
  let total = cartItems
    .map((item) => item.price * item.orderItem.quantity)
    .reduce((currTotal, itemTotal) => {
      return currTotal + itemTotal
    }, 0)
  return Math.floor(total)
}

//confirm checkout
router.post('/', async (req, res, next) => {
  try {
    const {cartItems, currency = 'usd'} = req.body
    // Create a PaymentIntent with the order amount and currency
    const paymentIntent = await stripe.paymentIntents.create({
      amount: calculateOrderAmount(cartItems),
      currency: currency,
    })
    //Send publishable key(?) and PaymentIntent details to client
    //publishableKey: process.env.STRIPE_PUBLISHABLE_KEY or
    //publishableKey: stripePK,
    res.send({
      clientSecret: paymentIntent.client_secret,
    })
  } catch (err) {
    next(err)
  }
})
