import React from 'react'
import {connect} from 'react-redux'
import {signup} from '../store/user'

/**
 * COMPONENT
 */
const Signup = (props) => {
  const {handleSubmit, error} = props

  return (
    <div>
      <form
        className="pure-form pure-form-aligned"
        onSubmit={handleSubmit}
        name="signup"
      >
        <fieldset>
          <div className="pure-control-group">
            <label htmlFor="name">Name</label>
            <input name="name" type="text" />
          </div>
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
              Sign Up
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

const mapDispatch = (dispatch) => {
  return {
    handleSubmit(evt) {
      evt.preventDefault()
      const name = evt.target.name.value
      const email = evt.target.email.value
      const password = evt.target.password.value
      dispatch(signup(name, email, password))
    },
  }
}

export const ConnectedSignup = connect(mapState, mapDispatch)(Signup)

export default ConnectedSignup
