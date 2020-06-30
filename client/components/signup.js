/* eslint-disable complexity */
import React from 'react'
import {connect} from 'react-redux'
import useForm from './form-validation/useForm-valChange'
import {validateSignup} from './form-validation/auth-form-errors'
import {signup} from '../store/user'
import '../css/autho.css'

import TextField from '@material-ui/core/TextField'
import {Button} from '@material-ui/core'

const Signup = (props) => {
  const {values, errors, isDisabled, handleChange} = useForm(validateSignup)
  const {error} = props
  console.log(props.location.state)

  const handleSubmit = (event) => {
    event.preventDefault()
    const name = event.target.name.value
    const email = event.target.email.value
    const password = event.target.password.value
    const path = props.location.state ? `/${props.location.state.from}` : null
    props.signup(name, email, password, path)
  }

  return (
    <div className="autho-container">
      <form className="autho-form" onSubmit={handleSubmit} name="signup">
        <h2>Create an Account.</h2>
        <div className="pure-control-group">
          <TextField
            fullWidth
            id="outlined-size-normal"
            variant="outlined"
            margin="normal"
            label="Name"
            name="name"
            type="text"
            value={values.name || ''}
            onChange={handleChange}
          />
          {errors.name && <p className="error-message">{errors.name}</p>}
        </div>
        <div className="pure-control-group">
          <TextField
            fullWidth
            id="outlined-size-normal"
            variant="outlined"
            margin="normal"
            label="Email"
            name="email"
            type="text"
            value={values.email || ''}
            onChange={handleChange}
          />
          {errors.email && <p className="error-message">{errors.email}</p>}
        </div>
        <div className="pure-control-group">
          <TextField
            fullWidth
            id="outlined-size-normal"
            variant="outlined"
            margin="normal"
            label="Password"
            name="password"
            type="password"
            value={values.password || ''}
            onChange={handleChange}
          />
          {errors.password && (
            <p className="error-message">{errors.password}</p>
          )}
        </div>
        <div className="autho-button">
          <Button
            variant="outlined"
            size="large"
            type="submit"
            disabled={isDisabled || false}
          >
            Sign Up
          </Button>
        </div>
        <div className="pure-controls">
          {error && error.response && (
            <span className="error-message">{error.response.data}</span>
          )}
        </div>
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
  signup: (name, email, password, path) =>
    dispatch(signup(name, email, password, path)),
})

export const ConnectedSignup = connect(mapState, mapDispatch)(Signup)

export default ConnectedSignup
