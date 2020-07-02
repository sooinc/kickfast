import React, {useState} from 'react'
import {connect} from 'react-redux'
import EmailForm from './edit-email-form'
import PasswordForm from './edit-password-form'
import {me} from '../store/user'
import ProgressBar from './progress-bar'
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
        <h4>Email:&nbsp;&nbsp;{email}</h4>
        <div className="ip-info">
          <h4>I.P. Address(es):</h4>
          <div className="ip-list-info">
            {ipAddress
              ? ipAddress.map((ip) => {
                  return <p key={ip}>- {ip}</p>
                })
              : 'N/A'}
          </div>
        </div>
        <h2 className="proxy-info">Active Proxy</h2>
        <h3>1 Gig - 30 days: &nbsp;&nbsp;65% complete</h3>
        <ProgressBar width={500} percent={0.65} />
        <h5>Expires: 8/29/20</h5>
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
