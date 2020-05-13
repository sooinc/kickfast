import React from 'react'
import {Navbar} from './components'
import Routes from './routes'

import {loadStripe} from '@stripe/stripe-js'
import {Elements} from '@stripe/react-stripe-js'
import {stripePK} from '../secrets'
import './css/app.css'

const promise = loadStripe(stripePK)

const App = () => {
  return (
    <div>
      <Elements stripe={promise}>
        <Navbar />
        <Routes />
      </Elements>
    </div>
  )
}

export default App
