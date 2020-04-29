const router = require('express').Router()
const {getCart} = require('../util')

module.exports = router

router.get('/', async (req, res, next) => {
  try {
    let order = await getCart(req)
    //getCart checks user v guest and returns order that's pending accordingly

    if (order) {
      res.json(order.proxies)
    } else {
      res.json([])
    }
  } catch (err) {
    next(err)
  }
})

//if user, check for existing pending order. If no pending order, create an order using userID.
//if guest, check for existing pending order. If no pending order, create an Order and add to session.
// router.post('/:proxyId', async (req, res, next) => {})
