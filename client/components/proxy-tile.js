import React from 'react'
import {connect} from 'react-redux'
import {Link} from 'react-router-dom'

import '../css/shop.css'
import {addToCart} from '../store/cart'
import AddToCartButton from './addtocart-button'

class ProxyTile extends React.Component {
  constructor() {
    super()
    this.state = {quantity: 1}
    this.handleAddToCart = this.handleAddToCart.bind(this)
  }

  handleAddToCart(event, id) {
    event.preventDefault()
    this.props.addToCartDispatch(id, this.state.quantity)
  }

  render() {
    const {proxy} = this.props
    const toProxy = `/shop/${proxy.id}`

    return (
      <div className="proxy-tile">
        <Link className="proxy-tile-link" to={toProxy}>
          <img
            className="proxy-tile-image"
            src={proxy.image}
            alt={proxy.name}
            width="160"
            height="150"
          />
          <p> ${proxy.price}</p>
          <AddToCartButton
            className="proxy-tile-addtocart"
            productId={proxy.id}
            singleProduct={proxy.name}
            handleAddToCart={this.handleAddToCart}
          />
        </Link>
      </div>
    )
  }
}

const dispatchToProps = (dispatch) => ({
  addToCartDispatch: (proxyId, newQty) => dispatch(addToCart(proxyId, newQty)),
})

const ConnectedProxyTile = connect(null, dispatchToProps)(ProxyTile)

export default ConnectedProxyTile
