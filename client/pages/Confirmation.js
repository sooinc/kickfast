import React from 'react'
import {connect} from 'react-redux'
import {Link} from 'react-router-dom'
import {getConfirmedOrder} from '../store/checkout'
import {me} from '../store/user'
import CartTile from '../components/cart-tile'
import '../css/confirmation.css'

class Confirmation extends React.Component {
  componentDidMount() {
    this.props.getConfirmedOrder()
    this.props.me()
  }

  total = (cart) => {
    return cart
      .map((item) => item.price * item.orderItem.quantity)
      .reduce((currTotal, itemTotal) => {
        return currTotal + itemTotal
      }, 0)
      .toFixed(2)
  }

  render() {
    console.log('this is inside confirmation', this.props.order)
    let {user, status, order} = this.props
    switch (status) {
      case 'loading':
        return <div>loading...</div>
      case 'error':
        return (
          <div>
            Couldn't load page. Please contact customer services to confirm that
            your order was received.
          </div>
        )
      case 'done':
        return (
          <div className="confirmation">
            <h1>Hi&nbsp;{user.name}!</h1>
            <h3>
              Thanks for shopping at KickFast. Please check your email (
              {order.billingEmail}) for your receipt.
            </h3>
            <h3>Order Confirmation.&nbsp;&nbsp;#{order.id}</h3>
            <div className="confirmation-ip">
              <h3>For I.P. Address.&nbsp;&nbsp;</h3>
              {user.ipAddress
                ? user.ipAddress.map((ip, idx) => {
                    if (idx === user.ipAddress.length - 1) {
                      return <p key={ip}>{ip}</p>
                    } else {
                      return <p key={ip}>{ip},</p>
                    }
                  })
                : null}
            </div>
            <div className="confirmation-items">
              {order.proxies.map((item) => (
                <CartTile item={item} showControls={false} key={item.id} />
              ))}
              <div className="confirmation-items-total">
                <h2>Total.</h2>
                <p className="confirmation-items-totalprice">
                  {' '}
                  ${this.total(order.proxies)}
                </p>
              </div>
            </div>
            <div className="confirmation-links-container">
              <Link className="confirmation-link-shop" to="/shop">
                Return to Shop
              </Link>
              <p>or</p>
              <Link className="confirmation-link-account" to="/home">
                Go to your Account
              </Link>
            </div>
          </div>
        )
      default:
        console.error(
          'unknown confirmation status. please contact 1-800-kickfast'
        )
    }
  }
}

const stateToProps = (state) => ({
  user: state.user.user,
  status: state.checkout.status,
  order: state.checkout.confirmedOrder,
})

const dispatchToProps = (dispatch) => ({
  getConfirmedOrder: () => dispatch(getConfirmedOrder()),
  me: () => dispatch(me()),
})

const ConnectedConfirmation = connect(
  stateToProps,
  dispatchToProps
)(Confirmation)

export default ConnectedConfirmation
