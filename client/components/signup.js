/* eslint-disable complexity */
import React from 'react'
import {connect} from 'react-redux'
import {signup} from '../store/user'
import useForm from './form-validation/useForm-valChange'
import {validateSignup} from './form-validation/auth-form-errors'

/**
 * COMPONENT
 */
const Signup = (props) => {
  const {values, errors, isDisabled, handleChange} = useForm(validateSignup)
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
            <input
              name="name"
              type="text"
              value={values.name || ''}
              onChange={handleChange}
            />
            {errors.name && <p className="error-message">{errors.name}</p>}
          </div>
          <div className="pure-control-group">
            <label htmlFor="email">Email</label>
            <input
              name="email"
              type="text"
              value={values.email || ''}
              onChange={handleChange}
            />
            {errors.email && <p className="error-message">{errors.email}</p>}
          </div>
          <div className="pure-control-group">
            <label htmlFor="password">Password</label>
            <input
              name="password"
              type="password"
              value={values.password || ''}
              onChange={handleChange}
            />
            {errors.password && (
              <p className="error-message">{errors.password}</p>
            )}
          </div>
          <div className="pure-controls">
            <button
              className="pure-button button-primary"
              type="submit"
              disabled={isDisabled || false}
            >
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
