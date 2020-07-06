const router = require('express').Router()
const {saveToUser} = require('../util')
const User = require('../db/models/user')
module.exports = router

router.post('/login', async (req, res, next) => {
  try {
    const user = await User.findOne({
      where: {email: req.body.email.toLowerCase()},
    })
    if (!user) {
      console.log('No such email found:', req.body.email)
      res.status(401).send('Wrong email and/or password')
    } else if (!user.correctPassword(req.body.password)) {
      console.log('Incorrect password for user:', req.body.email)
      res.status(401).send('Wrong email and/or password')
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
      saveToUser(req)
    }
  } catch (err) {
    if (err.name === 'SequelizeUniqueConstraintError') {
      res.status(401).send('Update Failed: User already exists in system.')
    } else if (err.name === 'SequelizeValidationError') {
      res.status(401).send('Update Failed: Email is not a valid email.')
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
      res.status(401).send('Same as current email.')
    } else {
      await user.update({email: newEmail})
      // res.status(201).send(user)
      res
        .status(201)
        .send({user: user, message: 'Email has been successfully updated!'})
    }
  } catch (err) {
    console.log('this is err name', err.name)
    if (err.name === 'SequelizeUniqueConstraintError') {
      res.status(401).send('Update Failed: User is already exists in system.')
    } else if (err.name === 'SequelizeValidationError') {
      res.status(401).send('Update Failed: Email is not a valid email.')
    } else {
      next(err)
    }
  }
})

router.put('/edit-password', async (req, res, next) => {
  try {
    const oldPW = req.body.oldPW
    const newPW = req.body.newPW
    const newPW2 = req.body.newPW2
    const user = await User.findByPk(req.user.id)

    if (user.correctPassword(oldPW)) {
      if (newPW.length >= 6 && newPW === newPW2) {
        await user.update({password: newPW})
        res.status(201).send({
          user: user,
          message: 'Password has been successfully updated!',
        })
      } else {
        res.status(401).send('Update Failed: Something went wrong.')
      }
    } else {
      res.status(401).send('Update Failed: Incorrect password entered.')
    }
  } catch (err) {
    next(err)
  }
})

//add IP to user or send err
router.put('/addIp', async (req, res, next) => {
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
      res.status(202).send(user) //'IP has been added to user profile.'
      return
    }

    if (user.ipAddress.includes(newIp)) {
      res.status(202).send(user) //'Existing IP.'
    } else if (user.ipAddress.length < 3) {
      await user.update({
        ipAddress: [...user.ipAddress, newIp],
      })
      res.status(202).send(user) //'IP has been added to user profile.'
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

    console.log('IP to remove:', newIp)
    console.log('Current user.ipAddress:', user.ipAddress)

    let finalIp = user.ipAddress.filter((ip) => {
      return ip !== newIp
    })

    console.log('Final user.ipAddress:', finalIp)

    await user.update({
      ipAddress: finalIp,
    })
    res.status(201).send(user)
  } catch (err) {
    next(err)
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
