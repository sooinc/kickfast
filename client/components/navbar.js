import React from 'react'
import PropTypes from 'prop-types'
import {connect} from 'react-redux'
import {Link} from 'react-router-dom'
import {NavHashLink as NavLink} from 'react-router-hash-link'
import {logout} from '../store'

const Navbar = ({handleClick, isLoggedIn}) => (
  <nav>
    <div className="nav-left">
      <div className="nav-left-header">
        <NavLink to="/shop">KickFast</NavLink>
      </div>
    </div>
    <div className="nav-right">
      {isLoggedIn ? (
        <div className="nav-right">
          {/* The navbar will show these links after you log in */}
          <div className="nav-right-links">
            <NavLink to="/shop#shop">Shop</NavLink>
          </div>
          <div className="nav-right-links">
            <Link to="/userhome">Account</Link>
          </div>
          <div className="nav-right-links">
            <a href="#" onClick={handleClick}>
              Logout
            </a>
          </div>
          <div className="nav-right-links">
            <Link to="/cart">Cart</Link>
          </div>
        </div>
      ) : (
        <div className="nav-right">
          {/* The navbar will show these links before you log in */}
          <div className="nav-right-links">
            <NavLink to="/shop#shop">Shop</NavLink>
          </div>
          <div className="nav-right-links">
            <Link to="/signup">Signup</Link>
          </div>
          <div className="nav-right-links">
            <Link to="/login">Login</Link>
          </div>
          <div className="nav-right-links">
            <Link to="/cart">Cart</Link>
          </div>
        </div>
      )}
    </div>
  </nav>
)

/**
 * CONTAINER
 */
const mapState = (state) => {
  return {
    isLoggedIn: !!state.user.user.id,
  }
}

const mapDispatch = (dispatch) => {
  return {
    handleClick() {
      dispatch(logout())
    },
  }
}

export default connect(mapState, mapDispatch)(Navbar)

/**
 * PROP TYPES
 */
Navbar.propTypes = {
  handleClick: PropTypes.func.isRequired,
  isLoggedIn: PropTypes.bool.isRequired,
}
