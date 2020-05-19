import React from 'react'
import {connect} from 'react-redux'
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
    const {cartItems} = this.props
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
        </div>
        <div className="cart-items">
          {cartItems
            ? cartItems.map((item) => (
                <CartTile item={item} showControls={false} key={item.id} />
              ))
            : null}
          <h2>Total</h2>
          <p>{this.total().toFixed(2)}</p>
        </div>
      </div>
    )
  }
}

const stateToProps = (state) => ({
  user: state.user,
  clientSecret: state.checkout.secret,
  cartItems: state.cart.products,
})

const dispatchToProps = (dispatch) => ({
  fetchCartDispatch: () => dispatch(fetchCart()),
  checkoutDispatch: () => dispatch(checkout()),
})

const ConnectedCheckout = connect(stateToProps, dispatchToProps)(Checkout)

export default ConnectedCheckout
