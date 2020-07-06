import React from 'react'
import ShoppingCartIcon from '@material-ui/icons/ShoppingCart'

const CartIcon = ({itemCount}) => (
  <div className="cart-icon">
    <p style={{margin: 0}} className="cart-count">
      {itemCount}
    </p>
    <ShoppingCartIcon />
  </div>
)

export default CartIcon
