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

    // const FancyLink = React.forwardRef((null, ref) => (
    //   <a className="proxy-name"></a>
    // ))

    return (
      <div className="proxy-tile">
        <Link component={FancyLink} to={toProxy}>
          <p className="proxy-name1">Proxy</p>
          {proxy.name === '1GB - 1 Month' ? (
            <div className="proxy-name1">
              <p>1 Gig </p> <p> 1 Month</p>{' '}
            </div>
          ) : null}
          {proxy.name === '1GB - 1 Week' ? (
            <div className="proxy-name1">
              {' '}
              <p>1 Gig </p> <p> 1 Week</p>
            </div>
          ) : null}
          {proxy.name === '1GB - 1 Day' ? (
            <div className="proxy-name1">
              <p>1 Gig </p> <p> 1 Day</p>{' '}
            </div>
          ) : null}
          <p> ${proxy.price}</p>
        </Link>
        {/* <img
            className="proxy-tile-image"
            src="https://images-na.ssl-images-amazon.com/images/I/41CyuoxrPvL._AC_SY355_.jpg"
            alt="smiley face"
            width="150"
            height="150"
          /> */}
        {/* <Link to={toProxy} className="product-link">
          {proxy.name}
        </Link> */}

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
