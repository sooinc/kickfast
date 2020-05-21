import axios from 'axios'
import history from '../history'

/**
 * ACTION TYPES
 */
const GET_USER = 'GET_USER'
const REMOVE_USER = 'REMOVE_USER'

/**
 * INITIAL STATE
 */
const defaultUser = {}

/**
 * ACTION CREATORS
 */
const getUser = (user, error) => ({type: GET_USER, user, error})
const removeUser = () => ({type: REMOVE_USER})

/**
 * THUNK CREATORS
 */
export const me = () => async (dispatch) => {
  try {
    const res = await axios.get('/auth/me')
    dispatch(getUser(res.data || defaultUser))
  } catch (err) {
    console.error(err)
  }
}

export const login = (email, password, redirect = null) => {
  return async (dispatch) => {
    let res
    try {
      res = await axios.post(`/auth/login`, {email, password})
    } catch (authError) {
      return dispatch(getUser(null, authError))
    }

    try {
      dispatch(getUser(res.data))
      history.goBack()
      if (redirect) {
        history.push(redirect)
      }
    } catch (dispatchOrHistoryErr) {
      console.error(dispatchOrHistoryErr)
    }
  }
}

export const signup = (name, email, password, redirect = null) => {
  return async (dispatch) => {
    let res
    try {
      res = await axios.post(`/auth/signup`, {name, email, password})
    } catch (authError) {
      return dispatch(getUser(null, authError))
    }
    try {
      dispatch(getUser(res.data))
      history.goBack()
      if (redirect) {
        history.push(redirect)
      }
    } catch (dispatchOrHistoryErr) {
      console.error(dispatchOrHistoryErr)
    }
  }
}

// export const auth = (email, password, method) => async dispatch => {
//   let res
//   try {
//     res = await axios.post(`/auth/${method}`, {email, password})
//   } catch (authError) {
//     return dispatch(getUser({error: authError}))
//   }

//   try {
//     dispatch(getUser(res.data))
//     history.push('/home')
//   } catch (dispatchOrHistoryErr) {
//     console.error(dispatchOrHistoryErr)
//   }
// }

export const logout = () => async (dispatch) => {
  try {
    await axios.post('/auth/logout')
    dispatch(removeUser())
    history.push('/login')
  } catch (err) {
    console.error(err)
  }
}

/**
 * REDUCER
 */
export default function (state = defaultUser, action) {
  switch (action.type) {
    case GET_USER:
      if (!action.error) {
        return action.user
      } else {
        return {...state, error: action.error}
      }
    case REMOVE_USER:
      return defaultUser
    default:
      return state
  }
}
