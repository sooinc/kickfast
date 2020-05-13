import axios from 'axios'

const CLIENT_SECRET = 'CLIENT_SECRET'

const clientSecret = (secret) => ({
  type: CLIENT_SECRET,
  secret,
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
      console.log('not able to load clientSecret')
    }
  }
}

const initialState = {
  secret: '',
}

export default function (state = initialState, action) {
  switch (action.type) {
    case CLIENT_SECRET:
      return {...state, secret: action.secret}
    default:
      return state
  }
}
