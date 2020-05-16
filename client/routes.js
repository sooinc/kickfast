import React, {Component} from 'react'
import {connect} from 'react-redux'
import {withRouter, Route, Switch} from 'react-router-dom'
import PropTypes from 'prop-types'

import {me} from './store'
import {Login, Signup, UserHome} from './components'
import ConnectedShop from './pages/Shop'
import ConnectedSingleShop from './pages/SingleShop'
import ConnectedCart from './pages/Cart'
import ConnectedCheckout from './pages/Checkout'

/**
 * COMPONENT
 */
class Routes extends Component {
  componentDidMount() {
    this.props.loadInitialData()
  }

  render() {
    const {isLoggedIn} = this.props
    const guest = !isLoggedIn

    return (
      <Switch>
        {/* Routes placed here are available to all visitors */}
        <Route exact path="/" component={ConnectedShop} />
        <Route exact path="/shop" component={ConnectedShop} />
        <Route exact path="/shop/:proxyId" component={ConnectedSingleShop} />
        <Route exact path="/cart" component={ConnectedCart} />
        <Route exact path="/checkout" component={ConnectedCheckout} />

        {/* Routes for guest visitors only */}
        {guest && <Route path="/login" component={Login} />}
        {guest && <Route path="/signup" component={Signup} />}

        {/* Routes for loggedIn visitors only */}
        {isLoggedIn && (
          <Switch>
            <Route path="/home" component={UserHome} />
          </Switch>
        )}

        {/* Displays our Shop component as a fallback */}
        <Route component={ConnectedShop} />
      </Switch>
    )
  }
}

/**
 * CONTAINER
 */
const mapState = (state) => {
  return {
    // Being 'logged in' for our purposes will be defined has having a state.user that has a truthy id.
    // Otherwise, state.user will be an empty object, and state.user.id will be falsey
    isLoggedIn: !!state.user.id,
  }
}

const mapDispatch = (dispatch) => {
  return {
    loadInitialData() {
      dispatch(me())
    },
  }
}

// The `withRouter` wrapper makes sure that updates are not blocked
// when the url changes
export default withRouter(connect(mapState, mapDispatch)(Routes))

/**
 * PROP TYPES
 */
Routes.propTypes = {
  loadInitialData: PropTypes.func.isRequired,
  isLoggedIn: PropTypes.bool.isRequired,
}
