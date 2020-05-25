import axios from 'axios'
import history from '../history'

const CLIENT_SECRET = 'CLIENT_SECRET'
const CONFIRMATION = 'CONFIRMATION'
const GOT_ERROR = 'GOT_ERROR'

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

const options = {
  headers: {
    'Content-Type': 'application/json',
  },
}

export const checkout = () => {
  return async (dispatch) => {
    try {
      const {data} = await axios.post('/api/checkout', options)
      dispatch(clientSecret(data.clientSecret))
      console.log('this is clientsecret in thunk', data.clientSecret)
    } catch (err) {
      dispatch(gotError(err, {type: CLIENT_SECRET}))
    }
  }
}

export const getConfirmation = (
  newIp,
  billingEmail,
  redirect = '/confirmation'
) => {
  return async (dispatch) => {
    try {
      const {data} = await axios.post('/api/checkout/confirmation', {
        newIp,
        billingEmail,
      })
      dispatch(confirmation(data))
      history.push(redirect)
    } catch (err) {
      dispatch(gotError(err, {type: CONFIRMATION}))
    }
  }
}

export const getConfirmedOrder = () => {
  return async (dispatch) => {
    try {
      const {data} = await axios.get('/api/checkout/confirmation')
      dispatch(confirmation(data))
    } catch (err) {
      dispatch(gotError(err, {type: CONFIRMATION}))
    }
  }
}

const initialState = {
  secret: '',
  confirmedOrder: {},
  status: 'loading',
}

export default function (state = initialState, action) {
  switch (action.type) {
    case CLIENT_SECRET:
      return {...state, secret: action.secret, status: 'done'}
    case CONFIRMATION:
      return {
        ...state,
        confirmedOrder: action.confirmedOrder,
        status: 'done',
      }
    case GOT_ERROR:
      console.log(action.error)
      return {...state, status: 'error', error: action.error}
    default:
      return state
  }
}
