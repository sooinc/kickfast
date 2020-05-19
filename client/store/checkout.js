import axios from 'axios'
import history from '../history'

const CLIENT_SECRET = 'CLIENT_SECRET'
const CONFIRMATION = 'CONFIRMATION'
const GOT_ERROR = 'GOT_ERROR'
const GOT_EMAIL = 'GOT_EMAIL'
const GOT_IP = 'GOT_IP'

const clientSecret = (secret) => ({
  type: CLIENT_SECRET,
  secret,
})

const confirmation = (confirmedOrder) => ({
  type: CONFIRMATION,
  confirmedOrder,
})

const gotError = (error, failedAction) => ({
  type: GOT_ERROR,
  error,
  failedAction,
})

const gotEmail = (billingEmail) => ({
  type: GOT_EMAIL,
  billingEmail,
})

const gotIp = (ip) => ({
  type: GOT_IP,
  ip,
})

const options = {
  headers: {
    'Content-Type': 'application/json',
  },
}

export const checkout = (cartItems) => {
  return async (dispatch) => {
    try {
      console.log('inside thunk', cartItems)
      const {data} = await axios.post('/api/checkout', {cartItems}, options)
      dispatch(clientSecret(data.clientSecret))
      console.log('this is clientsecret in thunk', data.clientSecret)
    } catch (err) {
      dispatch(gotError(err, {type: CLIENT_SECRET}))
    }
  }
}

export const getConfirmation = (ip, redirect = '/confirmation') => {
  return async (dispatch) => {
    try {
      const newIp = {newIp: ip}
      console.log('in thunk newIP', newIp)
      const {data} = await axios.post('/api/checkout/confirmation', newIp)
      dispatch(confirmation(data))
      history.push(redirect)
    } catch (err) {
      dispatch(gotError(err, {type: CONFIRMATION}))
    }
  }
}

export const orderDetails = (email, ip) => {
  return (dispatch) => {
    try {
      dispatch(gotEmail(email))
      dispatch(gotIp(ip))
    } catch (err) {
      console.log('something went wrong getting billing email')
    }
  }
}

const initialState = {
  secret: '',
  confirmedOrder: {},
  status: 'loading',
  billingEmail: '',
  ip: '',
}

export default function (state = initialState, action) {
  switch (action.type) {
    case CLIENT_SECRET:
      return {...state, secret: action.secret, status: 'done'}
    case CONFIRMATION:
      return {...state, confirmedOrder: action.confirmedOrder, status: 'done'}
    case GOT_ERROR:
      console.log(action.error)
      return {...state, status: 'error'}
    case GOT_EMAIL:
      return {...state, billingEmail: action.billingEmail}
    case GOT_IP:
      return {...state, ip: action.ip}
    default:
      return state
  }
}
