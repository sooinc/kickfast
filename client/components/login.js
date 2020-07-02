import React from 'react'
import {connect} from 'react-redux'
import {login} from '../store/user'
import {fetchCart} from '../store/cart'
import '../css/autho.css'

import TextField from '@material-ui/core/TextField'
import {Button} from '@material-ui/core'

const Login = (props) => {
  const {error} = props

  const handleSubmit = async (event) => {
    event.preventDefault()
    const email = event.target.email.value
    const password = event.target.password.value
    const path = props.location.state ? `/${props.location.state.from}` : null
    await props.login(email, password, path)
    await props.fetchCart()
  }

  return (
    <div className="autho-container">
      <form className="autho-form" onSubmit={handleSubmit} name="login">
        <h2>Welcome Back!</h2>
        <div className="pure-controls">
          {error && error.response.data.includes('Wrong') && (
            <span className="error-message">{error.response.data}</span>
          )}
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
          />
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
          />
        </div>
        <div className="autho-button">
          <Button variant="outlined" size="large" type="submit">
            Login
          </Button>
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
  login: (email, password, path) => dispatch(login(email, password, path)),
  fetchCart: () => dispatch(fetchCart()),
})

export const ConnectedLogin = connect(mapState, mapDispatch)(Login)

export default ConnectedLogin
