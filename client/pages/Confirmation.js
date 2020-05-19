import React from 'react'
import {connect} from 'react-redux'
import {Link} from 'react-router-dom'

import {getConfirmedOrder} from '../store/checkout'

class Confirmation extends React.Component {
  componentDidMount() {
    this.props.getConfirmedOrder()
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
          <div>
            <h1>Hey {user.name},</h1>
            <h3>
              Thanks for shopping at KickFast. Please check your email (
              {order.billingEmail}) for your receipt!
            </h3>
            <h3>Order Confirmation Number:&nbsp;{order.id}</h3>
            <h3>For I.P. Address:&nbsp;{order.ipAddress}</h3>
            {order.proxies.map((item) => (
              <div key={item.id} id="confirmation-tile">
                <ul>
                  {/* <img src={item.image}></img> */}
                  <li>{item.name}</li>
                  <p>Quantity: {item.orderItem.quantity}</p>
                  <p>
                    Subtotal: ${item.price * item.orderItem.quantity.toFixed(2)}{' '}
                  </p>
                </ul>
              </div>
            ))}
            <div>
              <h3>Total: ${this.total(order.proxies)}</h3>
              <Link to="/shop">Return to Shop</Link>&nbsp;<p>or</p>&nbsp;
              <Link to="/home">View your Account</Link>
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
  user: state.user,
  status: state.checkout.status,
  order: state.checkout.confirmedOrder,
})

const dispatchToProps = (dispatch) => ({
  getConfirmedOrder: () => dispatch(getConfirmedOrder()),
})

const ConnectedConfirmation = connect(
  stateToProps,
  dispatchToProps
)(Confirmation)

export default ConnectedConfirmation
