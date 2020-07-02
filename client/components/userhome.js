import React, {useState} from 'react'
import {connect} from 'react-redux'
import EmailForm from './edit-email-form'
import PasswordForm from './edit-password-form'
import {me} from '../store/user'
import '../css/userhome.css'

import {Button} from '@material-ui/core'

export const UserHome = (props) => {
  const [showEditEmail, setShowEditEmail] = useState(false)
  const [showEditPassword, setShowEditPassword] = useState(false)
  const {name, email, ipAddress} = props.user

  const handleShowEmail = async () => {
    await props.me()
    if (showEditPassword) {
      setShowEditPassword(false)
      setShowEditEmail(true)
    } else if (showEditEmail) {
      setShowEditEmail(false)
    } else {
      setShowEditEmail(true)
    }
  }

  const handleShowPassword = async () => {
    await props.me()
    if (showEditEmail) {
      setShowEditEmail(false)
      setShowEditPassword(true)
    } else if (showEditPassword) {
      setShowEditPassword(false)
    } else {
      setShowEditPassword(true)
    }
  }

  return (
    <div className="userhome">
      <div className="account-info">
        <h1>Welcome, {name}!</h1>
        <h4>Email:&nbsp;{email}</h4>
        <h4>I.P. Address(es):</h4>
        <ul>
          {ipAddress
            ? ipAddress.map((ip) => {
                return <li key={ip}>{ip}</li>
              })
            : 'N/A'}
        </ul>
        <h2>Active Proxy:</h2>
      </div>

      <div className="edit-info">
        <div className="edit-info-buttons">
          <Button variant="outlined" type="button" onClick={handleShowEmail}>
            Edit Email
          </Button>
          <Button variant="outlined" type="button" onClick={handleShowPassword}>
            Edit Password
          </Button>
        </div>
        {showEditEmail ? <EmailForm email={email} /> : null}
        {showEditPassword ? <PasswordForm /> : null}
      </div>
    </div>
  )
}

const mapState = (state) => ({
  user: state.user.user,
})

const mapDispatch = (dispatch) => ({
  me: () => dispatch(me()),
})

export default connect(mapState, mapDispatch)(UserHome)
