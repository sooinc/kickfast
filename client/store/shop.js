import axios from 'axios'

const GOT_ALL_PROXY = 'GOT_ALL_PROXY'
const GOT_SINGLE_PROXY = 'GOT_SINGLE_PROXY'
const GOT_ERROR = 'GOT_ERROR'

const gotAllProxy = (proxies) => ({
  type: GOT_ALL_PROXY,
  proxies,
})

const gotSingleProxy = (singleProxy) => ({
  type: GOT_SINGLE_PROXY,
  singleProxy,
})

const gotError = (error, failedAction) => ({
  type: GOT_ERROR,
  error,
  failedAction,
})

export const fetchAllProxy = () => {
  return async (dispatch) => {
    try {
      const {data} = await axios.get(`/api/shop`)
      dispatch(gotAllProxy(data))
    } catch (err) {
      dispatch(err, {type: GOT_ALL_PROXY})
    }
  }
}

export const fetchSingleProxy = (proxyId) => {
  return async (dispatch) => {
    try {
      const {data} = await axios.get(`/api/shop/${proxyId}`)
      dispatch(gotSingleProxy(data))
    } catch (err) {
      dispatch(gotError(err, {type: GOT_SINGLE_PROXY}))
    }
  }
}

const initialState = {
  status: 'loading',
  proxies: {},
  singleProxy: {},
}

export const proxyReducer = (state = initialState, action) => {
  switch (action.type) {
    case GOT_ALL_PROXY:
      return {
        ...state,
        status: 'done',
        proxies: action.proxies,
      }
    case GOT_SINGLE_PROXY:
      return {
        ...state,
        status: 'done',
        singleProxy: action.singleProxy,
      }
    case GOT_ERROR:
      console.log(action.error)
      return {...status, status: 'error'}
    default:
      return state
  }
}
