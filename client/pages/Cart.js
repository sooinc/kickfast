import React from 'react'
import {Link} from 'react-router-dom'
import {connect} from 'react-redux'

import {fetchCart} from '../store/cart'
import CartTile from '../components/cart-tile'
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
                  <h1>Your Shopping Cart</h1>
                </div>
                {cartItems.map((item) => (
                  <CartTile item={item} showControls={true} key={item.id} />
                ))}
              </div>

              <div className="cart-total">
                <h2 className="cart-total-inside">Subtotal</h2>
                <h3 className="cart-total-inside">
                  ${this.total().toFixed(2)}
                </h3>

                {this.props.user.id ? (
                  <div>
                    {/* <p>
                      Email for Receipt Confirmation: {this.props.user.email}
                    </p>
                    <Link to="/home">To Edit Email</Link> */}
                    <div>
                      <Link
                        to={{
                          pathname: '/checkout',
                          state: {
                            cartItems: cartItems,
                          },
                        }}
                        className="able"
                      >
                        Proceed To Checkout
                      </Link>
                    </div>
                  </div>
                ) : (
                  <div>
                    {/* <Link to="/signup">Signup</Link> */}
                    <Link
                      to={{
                        pathname: '/signup',
                        state: {
                          from: 'cart',
                        },
                      }}
                    >
                      Signup
                    </Link>
                    <p>or</p>
                    <Link
                      to={{
                        pathname: '/login',
                        state: {
                          from: 'cart',
                        },
                      }}
                    >
                      Login
                    </Link>
                    {/* <Link to="login">Login</Link> */}
                    <div>
                      <Link to={null} className="disable">
                        Proceed To Checkout
                      </Link>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )
        } else {
          return (
            <div id="empty-cart">
              <h1 className="empty-cart">Your cart is empty... </h1>
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
  user: state.user,
})

const dispatchToProps = (dispatch) => ({
  fetchCartDispatch: () => dispatch(fetchCart()),
})

const ConnectedCart = connect(stateToProps, dispatchToProps)(Cart)

export default ConnectedCart
