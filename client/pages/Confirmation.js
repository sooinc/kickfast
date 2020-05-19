import React from 'react'
import {connect} from 'react-redux'
import {Link} from 'react-router-dom'

class Confirmation extends React.Component {
  total = (cart) => {
    return cart
      .map((item) => item.price * item.orderItem.quantity)
      .reduce((currTotal, itemTotal) => {
        return currTotal + itemTotal
      }, 0)
      .toFixed(2)
  }

  render() {
    let {status, order, user, billingEmail, ip} = this.props
    let guest = 'there' //for later
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
            <h1>Hey {user.name || guest},</h1>
            <div id="confirmation-page">
              <h2> Your order is confirmed!</h2>
            </div>
            <h3>
              Thanks for shopping at KickFast. Please check your email (
              {billingEmail}) for your receipt!
            </h3>
            <h3>Order Confirmation Number:&nbsp;{order.id}</h3>
            <h3>For I.P. Address:&nbsp;{ip}</h3>
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
  status: state.checkout.status,
  order: state.checkout.confirmedOrder,
  billingEmail: state.checkout.billingEmail,
  ip: state.checkout.ip,
  user: state.user,
})

const ConnectedConfirmation = connect(stateToProps, null)(Confirmation)

export default ConnectedConfirmation
