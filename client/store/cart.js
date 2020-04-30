import axios from 'axios'

const GOT_CART = 'GOT_CART'
const GOT_ERROR = 'GOT_ERROR'

const gotCart = (products) => ({
  type: GOT_CART,
  products,
})

const gotError = (error, failedAction) => ({
  type: GOT_ERROR,
  error,
  failedAction,
})

export const fetchCart = () => {
  return async (dispatch) => {
    try {
      const {data} = await axios.get('/api/cart')
      dispatch(gotCart(data))
    } catch (err) {
      dispatch(gotError(err, {type: GOT_CART}))
    }
  }
}

export const addToCart = (proxyId, newQty = 1) => {
  return async (dispatch) => {
    try {
      const quantity = {quantity: newQty}
      const {data} = await axios.post(`/api/cart/${proxyId}`, quantity)
      console.log('inside thunk', data)
      dispatch(gotCart(data))
    } catch (err) {
      console.log('not able to add to cart', err)
    }
  }
}

const initialState = {
  status: 'loading',
  products: [],
}

export default function (state = initialState, action) {
  switch (action.type) {
    case GOT_CART:
      return {...state, status: 'done', products: action.products}
    case GOT_ERROR:
      console.log(action.error)
      return {...state, status: 'error'}
    default:
      return state
  }
}
