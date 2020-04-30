import React from 'react'
import {connect} from 'react-redux'

import {fetchCart} from '../store/cart'

export class Cart extends React.Component {
  componentDidMount() {
    this.props.fetchCartDispatch()
  }

  render() {
    const {cartItems} = this.props
    switch (this.props.status) {
      case 'loading':
        return <div>loading...</div>
      case 'error':
        return <div>Couldn't load products. Please try again later.</div>
      case 'done':
        if (cartItems.length > 0) {
          return (
            <div>
              <div>
                {cartItems.map((item) => (
                  <div key={item.id}>
                    <p key={item.name}>Name: {item.name}</p>
                    <p key={item.price}>Price: {item.price}</p>
                    <p key={item.id}>Quantity: {item.orderItem.quantity}</p>
                  </div>
                ))}
              </div>
            </div>
          )
        } else {
          return (
            <div id="empty-cart">
              <h1>Your cart is empty... </h1>
              {/* <img src="/images/sad-flower.png"></img> */}
            </div>
          )
        }
      default:
        console.error('unknown products status')
    }
  }
}

const stateToProps = (state) => ({
  status: state.cart.status,
  cartItems: state.cart.products,
})

const dispatchToProps = (dispatch) => ({
  fetchCartDispatch: () => dispatch(fetchCart()),
})

const ConnectedCart = connect(stateToProps, dispatchToProps)(Cart)

export default ConnectedCart
