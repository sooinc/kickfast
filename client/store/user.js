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
export const getUser = (user, error) => ({type: GET_USER, user, error})
export const removeUser = () => ({type: REMOVE_USER})

const defaultUser = {}

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
      if (redirect) {
        history.push(redirect)
      } else {
        history.push('/shop')
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
      console.log('inside signup thunk', redirect)
      if (redirect) {
        history.push(redirect)
      } else {
        history.push('/shop')
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
    return dispatch(getUser(null, authError))
  }
  try {
    dispatch(getUser(res.data))
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
    return dispatch(getUser(null, authError))
  }
  try {
    dispatch(getUser(res.data))
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
      dispatch(getUser(null, authError))
    }
  }
}

export const removingIp = (newIp) => {
  return async (dispatch) => {
    try {
      const {data} = await axios.put('/auth/removeIp', {newIp})
      dispatch(getUser(data))
    } catch (authError) {
      dispatch(getUser(null, authError))
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
    history.push('/home')
  } catch (err) {
    console.error(err)
  }
}

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
