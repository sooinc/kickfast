import React from 'react'
import {connect} from 'react-redux'
import {Link} from 'react-router-dom'
import {ElementsConsumer} from '@stripe/react-stripe-js'

import {fetchCart} from '../store/cart'
import {checkout} from '../store/checkout'
import CartTile from '../components/cart-tile'
import CheckoutForm from '../components/checkout-form'
import '../css/checkout.css'

export class Checkout extends React.Component {
  componentDidMount() {
    // const {cartItems} = this.props.location.state
    this.props.fetchCartDispatch()
    this.props.checkoutDispatch()
  }

  total = () => {
    // return this.props.location.state.cartItems
    return this.props.cartItems
      .map((item) => item.price * item.orderItem.quantity)
      .reduce((currTotal, itemTotal) => {
        return currTotal + itemTotal
      }, 0)
  }

  render() {
    // const {cartItems} = this.props.location.state
    const {cartItems, error} = this.props
    const {ipAddress} = this.props.user
    return (
      <div className="checkout">
        <div className="checkout-form">
          <ElementsConsumer>
            {({elements, stripe}) => (
              <CheckoutForm
                elements={elements}
                stripe={stripe}
                userIp={ipAddress}
                clientSecret={this.props.clientSecret}
              />
            )}
          </ElementsConsumer>
          {/* <div className="pure-controls">
            {console.log('this is error', error)}
            {error && error.response && (
              <span className="pure-form-message">{error.response.data}</span>
            )}
          </div> */}
        </div>
        <div className="checkout-items">
          <h2>Order Summary.</h2>
          {cartItems
            ? cartItems.map((item) => (
                <CartTile item={item} showControls={false} key={item.id} />
              ))
            : null}
          <div className="checkout-items-total">
            <h2>Total.</h2>
            <p className="checkout-items-totalprice">
              ${this.total().toFixed(2)}
            </p>
          </div>

          <Link className="checkout-items-backBtn" to="/cart">
            Back
          </Link>
        </div>
      </div>
    )
  }
}

const stateToProps = (state) => ({
  user: state.user.user,
  clientSecret: state.checkout.secret,
  cartItems: state.cart.products,
  error: state.checkout.error,
})

const dispatchToProps = (dispatch) => ({
  fetchCartDispatch: () => dispatch(fetchCart()),
  checkoutDispatch: () => dispatch(checkout()),
})

const ConnectedCheckout = connect(stateToProps, dispatchToProps)(Checkout)

export default ConnectedCheckout
