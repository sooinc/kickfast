const path = require('path')
const express = require('express')
const morgan = require('morgan')
const compression = require('compression')
const session = require('express-session')
const passport = require('passport')
const SequelizeStore = require('connect-session-sequelize')(session.Store)
const db = require('./db')
const sessionStore = new SequelizeStore({db})
// const PORT = process.env.PORT || 8888
const app = express()
module.exports = app

// This is a global Mocha hook, used for resource cleanup.
// Otherwise, Mocha v4+ never quits after tests.
if (process.env.NODE_ENV === 'test') {
  after('close the session store', () => sessionStore.stopExpiringSessions())
}

// passport registration
passport.serializeUser((user, done) => done(null, user.id))

passport.deserializeUser(async (id, done) => {
  try {
    const user = await db.models.user.findByPk(id)
    done(null, user)
  } catch (err) {
    done(err)
  }
})

const createApp = (sessionSecret) => {
  // logging middleware
  app.use(morgan('dev'))

  // body parsing middleware
  app.use(express.json())
  app.use(express.urlencoded({extended: true}))

  // compression middleware
  app.use(compression())

  // session middleware with passport
  app.use(
    session({
      secret: sessionSecret,
      store: sessionStore,
      resave: false,
      saveUninitialized: false,
    })
  )
  app.use(passport.initialize())
  app.use(passport.session())

  // auth and api routes
  app.use('/auth', require('./auth'))
  app.use('/api', require('./api'))

  // static file-serving middleware
  app.use(express.static(path.join(__dirname, '..', 'public')))

  // any remaining requests with an extension (.js, .css, etc.) send 404
  app.use((req, res, next) => {
    if (path.extname(req.path).length) {
      const err = new Error('Not found')
      err.status = 404
      next(err)
    } else {
      next()
    }
  })

  // sends index.html
  app.use('*', (req, res) => {
    res.sendFile(path.join(__dirname, '..', 'public/index.html'))
  })

  // error handling endware
  app.use((err, req, res, next) => {
    console.error(err)
    console.error(err.stack)
    res.status(err.status || 500).send(err.message || 'Internal server error.')
  })
}

const startListening = (port) => {
  // start listening (and create a 'server' object representing our server)
  const server = app.listen(port, () =>
    console.log(`Mixing it up on port

     http://localhost:${port}

     `)
  )
}

const syncDb = () => db.sync()

async function bootApp(sessionSecret, port) {
  await sessionStore.sync()
  await syncDb()
  await createApp(sessionSecret)
  await startListening(port)
}

// This evaluates as true when this file is run directly from the command line,
// i.e. when we say 'node server/index.js' (or 'nodemon server/index.js', or 'nodemon server', etc)
// It will evaluate false when this module is required by another module - for example,
// if we wanted to require our app in a test spec
// if (require.main === module) {
//   bootApp()
// } else {
//   createApp()
// }

if (process.env.NODE_ENV !== 'production') {
  const {
    sessionSecret,
    port,
    databaseURL,
    stripeSK,
    stripePK,
    saveSecret,
  } = require('../secrets')
  saveSecret('sessionSecret', sessionSecret)
  saveSecret('port', port)
  saveSecret('databaseURL', databaseURL)
  saveSecret('stripePK', stripePK)
  saveSecret('stripeSK', stripeSK)
  if (require.main === module) {
    bootApp(sessionSecret, port)
  } else {
    createApp(sessionSecret)
  }
} else {
  const {getSecret} = require('../fetchSecrets')
  if (require.main === module) {
    Promise.all([
      getSecret(`/kickfast/sessionSecret`),
      getSecret(`/kickfast/port`),
    ]).then((values) => {
      bootApp(values[0], values[1])
    })
  } else {
    getSecret(`/kickfast/sessionSecret`).then((value) => {
      createApp(value)
    })
  }
}
