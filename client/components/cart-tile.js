import React from 'react'
import {Link} from 'react-router-dom'
import {connect} from 'react-redux'

import {addToCart, deleteCartItem} from '../store/cart'

class CartTile extends React.Component {
  constructor() {
    super()
    this.handleIncrease = this.handleIncrease.bind(this)
    this.handleDecrease = this.handleDecrease.bind(this)
    // this.handleDelete = this.handleDelete.bind(this)
  }

  async handleIncrease(event) {
    event.preventDefault()
    const {item} = this.props
    await this.props.addToCartDispatch(item.id, 1)
  }

  async handleDecrease(event) {
    event.preventDefault()
    const {item} = this.props
    const currentQty = item.orderItem.quantity
    if (currentQty > 1) {
      await this.props.addToCartDispatch(item.id, -1)
    }
  }

  // async handleDelete(event) {
  //   event.preventDefault()
  //   const {item} = this.props
  //   await this.props.deleteCartItemDispatch(item.id)
  // }

  render() {
    const {item, showControls = false} = this.props
    const {quantity} = item.orderItem

    const price = <span>${(item.price * quantity).toFixed(2)}</span>

    const unitPrice =
      quantity === 1 ? null : <span>(${(+item.price).toFixed(2)} each)</span>

    return (
      <div>
        <div>
          <div>
            <h3>Image goes here</h3>
          </div>
          <div>
            <Link to={`/shop/${item.id}`}>{item.name}</Link>
            <p>
              {price}
              {unitPrice}
            </p>
          </div>
        </div>
        {showControls ? (
          <div>
            <div className="cartItem-controls">
              <div className="cartItem-controls-quantity">
                <label>Quantity</label>
                <button
                  id={item.id}
                  className="quantityBtn"
                  type="button"
                  onClick={this.handleDecrease}
                  disabled={quantity <= 1}
                >
                  -
                </button>
                <p>{quantity}</p>
                <button
                  id={item.id}
                  className="quantityBtn"
                  type="button"
                  onClick={this.handleIncrease}
                >
                  +
                </button>
              </div>
              <div className="cartItem-controls-delete">
                <button
                  className="deleteBtn"
                  type="button"
                  onClick={() => this.props.deleteCartItemDispatch(item.id)}
                >
                  Remove From Cart
                </button>
              </div>
            </div>
          </div>
        ) : (
          <div>
            <div>{quantity}</div>
          </div>
        )}
      </div>
    )
  }
}

const dispatchToProps = (dispatch) => ({
  addToCartDispatch: (proxyId, newQty) => dispatch(addToCart(proxyId, newQty)),
  deleteCartItemDispatch: (proxyId) => dispatch(deleteCartItem(proxyId)),
})

const ConnectedCartTile = connect(null, dispatchToProps)(CartTile)

export default ConnectedCartTile
