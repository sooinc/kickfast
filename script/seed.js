'use strict'

const db = require('../server/db')
const {User, Proxy, Order, OrderItem} = require('../server/db/models')

async function seed() {
  await db.sync({force: true})
  console.log('db synced!')

  const users = await Promise.all([
    User.create({
      email: 'gavin@gmail.com',
      password: '123',
      name: 'Gavin Li',
      ipAddress: ['72.111.155.60'],
      role: 'user',
    }),
    User.create({
      email: 'sooin@gmail.com',
      password: '123',
      name: 'Sooin Chung',
      ipAddress: ['70.123.456.78', '23.435.656.66', '353.566.777.77'],
      role: 'admin',
    }),
  ])

  const proxies = await Promise.all([
    Proxy.create({
      name: '1GB - 1 Month',
      description: '1 GB available for 30 days',
      subscriptionDays: 30,
      dataAllowance: 1,
      proxyStatus: 'inactive',
      price: 99.99,
    }),
    Proxy.create({
      name: '1GB - 1 Week',
      description: '1 GB available for 7 days',
      subscriptionDays: 7,
      dataAllowance: 1,
      proxyStatus: 'inactive',
      price: 49.99,
    }),
    Proxy.create({
      name: '1GB - 1 Day',
      description: '1 GB available for 1 day',
      subscriptionDays: 1,
      dataAllowance: 1,
      proxyStatus: 'inactive',
      price: 24.99,
    }),
  ])

  const orders = await Promise.all([
    Order.create({status: 'pending', userId: 1}),
    Order.create({status: 'fulfilled', userId: 1}),
    Order.create({status: 'pending', userId: 2}),
    Order.create({status: 'fulfilled', userId: 2}),
  ])

  const orderItems = await Promise.all([
    OrderItem.create({orderId: 1, proxyId: 1}),
    OrderItem.create({orderId: 1, proxyId: 2}),
    OrderItem.create({orderId: 2, proxyId: 1}),
    OrderItem.create({orderId: 3, proxyId: 2}),
    OrderItem.create({orderId: 3, proxyId: 3}),
    OrderItem.create({orderId: 4, proxyId: 2}),
  ])

  console.log(`seeded ${users.length} users`)
  console.log(`seeded successfully`)
}

// We've separated the `seed` function from the `runSeed` function.
// This way we can isolate the error handling and exit trapping.
// The `seed` function is concerned only with modifying the database.
async function runSeed() {
  console.log('seeding...')
  try {
    await seed()
  } catch (err) {
    console.error(err)
    process.exitCode = 1
  } finally {
    console.log('closing db connection')
    await db.close()
    console.log('db connection closed')
  }
}

// Execute the `seed` function, IF we ran this module directly (`node seed`).
// `Async` functions always return a promise, so we can use `catch` to handle
// any errors that might occur inside of `seed`.
if (module === require.main) {
  runSeed()
}

// we export the seed function for testing purposes (see `./seed.spec.js`)
module.exports = seed
