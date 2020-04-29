import React from 'react'
import {connect} from 'react-redux'
import {Link} from 'react-router-dom'

import {addToCart} from '../store/cart'
import AddToCartButton from '../components/addtocartButton'

class ProxyTile extends React.Component {
  constructor() {
    super()
    this.handleAddToCart = this.handleAddToCart.bind(this)
  }

  handleAddToCart(event) {
    event.preventDefault()
    let proxyId = event.target.id
    this.props.addToCart(proxyId, 1)
  }

  render() {
    const {proxy} = this.props
    const toProxy = `/shop/${proxy.id}`

    return (
      <div className="card card-hover product-card">
        <div>
          <AddToCartButton
            productId={proxy.id}
            className="pure-button product-card-button button-small"
            singleProduct={proxy.name}
            handleAddToCart={this.handleAddToCart}
          />
        </div>
        <div className="product-card-body">
          <Link to={toProxy} className="product-link">
            {proxy.name}
          </Link>
          <Link to={toProxy} className="price">
            ${proxy.price}
          </Link>
        </div>
      </div>
    )
  }
}

const dispatchToProps = (dispatch) => ({
  addToCartDispatch: (proxyId) => dispatch(addToCart(proxyId)),
})

const ConnectedProxyTile = connect(null, dispatchToProps)(ProxyTile)

export default ConnectedProxyTile
