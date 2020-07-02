import axios from 'axios'
import history from '../history'

/**
 * ACTION TYPES
 */
const GET_USER = 'GET_USER'
const REMOVE_USER = 'REMOVE_USER'

/**
 * ACTION CREATORS
 */
export const getUser = (user, success, error) => ({
  type: GET_USER,
  user,
  success,
  error,
})

export const removeUser = () => ({type: REMOVE_USER})

/**
 * INITIAL STATE
 */
const defaultUser = {
  user: {},
}

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
      return dispatch(getUser(null, null, authError))
    }

    try {
      dispatch(getUser(res.data))
      if (redirect) {
        history.push(redirect)
      } else {
        history.push('/userhome')
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
      return dispatch(getUser(null, null, authError))
    }
    try {
      dispatch(getUser(res.data))
      console.log('inside signup thunk', redirect)
      if (redirect) {
        history.push(redirect)
      } else {
        history.push('/userhome')
      }
    } catch (dispatchOrHistoryErr) {
      console.error(dispatchOrHistoryErr)
    }
  }
}

export const editEmail = (email) => async (dispatch) => {
  let res
  try {
    res = await axios.put(`/auth/edit-email`, {email})
  } catch (authError) {
    return dispatch(getUser(null, null, authError))
  }
  try {
    dispatch(getUser(res.data.user, res.data.message))
  } catch (dispatchOrHistoryErr) {
    console.error(dispatchOrHistoryErr)
  }
}

export const editPassword = (oldPW, newPW, newPW2) => async (dispatch) => {
  let res
  try {
    res = await axios.put(`/auth/edit-password`, {
      oldPW,
      newPW,
      newPW2,
    })
  } catch (authError) {
    return dispatch(getUser(null, null, authError))
  }
  try {
    dispatch(getUser(res.data.user, res.data.message))
  } catch (dispatchOrHistoryErr) {
    console.error(dispatchOrHistoryErr)
  }
}

export const addingIp = (newIp) => {
  return async (dispatch) => {
    try {
      const {data} = await axios.put('/auth/addIp', {newIp})
      dispatch(getUser(data))
    } catch (authError) {
      dispatch(getUser(null, null, authError))
    }
  }
}

export const removingIp = (newIp) => {
  return async (dispatch) => {
    try {
      const {data} = await axios.put('/auth/removeIp', {newIp})
      dispatch(getUser(data))
    } catch (authError) {
      dispatch(getUser(null, null, authError))
    }
  }
}

export const logout = () => async (dispatch) => {
  try {
    await axios.post('/auth/logout')
    dispatch(removeUser())
    history.push('/home')
  } catch (err) {
    console.error(err)
  }
}

export default function (state = defaultUser, action) {
  switch (action.type) {
    case GET_USER:
      if (!action.error) {
        if (!action.success) {
          return {
            ...state,
            user: action.user,
            success: null,
            error: null,
          }
        } else {
          return {
            ...state,
            user: action.user,
            success: action.success,
            error: null,
          }
        }
      } else {
        return {...state, error: action.error, success: null}
      }
    case REMOVE_USER:
      return defaultUser
    default:
      return state
  }
}
