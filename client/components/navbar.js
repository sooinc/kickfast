import React from 'react'
import PropTypes from 'prop-types'
import {connect} from 'react-redux'
import {Link} from 'react-router-dom'
import {NavHashLink as NavLink} from 'react-router-hash-link'
import CartIcon from './cart-icon'
import {logout} from '../store'
import {fetchCart} from '../store/cart'

const Navbar = ({isLoggedIn, numOfItems, dispatchLogout}) => (
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
            <a href="#" onClick={dispatchLogout}>
              Logout
            </a>
          </div>
          <div className="nav-right-links">
            <Link to="/cart">
              <CartIcon itemCount={numOfItems} />
            </Link>
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
            <Link to="/cart">
              <CartIcon itemCount={numOfItems} />
            </Link>
          </div>
        </div>
      )}
    </div>
  </nav>
)

const totalItemQty = (products) => {
  return products.reduce((sum, currentItem) => {
    return currentItem.orderItem.quantity + sum
  }, 0)
}

const mapState = (state) => {
  return {
    isLoggedIn: !!state.user.user.id,
    numOfItems: totalItemQty(state.cart.products),
  }
}

const mapDispatch = (dispatch) => {
  return {
    dispatchLogout: () => dispatch(logout()),
    fetchCart: () => dispatch(fetchCart()),
  }
}

export default connect(mapState, mapDispatch)(Navbar)

Navbar.propTypes = {
  isLoggedIn: PropTypes.bool.isRequired,
}
