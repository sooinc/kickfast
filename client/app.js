import React from 'react'
import {Navbar} from './components'
import Footer from './components/footer'
import Routes from './routes'
import './css/app.css'

import {getSecret} from '../fetchSecrets'
import {stripePK} from '../secrets'
import {loadStripe} from '@stripe/stripe-js'
import {Elements} from '@stripe/react-stripe-js'

const promise = loadStripe(stripePK)

const App = () => {
  // // let promise
  // getSecret(`/kickfast/stripePK`).then((value) => {
  //   console.log(value)
  //   // promise = loadStripe(value)
  // })
  return (
    <Elements stripe={promise}>
      <Navbar />
      <Routes />
      <Footer />
    </Elements>
  )
}

export default App
