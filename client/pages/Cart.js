import React from 'react'
import {Link} from 'react-router-dom'
import {connect} from 'react-redux'
import CartTile from '../components/cart-tile'
import {fetchCart} from '../store/cart'
import '../css/cart.css'

export class Cart extends React.Component {
  componentDidMount() {
    this.props.fetchCartDispatch()
  }

  total = () => {
    return this.props.cartItems
      .map((item) => item.price * item.orderItem.quantity)
      .reduce((currTotal, itemTotal) => currTotal + itemTotal)
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
            <div className="cart">
              <div className="cartTile-container">
                <div className="cartTile-header">
                  <h1>Shopping Cart.</h1>
                </div>
                {cartItems.map((item) => (
                  <CartTile item={item} showControls={true} key={item.id} />
                ))}
              </div>

              <div className="cart-total">
                <div className="cart-total-header">
                  <div className="cart-total-subtotal">
                    <h2>Subtotal.</h2>
                  </div>
                  <div className="cart-total-price">
                    <h3>${this.total().toFixed(2)}</h3>
                  </div>
                </div>

                {this.props.user.id ? (
                  <div className="cart-total-loggedin">
                    <Link
                      to={{
                        pathname: '/checkout',
                        state: {
                          cartItems: cartItems,
                        },
                      }}
                      className="cart-total-link"
                    >
                      Proceed to Checkout
                    </Link>
                  </div>
                ) : (
                  <div className="cart-total-loggedout">
                    <p className="cart-total-loggedout-text">
                      To proceed to checkout:
                    </p>
                    <div className="cart-total-loggedout-inner">
                      <Link
                        to={{
                          pathname: '/signup',
                          state: {
                            from: 'cart',
                          },
                        }}
                        className="cart-total-link"
                      >
                        Sign Up
                      </Link>
                      <p>or</p>
                      <Link
                        to={{
                          pathname: '/login',
                          state: {
                            from: 'cart',
                          },
                        }}
                        className="cart-total-link"
                      >
                        Login
                      </Link>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )
        } else {
          return (
            <div className="empty-cart">
              <h1 className="empty-cart-headline">Your cart is empty... </h1>
              <Link className="empty-cart-shop" to="/shop#shop">
                Back to Shop
              </Link>
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
  user: state.user.user,
})

const dispatchToProps = (dispatch) => ({
  fetchCartDispatch: () => dispatch(fetchCart()),
})

const ConnectedCart = connect(stateToProps, dispatchToProps)(Cart)

export default ConnectedCart
