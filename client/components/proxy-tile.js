import React from 'react'
import {connect} from 'react-redux'
import {Link} from 'react-router-dom'

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
    // const {proxy} = this.props
    this.props.addToCartDispatch(proxyId, this.state.quantity)
  }

  render() {
    const {proxy} = this.props
    const toProxy = `/shop/${proxy.id}`

    return (
      <div className="card card-hover product-card">
        <div className="product-card-body">
          <Link to={toProxy} className="product-link">
            {proxy.name}
          </Link>
          <Link to={toProxy} className="price">
            ${proxy.price}
          </Link>
        </div>
        <div>
          <AddToCartButton
            className="pure-button product-card-button button-small"
            productId={proxy.id}
            singleProduct={proxy.name}
            handleAddToCart={this.handleAddToCart}
          />
        </div>
      </div>
    )
  }
}

const dispatchToProps = (dispatch) => ({
  addToCartDispatch: (proxyId, newQty) => dispatch(addToCart(proxyId, newQty)),
})

const ConnectedProxyTile = connect(null, dispatchToProps)(ProxyTile)

export default ConnectedProxyTile
