import React from 'react'
import {connect} from 'react-redux'

import CartTile from '../components/cart-tile'
import CheckoutForm from '../components/checkout-form'
import {checkout} from '../store/checkout'
import '../css/checkout.css'

export class Checkout extends React.Component {
  componentDidMount() {
    const {cartItems} = this.props.location.state
    this.props.checkoutDispatch(cartItems)
  }

  total = () => {
    return this.props.location.state.cartItems
      .map((item) => item.price * item.orderItem.quantity)
      .reduce((currTotal, itemTotal) => {
        return currTotal + itemTotal
      }, 0)
  }

  render() {
    const {cartItems} = this.props.location.state
    return (
      <div className="checkout">
        <div className="checkout-form">
          <CheckoutForm clientSecret={this.props.clientSecret} />
        </div>
        <div className="cart-items">
          {cartItems.map((item) => (
            <CartTile item={item} showControls={false} key={item.id} />
          ))}
          <h2>Total</h2>
          <p>{this.total().toFixed(2)}</p>
        </div>
      </div>
    )
  }
}

const stateToProps = (state) => ({
  clientSecret: state.checkout.secret,
})

const dispatchToProps = (dispatch) => ({
  checkoutDispatch: (cartItems) => dispatch(checkout(cartItems)),
})

const ConnectedCheckout = connect(stateToProps, dispatchToProps)(Checkout)

export default ConnectedCheckout
