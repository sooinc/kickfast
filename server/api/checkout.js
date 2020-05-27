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

//add IP to user or send err
router.put('/updateIp', async (req, res, next) => {
  try {
    let newIp = req.body.newIp
    const user = await User.findByPk(req.user.id)

    if (newIp === '' || newIp === null) {
      res.status(401).send('Not a valid IP address. Please try again.')
      return
    }

    if (user.ipAddress === null) {
      await user.update({
        ipAddress: [newIp],
      })
      res.status(202).send('IP has been added to user profile.')
      return
    }

    if (user.ipAddress.includes(newIp)) {
      res.status(202).send('Existing IP.')
    } else if (user.ipAddress.length < 3) {
      await user.update({
        ipAddress: [...user.ipAddress, newIp],
      })
      res.status(202).send('IP has been added to user profile.')
    } else if (user.ipAddress.length >= 3) {
      res
        .status(401)
        .send('Not able to add IP. Please use 1 of the 3 on your account.')
    }
  } catch (err) {
    next(err)
  }
})

//delete IP to user and send user.Ip
router.put('/removeIp', async (req, res, next) => {
  try {
    let newIp = req.body.newIp
    const user = await User.findByPk(req.user.id)

    console.log('newIp', newIp)
    console.log('user.ipAddress', user.ipAddress)

    let finalIp = user.ipAddress.filter((ip) => {
      return ip !== newIp
    })

    console.log('this is finalIp', finalIp)

    await user.update({
      ipAddress: finalIp,
    })
    res.status(201).send(user.ipAddress)
  } catch (err) {
    next(err)
  }
})

//proceed to confirmation (once IP and payment is confirmed)
router.post('/confirmation', async (req, res, next) => {
  try {
    let newIp = req.body.newIp
    let billingEmail = req.body.billingEmail

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
