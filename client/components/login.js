import React from 'react'
import {connect} from 'react-redux'
import {login} from '../store/user'
import {fetchCart} from '../store/cart'

/**
 * COMPONENT
 */
const Login = (props) => {
  const {error} = props

  const handleSubmit = async (event) => {
    event.preventDefault()
    const email = event.target.email.value
    const password = event.target.password.value
    const path = props.location.state ? `/${props.location.state.from}` : null
    await props.login(email, password, path)
    await props.fetchCart()
    // dispatch(login(email, password)).then(() => dispatch(fetchCart()))
  }

  return (
    <div>
      <form
        className="pure-form pure-form-aligned"
        onSubmit={handleSubmit}
        name="login"
      >
        <fieldset>
          <div className="pure-control-group">
            <label htmlFor="email">Email</label>
            <input name="email" type="text" />
          </div>
          <div className="pure-control-group">
            <label htmlFor="password">Password</label>
            <input name="password" type="password" />
          </div>
          <div className="pure-controls">
            <button className="pure-button button-primary" type="submit">
              Log In
            </button>
          </div>
          <div className="pure-controls">
            {error && error.response && (
              <span className="pure-form-message">{error.response.data}</span>
            )}
          </div>
        </fieldset>
      </form>
    </div>
  )
}

const mapState = (state) => {
  return {
    error: state.user.error,
  }
}

const mapDispatch = (dispatch) => ({
  login: (email, password, path) => dispatch(login(email, password, path)),
  fetchCart: () => dispatch(fetchCart()),
})

export const ConnectedLogin = connect(mapState, mapDispatch)(Login)

export default ConnectedLogin
