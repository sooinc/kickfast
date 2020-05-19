const router = require('express').Router({mergeParams: true})
const {Proxy} = require('../db/models')
const {getCart, getOrCreateCart, updateQuantity} = require('../util')

module.exports = router

//get all cartItems aka cart
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

//update cartItem
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

//delete cartItem
router.delete('/:proxyId', async (req, res, next) => {
  try {
    const cart = await getCart(req)
    if (!cart) {
      res.json([]).status(204)
      return
    }
    const proxyId = req.params.proxyId
    const proxy = await Proxy.findByPk(proxyId)
    await cart.removeProxy(proxy)

    const updatedCart = await getCart(req)
    if (updatedCart) {
      res.json(updatedCart.proxies).status(204)
    } else {
      res.json([]).status(204)
    }
  } catch (err) {
    next(err)
  }
})
