const router = require('express').Router()
const {Proxy} = require('../db/models')
module.exports = router

router.get('/', async (req, res, next) => {
  try {
    const proxies = await Proxy.findAll()
    if (proxies) {
      res.json(proxies)
    } else {
      res.status(404).send('No products found')
    }
  } catch (err) {
    next(err)
  }
})

router.get('/:proxyId', async (req, res, next) => {
  try {
    let proxyId = req.params.proxyId
    let proxy = await Proxy.findByPk(proxyId)
    if (proxy) {
      res.json(proxy)
    } else {
      res.status(404).send('No product found')
    }
  } catch (err) {
    next(err)
  }
})

// //Admin only access: UPDATE LATER
// router.post('/', adminsOnly, async (req, res, next) => {
//     try {
//       let product = await Product.create(req.body)
//       if (product) {
//         res.status(201).json(product)
//       }
//     } catch (err) {
//       res.status(500).send(err)
//     }
//   })

//   router.delete('/:productId', adminsOnly, async (req, res, next) => {
//     try {
//       let productId = req.params.productId
//       let product = await Product.findByPk(productId)
//       if (!product) {
//         res.sendStatus(404)
//       } else {
//         await product.destroy()
//         res.sendStatus(204)
//       }
//     } catch (err) {
//       res.status(500).send(err)
//     }
//   })

//   router.put('/:productId', adminsOnly, async (req, res, next) => {
//     try {
//       let productId = req.params.productId
//       let product = await Product.findByPk(productId)
//       if (!product) {
//         res.sendStatus(404)
//       } else {
//         let newProduct = await product.update(req.body)
//         res.status(200).json(newProduct)
//       }
//     } catch (err) {
//       res.status(500).send(err)
//     }
//   })
