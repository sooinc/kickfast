import React from 'react'
import {connect} from 'react-redux'

import '../css/shop.css'
import {fetchSingleProxy} from '../store/shop'
import {addToCart} from '../store/cart'
import AddToCartButton from '../components/addtocart-button'
import QuantityDropdown from '../components/quantity-dropdown'

class SingleShop extends React.Component {
  constructor() {
    super()
    this.state = {quantity: 1}
    this.handleAddToCart = this.handleAddToCart.bind(this)
    this.handleQtyChange = this.handleQtyChange.bind(this)
  }

  componentDidMount() {
    let proxyId = this.props.proxyId
    this.props.fetchSingleProxyDispatch(proxyId)
  }

  handleAddToCart(event, id) {
    event.preventDefault()
    this.props.addToCartDispatch(id, this.state.quantity)
  }

  handleQtyChange(value) {
    this.setState({
      quantity: +value,
    })
  }

  render() {
    let {singleProxy} = this.props
    let proxyId = this.props.proxyId
    switch (this.props.status) {
      case 'loading':
        return <div>loading...</div>
      case 'error':
        return <div>Couldn't load product. Please try again!</div>
      case 'done':
        return (
          <div className="single-proxy-container">
            <div className="single-proxy-image">
              <img
                className="proxy-tile-image"
                src={singleProxy.image}
                alt={singleProxy.name}
                width="300"
                height="250"
              />
            </div>
            <div className="single-proxy-details-container">
              <div className="single-proxy-details">
                <h1>{singleProxy.name}</h1>
                <p>{singleProxy.description}</p>
                <h3>${singleProxy.price}</h3>
              </div>
              <div className="single-proxy-controls-container">
                <div className="single-proxy-qty">
                  <QuantityDropdown handleQtyChange={this.handleQtyChange} />
                </div>
                <div className="single-proxy-addtocart">
                  <AddToCartButton
                    className="pure-button button-primary button-large"
                    productId={proxyId}
                    singleProduct={singleProxy.name}
                    handleAddToCart={this.handleAddToCart}
                  />
                </div>
              </div>
            </div>
          </div>
        )
      default:
        console.error('unknown products status')
    }
  }
}

const stateToProps = (state, ownProps) => ({
  status: state.proxyReducer.status,
  proxyId: ownProps.match.params.proxyId,
  singleProxy: state.proxyReducer.singleProxy,
})

const dispatchToProps = (dispatch) => ({
  fetchSingleProxyDispatch: (proxyId) => dispatch(fetchSingleProxy(proxyId)),
  addToCartDispatch: (proxyId, newQty) => dispatch(addToCart(proxyId, newQty)),
})

const ConnectedSingleShop = connect(stateToProps, dispatchToProps)(SingleShop)

export default ConnectedSingleShop
