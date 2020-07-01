import React from 'react'
import {Link} from 'react-router-dom'
import {connect} from 'react-redux'
import {addToCart, deleteCartItem} from '../store/cart'

import {Button, IconButton} from '@material-ui/core'
import {Remove, Add} from '@material-ui/icons'

class CartTile extends React.Component {
  constructor() {
    super()
    this.handleIncrease = this.handleIncrease.bind(this)
    this.handleDecrease = this.handleDecrease.bind(this)
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

  render() {
    const {item, showControls = false} = this.props
    const {quantity} = item.orderItem

    const price = <span>${(item.price * quantity).toFixed(2)}</span>

    const unitPrice =
      quantity === 1 ? null : <span>(${(+item.price).toFixed(2)} each)</span>

    return (
      <div className="cartItem-container">
        <div className="cartItem-image">
          <img
            className="proxy-tile-image"
            src={item.image}
            alt={item.name}
            width="120"
            height="110"
          />
        </div>
        <div className="cartItem-name-price">
          <Link to={`/shop/${item.id}`}>{item.name}</Link>
          <p className="cartItem-price">{price}</p>
          <p className="cartItem-unitprice">{unitPrice}</p>
        </div>
        {showControls ? (
          <div className="cartItem-controls-container">
            <div className="cartItem-controls-quantity">
              <div className="cartItem-qty-label">
                <label>Quantity:</label>
              </div>
              <IconButton
                id={item.id}
                onClick={this.handleDecrease}
                disabled={quantity <= 1}
              >
                <Remove />
              </IconButton>
              <div className="cartItem-qty">
                <p>{quantity}</p>
              </div>
              <IconButton id={item.id} onClick={this.handleIncrease}>
                <Add />
              </IconButton>
            </div>
            <div className="cartItem-controls-delete">
              <Button
                variant="outlined"
                size="medium"
                className="deleteBtn"
                type="button"
                onClick={() => this.props.deleteCartItemDispatch(item.id)}
              >
                Remove From Cart
              </Button>
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
