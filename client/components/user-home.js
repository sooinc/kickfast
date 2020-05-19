import React from 'react'
import PropTypes from 'prop-types'
import {connect} from 'react-redux'

/**
 * COMPONENT
 */
export const UserHome = (props) => {
  const {name, email, ipAddress} = props.user

  return (
    <div>
      <h2>Welcome, {name || email}!</h2>
      <h4>Email:&nbsp;{email}</h4>

      <h4>IP Addresses:</h4>
      <ul>
        {ipAddress.map((ip, index) => {
          return <li key={index}>{ip}</li>
        })}
      </ul>
    </div>
  )
}

/**
 * CONTAINER
 */
const mapState = (state) => {
  return {
    user: state.user,
  }
}

export default connect(mapState)(UserHome)

/**
 * PROP TYPES
 */
UserHome.propTypes = {
  email: PropTypes.string,
}
