import React from 'react'
import {connect} from 'react-redux'

import {fetchSingleProxy} from '../store/shop'
import {addToCart} from '../store/cart'
import AddToCartButton from '../components/addtocart-button'
// import QuantityDropdown from '../components/QuantityDropdown'

class SingleShop extends React.Component {
  constructor() {
    super()
    this.state = {quantity: 1}
    this.handleAddToCart = this.handleAddToCart.bind(this)
    // this.handleQtyChange = this.handleQtyChange.bind(this)
  }

  componentDidMount() {
    let proxyId = this.props.proxyId
    this.props.fetchSingleProxyDispatch(proxyId)
  }

  handleAddToCart(event) {
    event.preventDefault()
    let proxyId = event.target.id
    this.props.addToCartDispatch(proxyId, this.state.quantity)
  }

  // handleQtyChange(value) {
  //   this.setState({
  //     quantity: +value
  //   })
  // }

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
          <div className="page-wide single-product-page">
            <div className="single-product-main">
              <h1>{singleProxy.name}</h1>
              <h3>${singleProxy.price}</h3>
              <p>{singleProxy.description}</p>
            </div>
            <div className="single-product-controls">
              <div className="card">
                <AddToCartButton
                  className="pure-button button-primary button-large"
                  productId={proxyId}
                  singleProduct={singleProxy.name}
                  handleAddToCart={this.handleAddToCart}
                />
                {/* <QuantityDropdown handleQtyChange={this.handleQtyChange} /> */}
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
