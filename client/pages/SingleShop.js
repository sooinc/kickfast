import React from 'react'
import {connect} from 'react-redux'
import {fetchSingleProxy} from '../store/shop'
// import {addToCart} from '../store/cart'
// import QuantityDropdown from '../components/QuantityDropdown'
// import AddToCartButton from '../components/AddToCartButton'

class SingleShop extends React.Component {
  constructor() {
    super()
    this.state = {quantity: 1}
    // this.handleQtyChange = this.handleQtyChange.bind(this)
    // this.handleAddToCart = this.handleAddToCart.bind(this)
  }

  componentDidMount() {
    let proxyId = this.props.proxyId
    this.props.fetchSingleProxyDispatch(proxyId)
  }

  // handleAddToCart(event) {
  //   event.preventDefault()
  //   let productId = event.target.id
  //   this.props.addToCartDispatch(productId, this.state.quantity)
  // }

  // handleQtyChange(value) {
  //   this.setState({
  //     quantity: +value
  //   })
  // }

  render() {
    let singleProxy = this.props.singleProxy
    let proxyId = this.props.proxyId
    return (
      <div className="page-wide single-product-page">
        <div className="single-product-main">
          <h1>{singleProxy.name}</h1>
          <h3>${singleProxy.price}</h3>
          <p>{singleProxy.description}</p>
        </div>
        {/* <div className="single-product-controls">
          <div className="card">
            <AddToCartButton
              className="pure-button button-primary button-large"
              productId={productId}
              singleProduct={singleProduct.name}
              handleAddToCart={this.handleAddToCart}
            />
            <QuantityDropdown handleQtyChange={this.handleQtyChange} />
          </div>
        </div> */}
      </div>
    )
  }
}

const stateToProps = (state, ownProps) => {
  return {
    status: state.proxyReducer.status,
    singleProxy: state.proxyReducer.singleProxy,
    proxyId: ownProps.match.params.proxyId,
  }
}

const dispatchToProps = (dispatch) => {
  return {
    fetchSingleProxyDispatch: (proxyId) => dispatch(fetchSingleProxy(proxyId)),
    // addToCartDispatch: (productId, updatedProduct) =>
    //   dispatch(addToCart(productId, updatedProduct))
  }
}

const ConnectedSingleShop = connect(stateToProps, dispatchToProps)(SingleShop)

export default ConnectedSingleShop
