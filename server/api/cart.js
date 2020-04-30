const router = require('express').Router({mergeParams: true})
const {getCart, getOrCreateCart, updateQuantity} = require('../util')

module.exports = router

router.get('/', async (req, res, next) => {
  try {
    const cart = await getCart(req)

    if (cart) {
      res.json(cart.proxies)
    } else {
      res.json([])
    }
  } catch (err) {
    next(err)
  }
})

router.post('/:proxyId', async (req, res, next) => {
  try {
    const proxyId = req.params.proxyId

    const cart = await getOrCreateCart(req)
    await updateQuantity(cart, proxyId, req.body.quantity)
    const updatedCart = await cart.getProxies({
      through: {attributes: ['quantity']},
    })

    res.status(201).json(updatedCart)
  } catch (err) {
    next(err)
  }
})
