const Sequelize = require('sequelize')
const db = require('../db')
const crypto = require('crypto')
const validator = require('validator')

const User = db.define('user', {
  email: {
    type: Sequelize.STRING,
    unique: true,
    allowNull: false,
    notEmpty: true,
    validate: {
      isEmail: true,
    },
    set(email) {
      this.setDataValue('email', email.toLowerCase())
    },
  },
  password: {
    type: Sequelize.STRING,
    allowNull: false,
    notEmpty: true,
    // Making `.password` act like a func hides it when serializing to JSON.
    // This is a hack to get around Sequelize's lack of a "private" option.
    get() {
      return () => this.getDataValue('password')
    },
  },
  salt: {
    type: Sequelize.STRING,
    // Making `.salt` act like a function hides it when serializing to JSON.
    // This is a hack to get around Sequelize's lack of a "private" option.
    get() {
      return () => this.getDataValue('salt')
    },
  },
  name: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  ipAddress: {
    type: Sequelize.ARRAY(Sequelize.STRING),
    validate: {
      isValidIp4: function (value) {
        console.log('inside validator', value)
        let values = Array.isArray(value) ? value : [value]

        values.forEach(function (val) {
          if (!validator.isIP(val, '4')) {
            throw new Error('This is not a valid IPv4 address')
          }
        })
        return value
      },
    },
  },
  role: {
    type: Sequelize.ENUM(['admin', 'user']),
    allowNull: false,
    defaultValue: 'user',
  },
  // googleId: {
  //   type: Sequelize.STRING
  // }
})

module.exports = User

/**
 * instanceMethods
 */

//user's pending cart
User.prototype.getCart = function (options = {}) {
  const Order = db.model('order')
  const mergedOptions = {
    ...options,
    where: {
      ...(options.where || {}),
      ...{status: 'pending', userId: this.id},
    },
  }
  return Order.findOne(mergedOptions)
}

User.prototype.getOrCreateUserCart = async function () {
  const Order = db.model('order')
  const [cart] = await Order.findOrCreate({
    where: {userId: this.id, status: 'pending'},
  })
  return cart
}

User.prototype.correctPassword = function (candidatePwd) {
  return User.encryptPassword(candidatePwd, this.salt()) === this.password()
}

/**
 * classMethods
 */
User.generateSalt = function () {
  return crypto.randomBytes(16).toString('base64')
}

User.encryptPassword = function (plainText, salt) {
  return crypto
    .createHash('RSA-SHA256')
    .update(plainText)
    .update(salt)
    .digest('hex')
}

/**
 * hooks
 */
const setSaltAndPassword = (user) => {
  if (user.changed('password')) {
    user.salt = User.generateSalt()
    user.password = User.encryptPassword(user.password(), user.salt())
  }
}

User.beforeCreate(setSaltAndPassword)
User.beforeUpdate(setSaltAndPassword)
User.beforeBulkCreate((users) => {
  users.forEach(setSaltAndPassword)
})
