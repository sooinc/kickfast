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

  handleAddToCart(event) {
    event.preventDefault()
    let proxyId = event.target.id
    this.props.addToCartDispatch(proxyId, this.state.quantity)
  }

  render() {
    const {proxy} = this.props
    const toProxy = `/shop/${proxy.id}`

    return (
      <div className="proxy-tile">
        <Link to={toProxy}>
          <img
            className="proxy-tile-image"
            src="https://images-na.ssl-images-amazon.com/images/I/41CyuoxrPvL._AC_SY355_.jpg"
            alt="smiley face"
            width="150"
            height="150"
          />
        </Link>
        <Link to={toProxy} className="product-link">
          {proxy.name}
        </Link>
        <p> ${proxy.price}</p>
        <AddToCartButton
          className="proxy-tile-addtocart"
          productId={proxy.id}
          singleProduct={proxy.name}
          handleAddToCart={this.handleAddToCart}
        />
      </div>
    )
  }
}

const dispatchToProps = (dispatch) => ({
  addToCartDispatch: (proxyId, newQty) => dispatch(addToCart(proxyId, newQty)),
})

const ConnectedProxyTile = connect(null, dispatchToProps)(ProxyTile)

export default ConnectedProxyTile
