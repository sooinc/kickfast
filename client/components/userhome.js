import React, {useState} from 'react'
import {connect} from 'react-redux'
import EmailForm from './edit-email-form'
import PasswordForm from './edit-password-form'

export const UserHome = (props) => {
  const [showEditEmail, setShowEditEmail] = useState(false)
  const [showEditPassword, setShowEditPassword] = useState(false)
  const {name, email, ipAddress} = props.user

  const handleShowEmail = () => {
    if (showEditPassword) {
      setShowEditPassword(false)
      setShowEditEmail(true)
    } else if (showEditEmail) {
      setShowEditEmail(false)
    } else {
      setShowEditEmail(true)
    }
  }

  const handleShowPassword = () => {
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
    <div>
      <div>
        <h2>Welcome, {name}!</h2>
        <h4>Email:&nbsp;{email}</h4>
        <h4>IP Addresses:</h4>
        <ul>
          {ipAddress
            ? ipAddress.map((ip, index) => {
                return <li key={index}>{ip}</li>
              })
            : null}
        </ul>
      </div>

      <div>
        <button name="Edit" type="button" onClick={handleShowEmail}>
          Edit Email
        </button>
        <button name="Edit" type="button" onClick={handleShowPassword}>
          Edit Password
        </button>

        {showEditEmail ? <EmailForm email={email} /> : null}
        {showEditPassword ? <PasswordForm /> : null}

        <div className="pure-controls">
          {console.log('this is error', props.error)}
          {props.error && props.error.response && (
            <span className="pure-form-message">
              {props.error.response.data}
            </span>
          )}
        </div>
      </div>
    </div>
  )
}

const mapState = (state) => {
  return {
    user: state.user,
    error: state.user.error,
  }
}

export default connect(mapState)(UserHome)
