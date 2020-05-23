const router = require('express').Router()
const User = require('../db/models/user')
const {saveToUser} = require('../util')
module.exports = router

router.post('/login', async (req, res, next) => {
  try {
    const user = await User.findOne({
      where: {email: req.body.email.toLowerCase()},
    })
    if (!user) {
      console.log('No such user found:', req.body.email)
      res.status(401).send('Wrong username and/or password')
    } else if (!user.correctPassword(req.body.password)) {
      console.log('Incorrect password for user:', req.body.email)
      res.status(401).send('Wrong username and/or password')
    } else {
      req.login(user, (err) => (err ? next(err) : res.json(user)))
      if (req.session.cartId) {
        saveToUser(req)
      }
    }
  } catch (err) {
    next(err)
  }
})

router.post('/signup', async (req, res, next) => {
  try {
    const user = await User.create(req.body)
    req.login(user, (err) => (err ? next(err) : res.json(user)))
    if (req.session.cartId) {
      console.log('inside signup')
      saveToUser(req)
    }
  } catch (err) {
    if (err.name === 'SequelizeUniqueConstraintError') {
      res.status(401).send('User already exists')
    } else {
      next(err)
    }
  }
})

router.put('/edit-email', async (req, res, next) => {
  try {
    const newEmail = req.body.email
    const user = await User.findByPk(req.user.id)

    if (newEmail === user.email) {
      res.status(401).send('Same as previous email.')
    } else {
      await user.update({email: newEmail})
      res.status(201).send(user)
    }
  } catch (err) {
    console.log('this is err name', err.name)
    if (err.name === 'SequelizeUniqueConstraintError') {
      res.status(401).send('Update Failed: User already exists in system.')
    } else if (err.name === 'SequelizeValidationError') {
      res.status(401).send('Update Failed: Email is not a valid email.')
    } else {
      next(err)
    }
  }
})

router.post('/logout', (req, res) => {
  req.logout()
  req.session.destroy()
  res.redirect('/')
})

router.get('/me', (req, res) => {
  res.json(req.user)
})

router.use('/google', require('./google'))
